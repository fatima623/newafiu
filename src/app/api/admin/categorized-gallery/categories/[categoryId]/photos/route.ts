import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/auth';
import { getPrisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getPrisma() as any;
    const { categoryId } = await params;

    const parsedCategoryId = Number.parseInt(categoryId, 10);
    if (!Number.isFinite(parsedCategoryId)) {
      return NextResponse.json({ error: 'Invalid categoryId' }, { status: 400 });
    }

    const category = await prisma.galleryCategory.findUnique({
      where: { id: parsedCategoryId },
      select: { id: true },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files');
    const fallback = formData.get('file');

    const incoming: File[] = [];
    for (const f of files) {
      if (f instanceof File) incoming.push(f);
    }
    if (incoming.length === 0 && fallback instanceof File) {
      incoming.push(fallback);
    }

    if (incoming.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const last = await prisma.galleryCategoryPhoto.findFirst({
      where: { categoryId: parsedCategoryId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    const baseSortOrder = last?.sortOrder ?? -1;

    const created = [] as {
      id: number;
      code: string;
      originalName: string;
      mimeType: string;
    }[];

    for (let idx = 0; idx < incoming.length; idx++) {
      const file = incoming[idx];

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const code = crypto.randomUUID();
      const mimeType = file.type || 'application/octet-stream';

      const photo = await prisma.galleryPhoto.create({
        data: {
          code,
          originalName: file.name,
          mimeType,
          data: buffer,
        },
        select: {
          id: true,
          code: true,
          originalName: true,
          mimeType: true,
        },
      });

      await prisma.galleryCategoryPhoto.create({
        data: {
          categoryId: parsedCategoryId,
          photoId: photo.id,
          sortOrder: baseSortOrder + 1 + idx,
        },
      });

      created.push(photo);
    }

    return NextResponse.json({ photos: created }, { status: 201 });
  } catch (error) {
    console.error('Error uploading categorized gallery photo(s):', error);
    return NextResponse.json(
      { error: 'Failed to upload categorized gallery photo(s)' },
      { status: 500 }
    );
  }
}
