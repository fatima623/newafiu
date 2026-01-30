import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { setDoctorAvailability } from '@/lib/appointmentService';

export async function POST(request: NextRequest) {
  try {
    // Check authentication (admin only)
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { doctorId, date, isAvailable, reason, overrideType } = body;

    if (!doctorId || !date || typeof isAvailable !== 'boolean') {
      return NextResponse.json(
        { error: 'doctorId, date, and isAvailable are required' },
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

    // Validate override type if provided
    const validOverrideTypes = ['LEAVE', 'EMERGENCY_BLOCK', 'CUSTOM_HOURS'];
    if (overrideType && !validOverrideTypes.includes(overrideType)) {
      return NextResponse.json(
        { error: 'Invalid overrideType' },
        { status: 400 }
      );
    }

    const result = await setDoctorAvailability(
      parseInt(doctorId, 10),
      date,
      isAvailable,
      reason,
      overrideType
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: isAvailable 
        ? 'Doctor marked as available' 
        : 'Doctor marked as unavailable',
    });
  } catch (error) {
    console.error('Error updating availability:', error);
    return NextResponse.json(
      { error: 'Failed to update availability' },
      { status: 500 }
    );
  }
}
