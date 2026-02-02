import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { getGalleryCategoryByValue } from '@/lib/galleryCategories';

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

export async function PUT(
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

    const itemId = Number.parseInt(id, 10);
    if (!Number.isFinite(itemId)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const formData = await request.formData();

    const categoryRaw = formData.get('category');
    const title = String(formData.get('title') || '').trim();
    const sortOrderRaw = formData.get('sortOrder');
    const file = formData.get('file');

    const data: any = {
      title: title || null,
    };

    if (sortOrderRaw != null && String(sortOrderRaw).trim() !== '') {
      const sortOrder = Number(String(sortOrderRaw));
      if (Number.isFinite(sortOrder)) data.sortOrder = sortOrder;
    }

    if (categoryRaw != null && String(categoryRaw).trim() !== '') {
      if (!isValidCategory(categoryRaw)) {
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
      }
      data.category = String(categoryRaw);
    }

    if (file instanceof File) {
      if (!isAllowedImageUpload(file)) {
        return NextResponse.json(
          { error: 'Only image files are allowed (.jpg, .jpeg, .png, .webp, .gif)' },
          { status: 400 }
        );
      }
      const bytes = await file.arrayBuffer();
      data.data = Buffer.from(bytes);
      data.originalName = file.name;
      data.mimeType = file.type || 'application/octet-stream';
    }

    const updated = await prisma.galleryItem.update({
      where: { id: itemId },
      data,
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

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating gallery item:', error);
    const message =
      error instanceof Error && error.message === 'DATABASE_URL is not configured'
        ? error.message
        : 'Failed to update gallery item';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

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

    const itemId = Number.parseInt(id, 10);
    if (!Number.isFinite(itemId)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    await prisma.galleryItem.delete({ where: { id: itemId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    const message =
      error instanceof Error && error.message === 'DATABASE_URL is not configured'
        ? error.message
        : 'Failed to delete gallery item';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
