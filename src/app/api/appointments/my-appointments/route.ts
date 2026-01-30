import { NextRequest, NextResponse } from 'next/server';
import { getPatientAppointments } from '@/lib/appointmentService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cnic = searchParams.get('cnic');
    const email = searchParams.get('email');

    if (!cnic && !email) {
      return NextResponse.json(
        { error: 'Either cnic or email is required' },
        { status: 400 }
      );
    }

    const identifier = cnic || email!;
    const type = cnic ? 'cnic' : 'email';

    const appointments = await getPatientAppointments(identifier, type as 'cnic' | 'email');

    return NextResponse.json({
      appointments: appointments.map(apt => ({
        id: apt.id,
        doctorId: apt.facultyId,
        doctorName: apt.faculty.name,
        doctorDesignation: apt.faculty.designation,
        doctorImage: apt.faculty.image,
        appointmentDate: apt.appointmentDate,
        slotStartTime: apt.slotStartTime,
        slotEndTime: apt.slotEndTime,
        status: apt.status,
        notes: apt.notes,
        createdAt: apt.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}
