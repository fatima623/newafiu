import { NextRequest, NextResponse } from 'next/server';
import { cancelAppointment } from '@/lib/appointmentService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentId, cancelReason, patientCnic } = body;

    if (!appointmentId || !cancelReason || !patientCnic) {
      return NextResponse.json(
        { error: 'appointmentId, cancelReason, and patientCnic are required' },
        { status: 400 }
      );
    }

    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    const result = await cancelAppointment(
      parseInt(appointmentId, 10),
      cancelReason,
      `Patient (CNIC: ${patientCnic})`,
      ipAddress
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return NextResponse.json(
      { error: 'Failed to cancel appointment' },
      { status: 500 }
    );
  }
}
