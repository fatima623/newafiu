import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getSession } from '@/lib/auth';
import { getClientIpFromHeaders, rateLimit } from '@/lib/rateLimit';

const MAX_SIZE_BYTES = 20 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.jfif',
  '.webp',
  '.gif',
  '.pdf',
  '.docx',
]);
const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/jfif',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ip = getClientIpFromHeaders(request.headers);
    const rl = rateLimit(`upload:${ip}`, { windowMs: 60_000, max: 30 });
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many uploads. Please try again later.' },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'File is too large' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    if (!safeName || safeName === '.' || safeName === '..') {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }
    const filename = `${timestamp}-${safeName}`;
    const filepath = path.join(uploadsDir, filename);

    await writeFile(filepath, buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ url, filename });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
