import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

// GET - Fetch all official holidays
export async function GET(request: NextRequest) {
  try {
    const prisma = getPrisma();
    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get('upcoming') === 'true';
    const activeOnly = searchParams.get('active') !== 'false';

    const where: Record<string, unknown> = {};
    
    if (activeOnly) {
      where.isActive = true;
    }
    
    if (upcoming) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      where.date = { gte: today };
    }

    const holidays = await prisma.officialHoliday.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({ holidays });
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return NextResponse.json(
      { error: 'Failed to fetch holidays' },
      { status: 500 }
    );
  }
}

// POST - Create a new official holiday
export async function POST(request: NextRequest) {
  try {
    const prisma = getPrisma();
    const body = await request.json();
    const { date, name, reason } = body;

    if (!date || !name) {
      return NextResponse.json(
        { error: 'Date and name are required' },
        { status: 400 }
      );
    }

    const holidayDate = new Date(date);
    holidayDate.setHours(0, 0, 0, 0);

    // Check if holiday already exists for this date
    const existing = await prisma.officialHoliday.findUnique({
      where: { date: holidayDate },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A holiday already exists for this date' },
        { status: 400 }
      );
    }

    const holiday = await prisma.officialHoliday.create({
      data: {
        date: holidayDate,
        name,
        reason: reason || null,
      },
    });

    return NextResponse.json({ success: true, holiday });
  } catch (error) {
    console.error('Error creating holiday:', error);
    return NextResponse.json(
      { error: 'Failed to create holiday' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing holiday
export async function PUT(request: NextRequest) {
  try {
    const prisma = getPrisma();
    const body = await request.json();
    const { id, date, name, reason, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Holiday ID is required' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    
    if (date) {
      const holidayDate = new Date(date);
      holidayDate.setHours(0, 0, 0, 0);
      updateData.date = holidayDate;
    }
    if (name !== undefined) updateData.name = name;
    if (reason !== undefined) updateData.reason = reason;
    if (isActive !== undefined) updateData.isActive = isActive;

    const holiday = await prisma.officialHoliday.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json({ success: true, holiday });
  } catch (error) {
    console.error('Error updating holiday:', error);
    return NextResponse.json(
      { error: 'Failed to update holiday' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a holiday
export async function DELETE(request: NextRequest) {
  try {
    const prisma = getPrisma();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Holiday ID is required' },
        { status: 400 }
      );
    }

    await prisma.officialHoliday.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true, message: 'Holiday deleted successfully' });
  } catch (error) {
    console.error('Error deleting holiday:', error);
    return NextResponse.json(
      { error: 'Failed to delete holiday' },
      { status: 500 }
    );
  }
}
