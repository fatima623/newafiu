import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { GALLERY_CATEGORIES, getGalleryCategoryByValue } from '@/lib/galleryCategories';

export async function GET(request: NextRequest) {
  try {
    const prisma = getPrisma() as any;
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const categoryOpt = category ? getGalleryCategoryByValue(category) : undefined;
    const where = categoryOpt ? { category: categoryOpt.value } : undefined;

    const items = await prisma.galleryItem.findMany({
      where,
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        category: true,
        originalName: true,
      },
    });

    const byCategory = new Map<string, { id: number; name: string; slug: string; photos: any[] }>();
    for (const c of GALLERY_CATEGORIES) {
      byCategory.set(c.value, { id: 0, name: c.label, slug: c.slug, photos: [] });
    }

    for (const item of items) {
      const bucket = byCategory.get(item.category);
      if (!bucket) continue;
      bucket.photos.push({ id: item.id, code: String(item.id), originalName: item.originalName });
    }

    const result = GALLERY_CATEGORIES.map((c, idx) => {
      const bucket = byCategory.get(c.value)!;
      return { id: idx + 1, name: bucket.name, slug: bucket.slug, photos: bucket.photos };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching gallery categories:', error);
    const message =
      error instanceof Error && error.message === 'DATABASE_URL is not configured'
        ? error.message
        : 'Failed to fetch gallery categories';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
