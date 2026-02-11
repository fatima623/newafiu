import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET /api/success-stories/[id] — Public: fetch a single success story
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prisma = getPrisma();
    const story = await prisma.successStory.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!story) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(story);
  } catch (error) {
    console.error('Error fetching success story:', error);
    return NextResponse.json({ error: 'Failed to fetch success story' }, { status: 500 });
  }
}

// PUT /api/success-stories/[id] — Admin: update a success story
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, patientName, story, imageUrl, date, sortOrder, isPublished } = body;

    if (!title || !patientName || !story || !date) {
      return NextResponse.json(
        { error: 'Title, patient name, story, and date are required' },
        { status: 400 }
      );
    }

    const prisma = getPrisma();
    const updated = await prisma.successStory.update({
      where: { id: parseInt(id, 10) },
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

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating success story:', error);
    return NextResponse.json({ error: 'Failed to update success story' }, { status: 500 });
  }
}

// DELETE /api/success-stories/[id] — Admin: delete a success story
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const prisma = getPrisma();
    await prisma.successStory.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ message: 'Success story deleted' });
  } catch (error) {
    console.error('Error deleting success story:', error);
    return NextResponse.json({ error: 'Failed to delete success story' }, { status: 500 });
  }
}
