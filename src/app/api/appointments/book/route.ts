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

    const doctorIdNum = parseInt(String(doctorId), 10);
    if (Number.isNaN(doctorIdNum)) {
      return NextResponse.json(
        { error: 'Invalid doctorId' },
        { status: 400 }
      );
    }

    const slotNumberNum = parseInt(String(slotNumber), 10);
    if (Number.isNaN(slotNumberNum)) {
      return NextResponse.json(
        { error: 'Invalid slotNumber' },
        { status: 400 }
      );
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(String(appointmentDate))) {
      return NextResponse.json(
        { error: 'Invalid appointmentDate format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    const name = String(patientName).trim();
    if (name.length < 3 || name.length > 60 || !/^[A-Za-z\s]+$/.test(name)) {
      return NextResponse.json(
        { error: 'Invalid name. Use letters only (3-60 characters)' },
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
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const DISPOSABLE_EMAIL_DOMAINS = new Set([
      'mailinator.com',
      'guerrillamail.com',
      'guerrillamail.info',
      '10minutemail.com',
      'temp-mail.org',
      'yopmail.com',
      'getnada.com',
      'trashmail.com',
    ]);

    const getEmailValidationError = (rawEmail: string) => {
      const email = rawEmail.trim();
      if (!email) return 'Email is required';
      if (email.length < 6 || email.length > 254) return 'Invalid email format';
      if (!EMAIL_REGEX.test(email)) return 'Invalid email format';
      if (email.includes('..')) return 'Invalid email format';

      const atIndex = email.indexOf('@');
      if (atIndex === -1) return 'Invalid email format';
      const local = email.slice(0, atIndex);
      const domain = email.slice(atIndex + 1).toLowerCase();

      if (!local || !domain) return 'Invalid email format';
      if (local.length > 64) return 'Invalid email format';
      if (local.startsWith('.') || local.endsWith('.')) return 'Invalid email format';
      if (domain.includes('..')) return 'Invalid email format';
      if (!domain.includes('.')) return 'Invalid email format';
      if (domain.length > 253) return 'Invalid email format';

      for (const d of DISPOSABLE_EMAIL_DOMAINS) {
        if (domain === d || domain.endsWith(`.${d}`)) return 'Disposable email addresses are not allowed';
      }

      const labels = domain.split('.');
      const tld = labels[labels.length - 1] || '';
      if (!/^[a-zA-Z]{2,63}$/.test(tld)) return 'Invalid email format';
      for (const label of labels) {
        if (label.length < 1 || label.length > 63) return 'Invalid email format';
        if (!/^[a-zA-Z0-9-]+$/.test(label)) return 'Invalid email format';
        if (label.startsWith('-') || label.endsWith('-')) return 'Invalid email format';
      }

      return '';
    };

    const emailError = getEmailValidationError(String(patientEmail));
    if (emailError) {
      return NextResponse.json(
        { error: emailError },
        { status: 400 }
      );
    }

    // Validate phone format (allows optional + for country code)
    const phoneRegex = /^\+?\d{7,15}$/;
    if (!phoneRegex.test(String(patientPhone).trim())) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Get client info for audit
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const result = await bookAppointment({
      doctorId: doctorIdNum,
      patientName: name,
      patientCnic: patientCnic.trim(),
      patientPhone: String(patientPhone).trim(),
      patientEmail: patientEmail.trim().toLowerCase(),
      appointmentDate: String(appointmentDate),
      slotNumber: slotNumberNum,
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
