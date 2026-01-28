import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = getPrisma();
    const { id } = await params;
    const item = await prisma.faculty.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!item) {
      return NextResponse.json({ error: 'Faculty not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    const message =
      error instanceof Error && error.message === 'DATABASE_URL is not configured'
        ? error.message
        : 'Failed to fetch faculty';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = getPrisma();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { name, designation, qualifications, specialization, image, bio } = await request.json();

    if (!name || !designation || !qualifications) {
      return NextResponse.json(
        { error: 'Name, designation, and qualifications are required' },
        { status: 400 }
      );
    }

    const item = await prisma.faculty.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        designation,
        qualifications,
        specialization: specialization || null,
        image: image || null,
        bio: bio || null,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating faculty:', error);
    const message =
      error instanceof Error && error.message === 'DATABASE_URL is not configured'
        ? error.message
        : 'Failed to update faculty';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = getPrisma();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.faculty.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    const message =
      error instanceof Error && error.message === 'DATABASE_URL is not configured'
        ? error.message
        : 'Failed to delete faculty';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
