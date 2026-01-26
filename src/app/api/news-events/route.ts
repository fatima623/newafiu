import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const items = await prisma.newsEvent.findMany({
      where: category ? { category: category as 'news' | 'event' } : undefined,
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching news/events:', error);
    return NextResponse.json({ error: 'Failed to fetch news/events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, date, excerpt, imageUrl, content, category, showInBanner, bannerExpiresAt } = await request.json();

    if (!title || !date || !category) {
      return NextResponse.json({ error: 'Title, date, and category are required' }, { status: 400 });
    }

    const item = await prisma.newsEvent.create({
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

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating news/event:', error);
    return NextResponse.json({ error: 'Failed to create news/event' }, { status: 500 });
  }
}
