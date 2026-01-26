import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const albums = await prisma.galleryAlbum.findMany({
      include: {
        images: true,
      },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(albums);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, date, images } = await request.json();

    if (!title || !date) {
      return NextResponse.json({ error: 'Title and date are required' }, { status: 400 });
    }

    const album = await prisma.galleryAlbum.create({
      data: {
        title,
        date: new Date(date),
        images: {
          create: images?.map((img: { url: string; caption?: string }) => ({
            url: img.url,
            caption: img.caption || null,
          })) || [],
        },
      },
      include: { images: true },
    });

    return NextResponse.json(album, { status: 201 });
  } catch (error) {
    console.error('Error creating album:', error);
    return NextResponse.json({ error: 'Failed to create album' }, { status: 500 });
  }
}
