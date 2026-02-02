import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const prisma = getPrisma();
    const items = await prisma.faculty.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    const message =
      error instanceof Error && error.message === 'DATABASE_URL is not configured'
        ? error.message
        : 'Failed to fetch faculty';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const prisma = getPrisma();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, designation, qualifications, specializationCategory, image, bio } = await request.json();

    if (!name || !designation || !qualifications) {
      return NextResponse.json(
        { error: 'Name, designation, and qualifications are required' },
        { status: 400 }
      );
    }

    const item = await prisma.faculty.create({
      data: {
        name,
        designation,
        qualifications,
        specialization: null,
        specializationCategory: specializationCategory || null,
        image: image || null,
        bio: bio || null,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating faculty:', error);
    const message =
      error instanceof Error && error.message === 'DATABASE_URL is not configured'
        ? error.message
        : 'Failed to create faculty';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
