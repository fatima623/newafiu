import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

interface CareersJobRow {
  id: number;
  code: string;
  title: string;
  department: string;
  type: string;
  location: string | null;
  description: string | null;
  requirements: string | null;
  responsibilities: string | null;
  applyBy: string | null;
  hiringStartsAt: string | null;
  applyLink: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CareersJobDelegate {
  findMany(args: unknown): Promise<unknown>;
  create(args: unknown): Promise<unknown>;
}

function getCareersJobDelegate(prisma: unknown): CareersJobDelegate {
  return (prisma as { careersJob: CareersJobDelegate }).careersJob;
}

function parseOptionalDate(value: unknown): Date | null {
  const s = typeof value === 'string' ? value.trim() : '';
  if (!s) return null;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

export async function GET(request: NextRequest) {
  try {
    const prisma = getPrisma();
    const careersJob = getCareersJobDelegate(prisma);

    const url = new URL(request.url);
    const all = url.searchParams.get('all') === '1';
    const latest = url.searchParams.get('latest') === '1';

    if (all) {
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const items = (await careersJob.findMany({
      where: all ? {} : { isPublished: true },
      orderBy: [{ createdAt: 'desc' }],
      ...(latest ? { take: 1 } : {}),
    })) as CareersJobRow[];

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching careers jobs:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch careers jobs';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getPrisma();
    const careersJob = getCareersJobDelegate(prisma);

    const body = (await request.json()) as Record<string, unknown>;

    const code = String(body.code || '').trim();
    const title = String(body.title || '').trim();
    const department = String(body.department || '').trim();
    const type = String(body.type || '').trim();
    const location = String(body.location || '').trim();
    const description = String(body.description || '').trim();
    const requirements = String(body.requirements || '').trim();
    const responsibilities = String(body.responsibilities || '').trim();
    const applyBy = parseOptionalDate(body.applyBy);
    const hiringStartsAt = parseOptionalDate(body.hiringStartsAt);
    const applyLink = String(body.applyLink || '').trim();
    const isPublished = body.isPublished === undefined ? true : Boolean(body.isPublished);

    if (!code || !title || !department || !type) {
      return NextResponse.json(
        { error: 'code, title, department, and type are required' },
        { status: 400 }
      );
    }

    const created = (await careersJob.create({
      data: {
        code,
        title,
        department,
        type,
        location: location || null,
        description: description || null,
        requirements: requirements || null,
        responsibilities: responsibilities || null,
        applyBy,
        hiringStartsAt,
        applyLink: applyLink || null,
        isPublished,
      },
    })) as CareersJobRow;

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating careers job:', error);
    const message = error instanceof Error ? error.message : 'Failed to create careers job';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
