import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const DEFAULT_CONSENT_FORMS = [
  {
    title: 'Informed consent for TURP',
    pdfUrl: encodeURI('/Informed consent for TURP.pdf'),
  },
  {
    title: 'Informed consent for SPC',
    pdfUrl: encodeURI('/Informed consent for SPC.pdf'),
  },
  {
    title: 'Informed consent for Cystolitholapaxy',
    pdfUrl: encodeURI('/Informed consent for Cystolitholapaxy.pdf'),
  },
  {
    title: 'Informed consent for TRUS Biopsy',
    pdfUrl: encodeURI('/Informed consent for TRUS Biopsy.pdf'),
  },
  {
    title: 'Informed consent for Radical Cystectomy and Ileal Conduit',
    pdfUrl: encodeURI('/Informed consent for Radical Cystectomy and Ileal Conduit.pdf'),
  },
  {
    title: 'Informed consent for Cystoscopy and Biopsy',
    pdfUrl: encodeURI('/Informed consent for Cystoscopy and Biopsy.pdf'),
  },
];

export async function GET() {
  try {
    const prisma = getPrisma();
    const items = await prisma.patientEducation.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching patient education:', error);

    if (error instanceof Error && error.message === 'DATABASE_URL is not configured') {
      const fallback = DEFAULT_CONSENT_FORMS.map((item, index) => ({
        id: -(index + 1),
        title: item.title,
        description: null,
        pdfUrl: item.pdfUrl,
        createdAt: new Date(0).toISOString(),
        updatedAt: new Date(0).toISOString(),
      }));
      return NextResponse.json(fallback);
    }

    return NextResponse.json({ error: 'Failed to fetch patient education' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const prisma = getPrisma();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, pdfUrl } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const item = await prisma.patientEducation.create({
      data: {
        title,
        description: description || null,
        pdfUrl: pdfUrl || null,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating patient education:', error);
    const message =
      error instanceof Error && error.message === 'DATABASE_URL is not configured'
        ? error.message
        : 'Failed to create patient education';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
