import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();
    
    const bannerItems = await prisma.newsEvent.findMany({
      where: {
        showInBanner: true,
        OR: [
          { bannerExpiresAt: null },
          { bannerExpiresAt: { gt: now } },
        ],
      },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        title: true,
        category: true,
        date: true,
      },
    });

    return NextResponse.json(bannerItems);
  } catch (error) {
    console.error('Error fetching banner items:', error);
    return NextResponse.json({ error: 'Failed to fetch banner items' }, { status: 500 });
  }
}
