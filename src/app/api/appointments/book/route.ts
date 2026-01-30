import { NextRequest, NextResponse } from 'next/server';
import { bookAppointment } from '@/lib/appointmentService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      doctorId,
      patientName,
      patientCnic,
      patientPhone,
      patientEmail,
      appointmentDate,
      slotNumber,
      notes,
    } = body;

    // Validate required fields
    if (!doctorId || !patientName || !patientCnic || !patientPhone || !patientEmail || !appointmentDate || !slotNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate CNIC format
    const cnicRegex = /^(\d{5}-\d{7}-\d|\d{13})$/;
    if (!cnicRegex.test(patientCnic.trim())) {
      return NextResponse.json(
        { error: 'Invalid CNIC format' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(patientEmail.trim())) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone format
    const phoneRegex = /^\+?\d{7,15}$/;
    if (!phoneRegex.test(patientPhone.trim())) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Get client info for audit
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const result = await bookAppointment({
      doctorId: parseInt(doctorId, 10),
      patientName: patientName.trim(),
      patientCnic: patientCnic.trim(),
      patientPhone: patientPhone.trim(),
      patientEmail: patientEmail.trim().toLowerCase(),
      appointmentDate,
      slotNumber: parseInt(slotNumber, 10),
      notes: notes?.trim() || undefined,
      ipAddress,
      userAgent,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      appointment: {
        id: result.appointment.id,
        doctorName: result.appointment.faculty.name,
        appointmentDate: result.appointment.appointmentDate,
        slotStartTime: result.appointment.slotStartTime,
        slotEndTime: result.appointment.slotEndTime,
        status: result.appointment.status,
      },
      message: 'Appointment booked successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error booking appointment:', error);
    return NextResponse.json(
      { error: 'Failed to book appointment' },
      { status: 500 }
    );
  }
}
