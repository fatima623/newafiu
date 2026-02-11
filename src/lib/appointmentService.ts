import { getPrisma } from './prisma';

// Business Rules Constants
export const APPOINTMENT_CONFIG = {
  MAX_APPOINTMENTS_PER_DAY: 10,
  SLOT_DURATION_MINUTES: 15,
  START_TIME: '15:00',
  END_TIME: '18:00',
  ALLOWED_DAYS: [1, 2, 3, 4, 5], // Monday to Friday (0 = Sunday)
  BOOKING_CUTOFF_MINUTES: 45,
  TOTAL_POSSIBLE_SLOTS: 12, // 3 hours / 15 minutes = 12 slots
  MAX_BOOKING_DAYS_AHEAD: 7,
};

export interface SlotInfo {
  slotNumber: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBooked: boolean;
  status: 'available' | 'booked' | 'unavailable' | 'disabled' | 'doctor_absent';
}

export interface DoctorAvailabilityInfo {
  doctorId: number;
  doctorName: string;
  designation: string;
  image: string | null;
  date: string;
  isAvailable: boolean;
  availabilityNote: string | null;
  slots: SlotInfo[];
  bookedCount: number;
  remainingSlots: number;
}

// Generate time slots based on configuration
export function generateTimeSlots(): { slotNumber: number; startTime: string; endTime: string }[] {
  const slots = [];
  const [startHour, startMinute] = APPOINTMENT_CONFIG.START_TIME.split(':').map(Number);
  const [endHour, endMinute] = APPOINTMENT_CONFIG.END_TIME.split(':').map(Number);
  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;
  const totalPossibleSlots = Math.floor(
    (endTotalMinutes - startTotalMinutes) / APPOINTMENT_CONFIG.SLOT_DURATION_MINUTES
  );
  
  for (let i = 0; i < totalPossibleSlots; i++) {
    const totalMinutes = startTotalMinutes + i * APPOINTMENT_CONFIG.SLOT_DURATION_MINUTES;
    const endTotalMinutes = totalMinutes + APPOINTMENT_CONFIG.SLOT_DURATION_MINUTES;
    
    const startH = Math.floor(totalMinutes / 60);
    const startM = totalMinutes % 60;
    const endH = Math.floor(endTotalMinutes / 60);
    const endM = endTotalMinutes % 60;
    
    slots.push({
      slotNumber: i + 1,
      startTime: `${startH.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')}`,
      endTime: `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`,
    });
  }
  
  return slots;
}

function parseDateOnly(dateStr: string): Date {
  // Store/compare MySQL DATE values in a timezone-stable way.
  // Prisma serializes JS Dates in UTC; constructing via Date.UTC prevents
  // local timezone shifts (e.g., PKT) from changing the calendar date.
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getPakistanPublicHolidays(year: number): Set<string> {
  const fixed = [
    `${year}-01-01`,
    `${year}-02-05`,
    `${year}-03-23`,
    `${year}-05-01`,
    `${year}-08-14`,
    `${year}-09-06`,
    `${year}-11-09`,
    `${year}-12-25`,
  ];
  return new Set(fixed);
}

export function isBookingDateDisabled(date: Date): boolean {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const max = new Date(today);
  max.setDate(max.getDate() + APPOINTMENT_CONFIG.MAX_BOOKING_DAYS_AHEAD);
  if (date < today) return true;
  if (date > max) return true;
  if (!isValidBookingDay(date)) return true;
  const key = toISODate(date);
  const holidays = getPakistanPublicHolidays(date.getFullYear());
  if (holidays.has(key)) return true;
  return false;
}

// Check if a date is a valid booking day (Mon-Fri)
export function isValidBookingDay(date: Date): boolean {
  const dayOfWeek = date.getDay();
  return APPOINTMENT_CONFIG.ALLOWED_DAYS.includes(dayOfWeek);
}

// Check if a slot is expired (past current time)
export function isSlotDisabled(date: Date, slotStartTime: string): boolean {
  const now = new Date();
  const [hours, minutes] = slotStartTime.split(':').map(Number);
  
  const slotDateTime = new Date(date);
  slotDateTime.setHours(hours, minutes, 0, 0);
  
  // Add cutoff buffer
  const cutoffTime = new Date(slotDateTime.getTime() - APPOINTMENT_CONFIG.BOOKING_CUTOFF_MINUTES * 60 * 1000);
  
  return now >= cutoffTime;
}

// Get available slots for a doctor on a specific date
export async function getAvailableSlots(
  doctorId: number,
  dateStr: string
): Promise<DoctorAvailabilityInfo | null> {
  const prisma = getPrisma();
  const date = parseDateOnly(dateStr);
  
  // Validate day of week
  if (isBookingDateDisabled(date)) {
    return null;
  }
  
  // Get doctor info
  const doctor = await prisma.faculty.findUnique({
    where: { id: doctorId },
  });
  
  if (!doctor) {
    return null;
  }
  
  // Check for availability override
  const availabilityOverride = await prisma.doctorAvailability.findUnique({
    where: {
      facultyId_date: {
        facultyId: doctorId,
        date: date,
      },
    },
  });

  const availabilityNote = availabilityOverride && !availabilityOverride.isAvailable
    ? availabilityOverride.reason || 'Doctor is not available on this date'
    : null;
  
  // If doctor is marked as unavailable for full day
  if (availabilityOverride && !availabilityOverride.isAvailable) {
    // Check if it's full day unavailability
    if (!availabilityOverride.unavailabilityType || availabilityOverride.unavailabilityType === 'FULL_DAY') {
      return {
        doctorId: doctor.id,
        doctorName: doctor.name,
        designation: doctor.designation,
        image: doctor.image,
        date: dateStr,
        isAvailable: false,
        availabilityNote,
        slots: [],
        bookedCount: 0,
        remainingSlots: 0,
      };
    }
  }
  
  // Get blocked slots if specific slots are blocked
  let blockedSlotNumbers: number[] = [];
  if (availabilityOverride && !availabilityOverride.isAvailable && 
      availabilityOverride.unavailabilityType === 'SPECIFIC_SLOTS' && 
      availabilityOverride.blockedSlots) {
    try {
      blockedSlotNumbers = JSON.parse(availabilityOverride.blockedSlots);
    } catch {
      blockedSlotNumbers = [];
    }
  }
  
  // Get existing appointments for this doctor on this date
  const existingAppointments = await prisma.appointment.findMany({
    where: {
      facultyId: doctorId,
      appointmentDate: date,
      status: {
        in: ['PENDING', 'CONFIRMED'],
      },
    },
  });
  
  const bookedSlotNumbers = new Set(existingAppointments.map((a: { slotNumber: number }) => a.slotNumber));
  const allSlots = generateTimeSlots();
  const dailyLimitReached = bookedSlotNumbers.size >= APPOINTMENT_CONFIG.MAX_APPOINTMENTS_PER_DAY;
  
  // Build slot availability info
  const slots: SlotInfo[] = allSlots.map(slot => {
    const isBooked = bookedSlotNumbers.has(slot.slotNumber);
    const isDisabled = isSlotDisabled(date, slot.startTime);
    const isBlocked = blockedSlotNumbers.includes(slot.slotNumber);
    const isWithinLimit = !dailyLimitReached;
    
    let status: SlotInfo['status'] = 'available';
    if (isBooked) {
      status = 'booked';
    } else if (isBlocked) {
      status = 'doctor_absent';
    } else if (isDisabled) {
      status = 'disabled';
    } else if (!isWithinLimit) {
      status = 'unavailable';
    }
    
    return {
      ...slot,
      isAvailable: !isBooked && !isDisabled && !isBlocked && isWithinLimit,
      isBooked,
      status,
    };
  });

  return {
    doctorId: doctor.id,
    doctorName: doctor.name,
    designation: doctor.designation,
    image: doctor.image,
    date: dateStr,
    isAvailable: true,
    availabilityNote,
    slots,
    bookedCount: bookedSlotNumbers.size,
    remainingSlots: Math.max(0, APPOINTMENT_CONFIG.MAX_APPOINTMENTS_PER_DAY - bookedSlotNumbers.size),
  };
}

// Book an appointment with concurrency safety
export async function bookAppointment(data: {
  doctorId: number;
  patientName: string;
  patientCnic: string;
  patientPhone: string;
  patientEmail: string;
  appointmentDate: string;
  slotNumber: number;
  notes?: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<{ success: boolean; appointment?: any; error?: string }> {
  const prisma = getPrisma();
  const date = parseDateOnly(data.appointmentDate);
  
  // Validate day of week
  if (isBookingDateDisabled(date)) {
    return { success: false, error: 'Selected date is not available for booking' };
  }
  
  // Validate slot number
  const allSlots = generateTimeSlots();
  if (data.slotNumber < 1 || data.slotNumber > allSlots.length) {
    return { success: false, error: 'Invalid slot number' };
  }
  const selectedSlot = allSlots.find(s => s.slotNumber === data.slotNumber);
  
  if (!selectedSlot) {
    return { success: false, error: 'Invalid slot' };
  }
  
  // Check if slot is expired
  if (isSlotDisabled(date, selectedSlot.startTime)) {
    return {
      success: false,
      error: `Bookings close ${APPOINTMENT_CONFIG.BOOKING_CUTOFF_MINUTES} minutes before the appointment time`,
    };
  }
  
  try {
    // Use transaction for concurrency safety
    const result = await prisma.$transaction(async (tx) => {
      // Check doctor availability
      const availabilityOverride = await tx.doctorAvailability.findUnique({
        where: {
          facultyId_date: {
            facultyId: data.doctorId,
            date: date,
          },
        },
      });
      
      if (availabilityOverride && !availabilityOverride.isAvailable) {
        throw new Error('Doctor is not available on this date');
      }
      
      // Check if slot is already booked (with row-level locking via transaction)
      const existingBooking = await tx.appointment.findUnique({
        where: {
          facultyId_appointmentDate_slotNumber: {
            facultyId: data.doctorId,
            appointmentDate: date,
            slotNumber: data.slotNumber,
          },
        },
      });
      
      if (existingBooking && ['PENDING', 'CONFIRMED'].includes(existingBooking.status)) {
        throw new Error('This slot has already been booked');
      }
      
      // If there's a cancelled/expired booking for this slot, delete it to allow rebooking
      if (existingBooking && ['CANCELLED', 'EXPIRED', 'COMPLETED'].includes(existingBooking.status)) {
        await tx.appointment.delete({
          where: { id: existingBooking.id },
        });
      }
      
      // Check daily limit
      const dailyCount = await tx.appointment.count({
        where: {
          facultyId: data.doctorId,
          appointmentDate: date,
          status: {
            in: ['PENDING', 'CONFIRMED'],
          },
        },
      });
      
      if (dailyCount >= APPOINTMENT_CONFIG.MAX_APPOINTMENTS_PER_DAY) {
        throw new Error('Maximum appointments reached for this doctor on this date');
      }
      
      // Check for duplicate booking by same patient
      const duplicateBooking = await tx.appointment.findFirst({
        where: {
          facultyId: data.doctorId,
          appointmentDate: date,
          patientCnic: data.patientCnic,
          status: {
            in: ['PENDING', 'CONFIRMED'],
          },
        },
      });
      
      if (duplicateBooking) {
        throw new Error('You already have an appointment with this doctor on this date');
      }
      
      // Create appointment
      const appointment = await tx.appointment.create({
        data: {
          facultyId: data.doctorId,
          patientName: data.patientName,
          patientCnic: data.patientCnic,
          patientPhone: data.patientPhone,
          patientEmail: data.patientEmail,
          appointmentDate: date,
          slotStartTime: selectedSlot.startTime,
          slotEndTime: selectedSlot.endTime,
          slotNumber: data.slotNumber,
          status: 'PENDING',
          notes: data.notes || null,
        },
        include: {
          faculty: true,
        },
      });
      
      // Create audit log
      await tx.appointmentAuditLog.create({
        data: {
          appointmentId: appointment.id,
          action: 'BOOKING_CREATED',
          newStatus: 'PENDING',
          performedBy: data.patientName,
          ipAddress: data.ipAddress || null,
          userAgent: data.userAgent || null,
          details: JSON.stringify({
            slotNumber: data.slotNumber,
            slotTime: `${selectedSlot.startTime} - ${selectedSlot.endTime}`,
          }),
        },
      });
      
      return appointment;
    });
    
    return { success: true, appointment: result };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to book appointment';
    return { success: false, error: message };
  }
}

// Cancel an appointment
export async function cancelAppointment(
  appointmentId: number,
  cancelReason: string,
  performedBy: string,
  ipAddress?: string
): Promise<{ success: boolean; error?: string }> {
  const prisma = getPrisma();
  
  try {
    await prisma.$transaction(async (tx) => {
      const appointment = await tx.appointment.findUnique({
        where: { id: appointmentId },
      });
      
      if (!appointment) {
        throw new Error('Appointment not found');
      }
      
      if (!['PENDING', 'CONFIRMED'].includes(appointment.status)) {
        throw new Error('This appointment cannot be cancelled');
      }
      
      // Check if slot time has passed
      const slotDateTime = new Date(appointment.appointmentDate);
      const [hours, minutes] = appointment.slotStartTime.split(':').map(Number);
      slotDateTime.setHours(hours, minutes, 0, 0);
      
      if (new Date() >= slotDateTime) {
        throw new Error('Cannot cancel an appointment after its scheduled time');
      }
      
      const previousStatus = appointment.status;
      
      // Update appointment
      await tx.appointment.update({
        where: { id: appointmentId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancelReason: cancelReason,
        },
      });
      
      // Create audit log
      await tx.appointmentAuditLog.create({
        data: {
          appointmentId: appointmentId,
          action: 'APPOINTMENT_CANCELLED',
          previousStatus: previousStatus,
          newStatus: 'CANCELLED',
          performedBy: performedBy,
          ipAddress: ipAddress || null,
          details: JSON.stringify({ reason: cancelReason }),
        },
      });
    });
    
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to cancel appointment';
    return { success: false, error: message };
  }
}

// Get appointments for a patient by CNIC or email
export async function getPatientAppointments(
  identifier: string,
  type: 'cnic' | 'email'
): Promise<any[]> {
  const prisma = getPrisma();
  
  const where = type === 'cnic' 
    ? { patientCnic: identifier }
    : { patientEmail: identifier };
  
  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      faculty: {
        select: {
          id: true,
          name: true,
          designation: true,
          image: true,
        },
      },
    },
    orderBy: [
      { appointmentDate: 'desc' },
      { slotStartTime: 'desc' },
    ],
  });
  
  return appointments;
}

// Get doctor's schedule for a date
export async function getDoctorSchedule(
  doctorId: number,
  dateStr: string
): Promise<any[]> {
  const prisma = getPrisma();
  const date = parseDateOnly(dateStr);
  
  const appointments = await prisma.appointment.findMany({
    where: {
      facultyId: doctorId,
      appointmentDate: date,
    },
    orderBy: { slotNumber: 'asc' },
  });
  
  return appointments;
}

// Mark doctor as unavailable
export async function setDoctorAvailability(
  doctorId: number,
  dateStr: string,
  isAvailable: boolean,
  reason?: string,
  overrideType?: 'LEAVE' | 'EMERGENCY_BLOCK' | 'CUSTOM_HOURS'
): Promise<{ success: boolean; error?: string }> {
  const prisma = getPrisma();
  const date = parseDateOnly(dateStr);
  
  try {
    await prisma.doctorAvailability.upsert({
      where: {
        facultyId_date: {
          facultyId: doctorId,
          date: date,
        },
      },
      update: {
        isAvailable,
        reason: reason || null,
        overrideType: overrideType || null,
      },
      create: {
        facultyId: doctorId,
        date: date,
        isAvailable,
        reason: reason || null,
        overrideType: overrideType || null,
      },
    });
    
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update availability';
    return { success: false, error: message };
  }
}

// Get all doctors available for booking
export async function getDoctorsForBooking(): Promise<any[]> {
  const prisma = getPrisma();
  
  const doctors = await prisma.faculty.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      designation: true,
      specializationCategory: true,
      image: true,
    },
  });
  
  return doctors;
}

// Auto-mark past appointments as completed or expired (for cron job)
export async function processExpiredAppointments(): Promise<{ updated: number }> {
  const prisma = getPrisma();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Find appointments that are past their time
  const expiredAppointments = await prisma.appointment.findMany({
    where: {
      status: {
        in: ['PENDING', 'CONFIRMED'],
      },
      appointmentDate: {
        lt: today,
      },
    },
  });
  
  let updated = 0;
  
  for (const appointment of expiredAppointments) {
    await prisma.$transaction(async (tx) => {
      await tx.appointment.update({
        where: { id: appointment.id },
        data: {
          status: 'EXPIRED',
        },
      });
      
      await tx.appointmentAuditLog.create({
        data: {
          appointmentId: appointment.id,
          action: 'AUTO_EXPIRED',
          previousStatus: appointment.status,
          newStatus: 'EXPIRED',
          performedBy: 'SYSTEM',
          details: 'Automatically expired by system cron job',
        },
      });
      
      updated++;
    });
  }
  
  return { updated };
}
