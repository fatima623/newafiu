import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getPrisma } from '@/lib/prisma';

// GET - Fetch all unavailable doctor records
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getPrisma();
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const upcoming = searchParams.get('upcoming') === 'true';

    const where: Record<string, unknown> = {
      isAvailable: false,
    };

    if (doctorId) {
      where.facultyId = parseInt(doctorId, 10);
    }

    if (upcoming) {
      where.date = { gte: new Date() };
    }

    const records = await prisma.doctorAvailability.findMany({
      where,
      include: {
        faculty: {
          select: {
            id: true,
            name: true,
            designation: true,
          },
        },
      },
      orderBy: [{ date: 'asc' }],
    });

    return NextResponse.json({ records });
  } catch (error) {
    console.error('Error fetching availability records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability records' },
      { status: 500 }
    );
  }
}

// POST - Create/update availability (supports multiple dates and time slots)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getPrisma();
    const body = await request.json();
    const { 
      doctorId, 
      dates, // Array of dates
      isAvailable, 
      reason, 
      overrideType,
      unavailabilityType, // 'FULL_DAY' or 'SPECIFIC_SLOTS'
      blockedSlots, // Array of slot numbers if SPECIFIC_SLOTS
    } = body;

    if (!doctorId || !dates || !Array.isArray(dates) || dates.length === 0) {
      return NextResponse.json(
        { error: 'doctorId and dates array are required' },
        { status: 400 }
      );
    }

    if (typeof isAvailable !== 'boolean') {
      return NextResponse.json(
        { error: 'isAvailable must be a boolean' },
        { status: 400 }
      );
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    for (const date of dates) {
      if (!dateRegex.test(date)) {
        return NextResponse.json(
          { error: `Invalid date format: ${date}. Use YYYY-MM-DD` },
          { status: 400 }
        );
      }
    }

    // Validate override type if provided
    const validOverrideTypes = ['LEAVE', 'EMERGENCY_BLOCK', 'CUSTOM_HOURS'];
    if (overrideType && !validOverrideTypes.includes(overrideType)) {
      return NextResponse.json(
        { error: 'Invalid overrideType' },
        { status: 400 }
      );
    }

    // Validate unavailability type
    const validUnavailabilityTypes = ['FULL_DAY', 'SPECIFIC_SLOTS'];
    if (!isAvailable && unavailabilityType && !validUnavailabilityTypes.includes(unavailabilityType)) {
      return NextResponse.json(
        { error: 'Invalid unavailabilityType' },
        { status: 400 }
      );
    }

    // Process each date
    const results = [];
    for (const dateStr of dates) {
      const date = new Date(dateStr);
      
      await prisma.doctorAvailability.upsert({
        where: {
          facultyId_date: {
            facultyId: parseInt(doctorId, 10),
            date: date,
          },
        },
        update: {
          isAvailable,
          reason: reason || null,
          overrideType: overrideType || null,
          unavailabilityType: unavailabilityType || 'FULL_DAY',
          blockedSlots: blockedSlots ? JSON.stringify(blockedSlots) : null,
        },
        create: {
          facultyId: parseInt(doctorId, 10),
          date: date,
          isAvailable,
          reason: reason || null,
          overrideType: overrideType || null,
          unavailabilityType: unavailabilityType || 'FULL_DAY',
          blockedSlots: blockedSlots ? JSON.stringify(blockedSlots) : null,
        },
      });
      
      results.push(dateStr);
    }

    return NextResponse.json({
      success: true,
      message: isAvailable 
        ? `Doctor marked as available for ${results.length} date(s)` 
        : `Doctor marked as unavailable for ${results.length} date(s)`,
      processedDates: results,
    });
  } catch (error) {
    console.error('Error updating availability:', error);
    return NextResponse.json(
      { error: 'Failed to update availability' },
      { status: 500 }
    );
  }
}

// DELETE - Remove an availability record
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getPrisma();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Record ID is required' },
        { status: 400 }
      );
    }

    await prisma.doctorAvailability.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({
      success: true,
      message: 'Availability record deleted',
    });
  } catch (error) {
    console.error('Error deleting availability record:', error);
    return NextResponse.json(
      { error: 'Failed to delete availability record' },
      { status: 500 }
    );
  }
}
