import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/appointmentService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');

    if (!doctorId || !date) {
      return NextResponse.json(
        { error: 'doctorId and date are required' },
        { status: 400 }
      );
    }

    const doctorIdNum = parseInt(doctorId, 10);
    if (isNaN(doctorIdNum)) {
      return NextResponse.json(
        { error: 'Invalid doctorId' },
        { status: 400 }
      );
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    const availability = await getAvailableSlots(doctorIdNum, date);

    if (!availability) {
      return NextResponse.json(
        { error: 'Doctor not found or date is not available for booking' },
        { status: 404 }
      );
    }

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error fetching slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available slots' },
      { status: 500 }
    );
  }
}
