import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await prisma.newsEvent.findUnique({
      where: { id: parseInt(id) },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching news/event:', error);
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 });
  }
}

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
    const { title, date, excerpt, imageUrl, content, category, showInBanner, bannerExpiresAt } = await request.json();

    const item = await prisma.newsEvent.update({
      where: { id: parseInt(id) },
      data: {
        title,
        date: new Date(date),
        excerpt: excerpt || null,
        imageUrl: imageUrl || null,
        content: content || null,
        category,
        showInBanner: showInBanner || false,
        bannerExpiresAt: bannerExpiresAt ? new Date(bannerExpiresAt) : null,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating news/event:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

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
    await prisma.newsEvent.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news/event:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
