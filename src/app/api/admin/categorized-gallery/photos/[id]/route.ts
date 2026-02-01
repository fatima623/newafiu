import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getPrisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getPrisma() as any;
    const { id } = await params;

    const photoId = Number.parseInt(id, 10);
    if (!Number.isFinite(photoId)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const categoryIdStr = searchParams.get('categoryId');

    if (categoryIdStr) {
      const categoryId = Number.parseInt(categoryIdStr, 10);
      if (!Number.isFinite(categoryId)) {
        return NextResponse.json({ error: 'Invalid categoryId' }, { status: 400 });
      }

      await prisma.galleryCategoryPhoto.deleteMany({
        where: { photoId, categoryId },
      });
    } else {
      await prisma.galleryCategoryPhoto.deleteMany({
        where: { photoId },
      });
    }

    const remaining = await prisma.galleryCategoryPhoto.count({
      where: { photoId },
    });

    if (remaining === 0) {
      await prisma.galleryPhoto.delete({ where: { id: photoId } });
    }

    return NextResponse.json({ success: true, deleted: remaining === 0 });
  } catch (error) {
    console.error('Error deleting categorized gallery photo:', error);
    return NextResponse.json(
      { error: 'Failed to delete categorized gallery photo' },
      { status: 500 }
    );
  }
}
