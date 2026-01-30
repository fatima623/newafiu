import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { mkdir } from 'fs/promises';
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
  createdAt: string;
}

interface CareersFormDelegate {
  findUnique(args: unknown): Promise<unknown>;
  findMany(args: unknown): Promise<unknown>;
  create(args: unknown): Promise<unknown>;
}

function getCareersFormDelegate(prisma: unknown): CareersFormDelegate {
  return (prisma as { careersForm: CareersFormDelegate }).careersForm;
}

function encodePublicPath(fileName: string) {
  return encodeURI(`/${fileName}`);
}

function isAllowedFile(file: File): { ok: true; ext: string } | { ok: false; error: string } {
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

  return { ok: true, ext };
}

export async function GET() {
  try {
    const prisma = getPrisma();
    const careersForm = getCareersFormDelegate(prisma);

    const items = await careersForm.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching careers forms:', error);

    if (error instanceof Error && error.message === 'DATABASE_URL is not configured') {
      const fallback = [
        {
          code: 'job_application',
          title: 'AFIU Job Application Forms',
          fileUrl: encodePublicPath('AFIU job Application Forms.docx'),
          originalName: 'AFIU job Application Forms.docx',
        },
        {
          code: 'residency_training',
          title: 'APPLICATION FORM FOR RESIDENCY TRAINING AT AFIU',
          fileUrl: encodePublicPath('APPLICATION FORM FOR RESIDENCY TRAINING AT AFIU.docx'),
          originalName: 'APPLICATION FORM FOR RESIDENCY TRAINING AT AFIU.docx',
        },
      ];
      return NextResponse.json(fallback);
    }

    return NextResponse.json({ error: 'Failed to fetch careers forms' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getPrisma();
    const careersForm = getCareersFormDelegate(prisma);

    const formData = await request.formData();
    const code = String(formData.get('code') || '').trim();
    const title = String(formData.get('title') || '').trim();
    const sortOrderRaw = String(formData.get('sortOrder') || '').trim();
    const sortOrder = sortOrderRaw ? Number(sortOrderRaw) : 0;
    const file = formData.get('file') as File | null;

    if (!code || !title) {
      return NextResponse.json({ error: 'Code and title are required' }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

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

    const fileUrl = `/uploads/careers-forms/${filename}`;

    const created = await careersForm.create({
      data: {
        code,
        title,
        fileUrl,
        originalName: file.name,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
        sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating careers form:', error);
    const message =
      error instanceof Error && error.message === 'DATABASE_URL is not configured'
        ? error.message
        : 'Failed to create careers form';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
