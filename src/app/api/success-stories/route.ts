import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET /api/success-stories — Public: fetch published success stories
export async function GET() {
  try {
    const prisma = getPrisma();
    const stories = await prisma.successStory.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { date: 'desc' }],
    });
    return NextResponse.json(stories);
  } catch (error) {
    console.error('Error fetching success stories:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST /api/success-stories — Admin: create a new success story
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getPrisma();

    const body = await request.json();
    const { title, patientName, story, imageUrl, date, sortOrder, isPublished } = body;

    if (!title || !patientName || !story || !date) {
      return NextResponse.json(
        { error: 'Title, patient name, story, and date are required' },
        { status: 400 }
      );
    }

    const newStory = await prisma.successStory.create({
      data: {
        title,
        patientName,
        story,
        imageUrl: imageUrl || null,
        date: new Date(date),
        sortOrder: sortOrder ?? 0,
        isPublished: isPublished ?? true,
      },
    });

    return NextResponse.json(newStory, { status: 201 });
  } catch (error) {
    console.error('Error creating success story:', error);
    return NextResponse.json({ error: 'Failed to create success story' }, { status: 500 });
  }
}
