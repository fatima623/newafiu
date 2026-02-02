import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getPrisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { GALLERY_CATEGORIES, getGalleryCategoryByValue } from '@/lib/galleryCategories';

export const runtime = 'nodejs';

function isAllowedImageUpload(file: File): boolean {
  const name = (file.name || '').toLowerCase();
  const ext = name.includes('.') ? name.slice(name.lastIndexOf('.')) : '';
  const allowedExt = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
  const allowedByExt = allowedExt.has(ext);
  const allowedByMime = file.type ? file.type.startsWith('image/') : false;
  return allowedByExt && (allowedByMime || file.type === '');
}

function isValidCategory(value: unknown): value is string {
  return typeof value === 'string' && !!getGalleryCategoryByValue(value);
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getPrisma() as any;
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where = isValidCategory(category) ? { category } : undefined;

    const items = await prisma.galleryItem.findMany({
      where,
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        category: true,
        title: true,
        originalName: true,
        mimeType: true,
        sortOrder: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      categories: GALLERY_CATEGORIES,
      items,
    });
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    const message =
      error instanceof Error && error.message === 'DATABASE_URL is not configured'
        ? error.message
        : 'Failed to fetch gallery items';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getPrisma() as any;

    const formData = await request.formData();
    const category = formData.get('category');
    const title = String(formData.get('title') || '').trim();
    const file = formData.get('file');

    if (!isValidCategory(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    if (!isAllowedImageUpload(file)) {
      return NextResponse.json(
        { error: 'Only image files are allowed (.jpg, .jpeg, .png, .webp, .gif)' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const code = crypto.randomUUID();

    const last = await prisma.galleryItem.findFirst({
      where: { category },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    const created = await prisma.galleryItem.create({
      data: {
        category,
        code,
        originalName: file.name,
        mimeType: file.type || 'application/octet-stream',
        data: buffer,
        title: title || null,
        sortOrder: (last?.sortOrder ?? -1) + 1,
      },
      select: {
        id: true,
        category: true,
        title: true,
        originalName: true,
        mimeType: true,
        sortOrder: true,
        createdAt: true,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    const message =
      error instanceof Error && error.message === 'DATABASE_URL is not configured'
        ? error.message
        : 'Failed to create gallery item';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
