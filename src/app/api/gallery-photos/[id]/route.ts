import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = getPrisma() as any;
    const { id } = await params;

    const photoId = Number.parseInt(id, 10);
    if (!Number.isFinite(photoId)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const photo = await prisma.galleryPhoto.findUnique({
      where: { id: photoId },
      select: { data: true, mimeType: true, originalName: true, updatedAt: true },
    });

    if (!photo) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const body = Buffer.from(photo.data);

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': photo.mimeType,
        'Content-Length': String(body.byteLength),
        'Cache-Control': 'public, max-age=3600',
        'Content-Disposition': `inline; filename="${photo.originalName.replace(/\"/g, '')}"`,
      },
    });
  } catch (error) {
    console.error('Error fetching gallery photo:', error);
    const message =
      error instanceof Error && error.message === 'DATABASE_URL is not configured'
        ? error.message
        : 'Failed to fetch gallery photo';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
