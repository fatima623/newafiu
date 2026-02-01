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
  findUnique(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
  delete(args: unknown): Promise<unknown>;
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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const prisma = getPrisma();
    const careersJob = getCareersJobDelegate(prisma);

    const item = (await careersJob.findUnique({
      where: { id: parseInt(id, 10) },
    })) as CareersJobRow | null;

    if (!item) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching careers job:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch careers job';
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

    const { id } = await params;
    const prisma = getPrisma();
    const careersJob = getCareersJobDelegate(prisma);

    const existing = (await careersJob.findUnique({
      where: { id: parseInt(id, 10) },
    })) as CareersJobRow | null;

    if (!existing) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const body = (await request.json()) as Record<string, unknown>;

    const code = String(body.code ?? existing.code).trim();
    const title = String(body.title ?? existing.title).trim();
    const department = String(body.department ?? existing.department).trim();
    const type = String(body.type ?? existing.type).trim();
    const locationRaw = body.location === undefined ? existing.location : String(body.location || '').trim();
    const descriptionRaw = body.description === undefined ? existing.description : String(body.description || '').trim();
    const requirementsRaw =
      body.requirements === undefined ? existing.requirements : String(body.requirements || '').trim();
    const responsibilitiesRaw =
      body.responsibilities === undefined
        ? existing.responsibilities
        : String(body.responsibilities || '').trim();
    const applyBy =
      body.applyBy === undefined
        ? ((existing as unknown as { applyBy?: Date | null }).applyBy ?? null)
        : parseOptionalDate(body.applyBy);
    const hiringStartsAt =
      body.hiringStartsAt === undefined
        ? ((existing as unknown as { hiringStartsAt?: Date | null }).hiringStartsAt ?? null)
        : parseOptionalDate(body.hiringStartsAt);
    const applyLinkRaw =
      body.applyLink === undefined ? existing.applyLink : String(body.applyLink || '').trim();
    const isPublished = body.isPublished === undefined ? existing.isPublished : Boolean(body.isPublished);

    if (!code || !title || !department || !type) {
      return NextResponse.json(
        { error: 'code, title, department, and type are required' },
        { status: 400 }
      );
    }

    const updated = (await careersJob.update({
      where: { id: parseInt(id, 10) },
      data: {
        code,
        title,
        department,
        type,
        location: locationRaw || null,
        description: descriptionRaw || null,
        requirements: requirementsRaw || null,
        responsibilities: responsibilitiesRaw || null,
        applyBy,
        hiringStartsAt,
        applyLink: applyLinkRaw || null,
        isPublished,
      },
    })) as CareersJobRow;

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating careers job:', error);
    const message = error instanceof Error ? error.message : 'Failed to update careers job';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const prisma = getPrisma();
    const careersJob = getCareersJobDelegate(prisma);

    const deleted = (await careersJob.delete({
      where: { id: parseInt(id, 10) },
    })) as CareersJobRow;

    return NextResponse.json(deleted);
  } catch (error) {
    console.error('Error deleting careers job:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete careers job';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
