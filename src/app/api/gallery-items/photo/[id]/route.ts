import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = getPrisma() as any;
    const { id } = await params;

    const itemId = Number.parseInt(id, 10);
    if (!Number.isFinite(itemId)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const item = await prisma.galleryItem.findUnique({
      where: { id: itemId },
      select: { data: true, mimeType: true, originalName: true, updatedAt: true },
    });

    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const body = Buffer.from(item.data);

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': item.mimeType,
        'Content-Length': String(body.byteLength),
        'Cache-Control': 'public, max-age=3600',
        'Content-Disposition': `inline; filename="${item.originalName.replace(/\"/g, '')}"`,
      },
    });
  } catch (error) {
    console.error('Error fetching gallery item photo:', error);
    const message =
      error instanceof Error && error.message === 'DATABASE_URL is not configured'
        ? error.message
        : 'Failed to fetch gallery item photo';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
