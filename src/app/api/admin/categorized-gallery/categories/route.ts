import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getPrisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
                mimeType: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        sortOrder: c.sortOrder,
        photos: c.photos.map((cp) => ({
          id: cp.photo.id,
          code: cp.photo.code,
          originalName: cp.photo.originalName,
          mimeType: cp.photo.mimeType,
          sortOrder: cp.sortOrder,
        })),
      }))
    );
  } catch (error) {
    console.error('Error fetching categorized gallery categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categorized gallery categories' },
      { status: 500 }
    );
  }
}

function toSlug(input: string) {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getPrisma() as any;

    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const slug = toSlug(name);
    if (!slug) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }

    const existing = await prisma.galleryCategory.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: 'Category already exists', category: existing },
        { status: 409 }
      );
    }

    const last = await prisma.galleryCategory.findFirst({
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    const created = await prisma.galleryCategory.create({
      data: {
        name,
        slug,
        sortOrder: (last?.sortOrder ?? 0) + 1,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating categorized gallery category:', error);
    return NextResponse.json(
      { error: 'Failed to create categorized gallery category' },
      { status: 500 }
    );
  }
}
