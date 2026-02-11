import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

// GET /api/appointments/user-lookup?email=... — Lookup returning user by email
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email')?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const prisma = getPrisma();

    // Find the most recent appointment with this email to get user details
    const latestAppointment = await prisma.appointment.findFirst({
      where: {
        patientEmail: email,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        patientName: true,
        patientCnic: true,
        patientPhone: true,
        patientEmail: true,
      },
    });

    if (!latestAppointment) {
      return NextResponse.json({
        found: false,
        message: 'No previous bookings found for this email',
      });
    }

    return NextResponse.json({
      found: true,
      user: {
        fullName: latestAppointment.patientName,
        cnic: latestAppointment.patientCnic,
        phone: latestAppointment.patientPhone,
        email: latestAppointment.patientEmail,
      },
    });
  } catch (error) {
    console.error('Error looking up user:', error);
    return NextResponse.json({ error: 'Failed to lookup user' }, { status: 500 });
  }
}
