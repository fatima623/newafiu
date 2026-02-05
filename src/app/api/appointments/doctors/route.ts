import { NextResponse } from 'next/server';
import { getDoctorsForBooking } from '@/lib/appointmentService';

function normalizeDoctorName(raw: string): string {
  const base = String(raw || '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\blt\.?\s*col\b/gi, 'Lt Col');

  return base.replace(/\bUL\b/g, 'ul');
}

export async function GET() {
  try {
    const doctors = await getDoctorsForBooking();

    return NextResponse.json({
      doctors: doctors.map(doc => ({
        id: doc.id,
        name: normalizeDoctorName(doc.name),
        designation: doc.designation,
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
