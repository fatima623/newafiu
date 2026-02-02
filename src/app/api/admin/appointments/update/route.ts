import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getPrisma } from '@/lib/prisma';
import { sendAppointmentUpdateEmail, sendAppointmentCancellationEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getPrisma();
    const body = await request.json();
    const { 
      appointmentId, 
      action, // 'update' or 'cancel'
      doctorId, 
      appointmentDate, 
      slotNumber,
      reason // Required for both update and cancel
    } = body;

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'appointmentId is required' },
        { status: 400 }
      );
    }

    if (!reason || reason.trim().length < 5) {
      return NextResponse.json(
        { error: 'A reason (at least 5 characters) is required for this action' },
        { status: 400 }
      );
    }

    // Fetch the current appointment with faculty info
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(appointmentId, 10) },
      include: {
        faculty: {
          select: {
            id: true,
            name: true,
            designation: true,
          },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Handle cancellation
    if (action === 'cancel') {
      await prisma.appointment.update({
        where: { id: parseInt(appointmentId, 10) },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancelReason: reason,
        },
      });

      // Create audit log
      await prisma.appointmentAuditLog.create({
        data: {
          appointmentId: parseInt(appointmentId, 10),
          action: 'CANCELLED_BY_ADMIN',
          previousStatus: appointment.status,
          newStatus: 'CANCELLED',
          performedBy: 'Admin',
          details: JSON.stringify({ reason }),
        },
      });

      // Send cancellation email
      try {
        await sendAppointmentCancellationEmail({
          patientName: appointment.patientName,
          patientEmail: appointment.patientEmail,
          patientPhone: appointment.patientPhone,
          doctorName: appointment.faculty.name,
          appointmentDate: appointment.appointmentDate,
          slotStartTime: appointment.slotStartTime,
          slotEndTime: appointment.slotEndTime,
          reason: reason,
        });
      } catch (emailError) {
        console.error('Failed to send cancellation email:', emailError);
        // Don't fail the request if email fails
      }

      return NextResponse.json({
        success: true,
        message: 'Appointment cancelled and patient notified',
      });
    }

    // Handle update
    if (action === 'update') {
      if (!doctorId && !appointmentDate && !slotNumber) {
        return NextResponse.json(
          { error: 'At least one field to update is required' },
          { status: 400 }
        );
      }

      const updateData: Record<string, unknown> = {};
      const changes: string[] = [];
      
      let newDoctor = appointment.faculty;
      let newDate = appointment.appointmentDate;
      let newSlotStart = appointment.slotStartTime;
      let newSlotEnd = appointment.slotEndTime;

      // Update doctor if specified
      if (doctorId && parseInt(doctorId) !== appointment.facultyId) {
        const doctor = await prisma.faculty.findUnique({
          where: { id: parseInt(doctorId, 10) },
          select: { id: true, name: true, designation: true },
        });
        
        if (!doctor) {
          return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
        }
        
        updateData.facultyId = parseInt(doctorId, 10);
        changes.push(`Doctor changed from ${appointment.faculty.name} to ${doctor.name}`);
        newDoctor = doctor;
      }

      // Update date if specified
      if (appointmentDate) {
        const newDateObj = new Date(appointmentDate);
        updateData.appointmentDate = newDateObj;
        changes.push(`Date changed from ${appointment.appointmentDate.toLocaleDateString()} to ${newDateObj.toLocaleDateString()}`);
        newDate = newDateObj;
      }

      // Update slot if specified
      if (slotNumber) {
        const slot = parseInt(slotNumber, 10);
        const slotTimes = getSlotTimes(slot);
        updateData.slotNumber = slot;
        updateData.slotStartTime = slotTimes.start;
        updateData.slotEndTime = slotTimes.end;
        changes.push(`Time slot changed to Slot ${slot} (${slotTimes.start} - ${slotTimes.end})`);
        newSlotStart = slotTimes.start;
        newSlotEnd = slotTimes.end;
      }

      // Perform update
      await prisma.appointment.update({
        where: { id: parseInt(appointmentId, 10) },
        data: updateData,
      });

      // Create audit log
      await prisma.appointmentAuditLog.create({
        data: {
          appointmentId: parseInt(appointmentId, 10),
          action: 'UPDATED_BY_ADMIN',
          previousStatus: appointment.status,
          newStatus: appointment.status,
          performedBy: 'Admin',
          details: JSON.stringify({ reason, changes }),
        },
      });

      // Send update email
      try {
        await sendAppointmentUpdateEmail({
          patientName: appointment.patientName,
          patientEmail: appointment.patientEmail,
          patientPhone: appointment.patientPhone,
          oldDoctorName: appointment.faculty.name,
          newDoctorName: newDoctor.name,
          oldDate: appointment.appointmentDate,
          newDate: newDate,
          oldSlotStart: appointment.slotStartTime,
          oldSlotEnd: appointment.slotEndTime,
          newSlotStart: newSlotStart,
          newSlotEnd: newSlotEnd,
          reason: reason,
          changes: changes,
        });
      } catch (emailError) {
        console.error('Failed to send update email:', emailError);
        // Don't fail the request if email fails
      }

      return NextResponse.json({
        success: true,
        message: 'Appointment updated and patient notified',
        changes,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "update" or "cancel"' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

// Helper function to get slot times
function getSlotTimes(slotNumber: number): { start: string; end: string } {
  const slots: Record<number, { start: string; end: string }> = {
    1: { start: '15:00', end: '15:15' },
    2: { start: '15:15', end: '15:30' },
    3: { start: '15:30', end: '15:45' },
    4: { start: '15:45', end: '16:00' },
    5: { start: '16:00', end: '16:15' },
    6: { start: '16:15', end: '16:30' },
    7: { start: '16:30', end: '16:45' },
    8: { start: '16:45', end: '17:00' },
    9: { start: '17:00', end: '17:15' },
    10: { start: '17:15', end: '17:30' },
    11: { start: '17:30', end: '17:45' },
    12: { start: '17:45', end: '18:00' },
  };
  return slots[slotNumber] || { start: '15:00', end: '15:15' };
}
