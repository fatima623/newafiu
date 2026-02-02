import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export async function GET() {
  try {
    const prisma = getPrisma() as any;

    const categories = await prisma.galleryCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        photos: {
          orderBy: { sortOrder: 'asc' },
          include: {
            photo: {
              select: {
                id: true,
                code: true,
                originalName: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      categories.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        photos: c.photos.map((cp: any) => ({
          id: cp.photo.id,
          code: cp.photo.code,
          originalName: cp.photo.originalName,
        })),
      }))
    );
  } catch (error) {
    console.error('Error fetching gallery categories:', error);
    const message =
      error instanceof Error && error.message === 'DATABASE_URL is not configured'
        ? error.message
        : 'Failed to fetch gallery categories';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
