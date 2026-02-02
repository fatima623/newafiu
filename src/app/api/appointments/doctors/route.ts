import { NextResponse } from 'next/server';
import { getDoctorsForBooking } from '@/lib/appointmentService';

export async function GET() {
  try {
    const doctors = await getDoctorsForBooking();

    return NextResponse.json({
      doctors: doctors.map(doc => ({
        id: doc.id,
        name: doc.name,
        designation: doc.designation,
        specialization: doc.specialization,
        specializationCategory: doc.specializationCategory,
        image: doc.image,
      })),
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}
