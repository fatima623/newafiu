import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { mkdir, unlink } from 'fs/promises';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import type { ReadableStream as NodeReadableStream } from 'stream/web';
import { getPrisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const MAX_SIZE_BYTES = 50 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.docx', '.txt']);
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]);

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'careers-forms');

interface CareersFormRow {
  id: number;
  code: string;
  title: string;
  fileUrl: string;
  originalName: string;
  mimeType: string;
  size: number;
  sortOrder: number;
}

interface CareersFormDelegate {
  findUnique(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
  delete(args: unknown): Promise<unknown>;
}

function getCareersFormDelegate(prisma: unknown): CareersFormDelegate {
  return (prisma as { careersForm: CareersFormDelegate }).careersForm;
}

function isAllowedFile(file: File): { ok: true } | { ok: false; error: string } {
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return { ok: false, error: 'Unsupported file type. Allowed: PDF, DOCX, TXT.' };
  }

  if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
    return { ok: false, error: 'Unsupported file type. Allowed: PDF, DOCX, TXT.' };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { ok: false, error: 'File is too large.' };
  }

  return { ok: true };
}

function maybeGetUploadFilePath(fileUrl: string): string | null {
  if (!fileUrl.startsWith('/uploads/careers-forms/')) return null;
  const filename = fileUrl.replace('/uploads/careers-forms/', '');
  return path.join(UPLOADS_DIR, filename);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = getPrisma();
    const { id } = await params;

    const careersForm = getCareersFormDelegate(prisma);

    const item = (await careersForm.findUnique({
      where: { id: parseInt(id, 10) },
    })) as CareersFormRow | null;

    if (!item) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching careers form:', error);
    const message =
      error instanceof Error && error.message === 'DATABASE_URL is not configured'
        ? error.message
        : 'Failed to fetch careers form';
    return NextResponse.json({ error: message }, { status: 500 });
  }
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

    const prisma = getPrisma();
    const { id } = await params;

    const careersForm = getCareersFormDelegate(prisma);

    const existing = (await careersForm.findUnique({
      where: { id: parseInt(id, 10) },
    })) as CareersFormRow | null;

    if (!existing) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();

      const code = String(formData.get('code') || existing.code).trim();
      const title = String(formData.get('title') || existing.title).trim();
      const sortOrderRaw = String(formData.get('sortOrder') || existing.sortOrder).trim();
      const sortOrder = sortOrderRaw ? Number(sortOrderRaw) : existing.sortOrder;
      const file = formData.get('file') as File | null;

      let fileUrl = existing.fileUrl;
      let originalName = existing.originalName;
      let mimeType = existing.mimeType;
      let size = existing.size;

      if (file) {
        const allowed = isAllowedFile(file);
        if (!allowed.ok) {
          return NextResponse.json({ error: allowed.error }, { status: 400 });
        }

        await mkdir(UPLOADS_DIR, { recursive: true });

        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}-${safeName}`;
        const filepath = path.join(UPLOADS_DIR, filename);

        const readable = Readable.fromWeb(file.stream() as unknown as NodeReadableStream<Uint8Array>);
        const writable = createWriteStream(filepath);
        await pipeline(readable, writable);

        const oldUploadPath = maybeGetUploadFilePath(existing.fileUrl);
        if (oldUploadPath) {
          try {
            await unlink(oldUploadPath);
          } catch {
          }
        }

        fileUrl = `/uploads/careers-forms/${filename}`;
        originalName = file.name;
        mimeType = file.type || 'application/octet-stream';
        size = file.size;
      }

      const updated = await careersForm.update({
        where: { id: parseInt(id, 10) },
        data: {
          code,
          title,
          sortOrder: Number.isFinite(sortOrder) ? sortOrder : existing.sortOrder,
          fileUrl,
          originalName,
          mimeType,
          size,
        },
      });

      return NextResponse.json(updated);
    }

    const body = await request.json();
    const code = typeof body.code === 'string' ? body.code.trim() : existing.code;
    const title = typeof body.title === 'string' ? body.title.trim() : existing.title;
    const sortOrder = typeof body.sortOrder === 'number' ? body.sortOrder : existing.sortOrder;
    const fileUrl = typeof body.fileUrl === 'string' ? body.fileUrl : existing.fileUrl;

    const updated = await careersForm.update({
      where: { id: parseInt(id, 10) },
      data: {
        code,
        title,
        sortOrder,
        fileUrl,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating careers form:', error);
    const message =
      error instanceof Error && error.message === 'DATABASE_URL is not configured'
        ? error.message
        : 'Failed to update careers form';
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

    const prisma = getPrisma();
    const { id } = await params;

    const careersForm = getCareersFormDelegate(prisma);

    const deleted = (await careersForm.delete({
      where: { id: parseInt(id, 10) },
    })) as CareersFormRow;

    const uploadPath = maybeGetUploadFilePath(deleted.fileUrl);
    if (uploadPath) {
      try {
        await unlink(uploadPath);
      } catch {
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting careers form:', error);
    const message =
      error instanceof Error && error.message === 'DATABASE_URL is not configured'
        ? error.message
        : 'Failed to delete careers form';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
