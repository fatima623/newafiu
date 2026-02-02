import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export async function GET() {
  try {
    const prisma = getPrisma();
    const now = new Date();
    
    const bannerItems = await prisma.newsEvent.findMany({
      where: {
        showInBanner: true,
        OR: [
          { bannerExpiresAt: null },
          { bannerExpiresAt: { gt: now } },
        ],
      },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
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
