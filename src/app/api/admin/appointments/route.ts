import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getPrisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getPrisma();
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};

    if (doctorId && doctorId !== 'all') {
      where.facultyId = parseInt(doctorId, 10);
    }

    if (date) {
      where.appointmentDate = new Date(date);
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    const appointments = await prisma.appointment.findMany({
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
      orderBy: [
        { appointmentDate: 'desc' },
        { slotStartTime: 'asc' },
      ],
      take: 100,
    });

    // Fetch status counts independently (not affected by filters)
    const statusCounts = await prisma.appointment.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const counts: Record<string, number> = {
      PENDING: 0,
      CONFIRMED: 0,
      COMPLETED: 0,
      CANCELLED: 0,
      NO_SHOW: 0,
      EXPIRED: 0,
    };

    for (const item of statusCounts) {
      counts[item.status] = item._count.status;
    }

    return NextResponse.json({ appointments, counts });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}
