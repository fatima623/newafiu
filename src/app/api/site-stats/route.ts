import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// Default statistics (used as fallback when no DB records exist)
const DEFAULT_STATS = [
  { key: 'years_of_excellence', label: 'Years of Excellence', value: '37+', sortOrder: 1 },
  { key: 'successful_surgeries', label: 'Successful Surgeries', value: '140,249+', sortOrder: 2 },
  { key: 'expert_doctors', label: 'Expert Doctors', value: '37+', sortOrder: 3 },
  { key: 'satisfied_patients', label: 'Satisfied Patients', value: '1,190,419+', sortOrder: 4 },
];

// GET /api/site-stats - Public endpoint to fetch site statistics
export async function GET() {
  try {
    const prisma = getPrisma();
    const stats = await prisma.siteStat.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    // If no stats in DB yet, return defaults
    if (stats.length === 0) {
      return NextResponse.json(
        DEFAULT_STATS.map((s, i) => ({ id: i + 1, ...s, createdAt: new Date(), updatedAt: new Date() }))
      );
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching site stats:', error);
    // Return defaults on error so the homepage always works
    return NextResponse.json(
      DEFAULT_STATS.map((s, i) => ({ id: i + 1, ...s, createdAt: new Date(), updatedAt: new Date() }))
    );
  }
}

// PUT /api/site-stats - Admin endpoint to update all site statistics
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getPrisma();
    const { stats } = await request.json();

    if (!Array.isArray(stats) || stats.length === 0) {
      return NextResponse.json({ error: 'Stats array is required' }, { status: 400 });
    }

    // Validate each stat
    for (const stat of stats) {
      if (!stat.label || !stat.value) {
        return NextResponse.json(
          { error: 'Each stat must have a label and value' },
          { status: 400 }
        );
      }
    }

    // Use a transaction to replace all stats
    const result = await prisma.$transaction(async (tx) => {
      // Delete all existing stats
      await tx.siteStat.deleteMany();

      // Create new stats
      const created = [];
      for (let i = 0; i < stats.length; i++) {
        const stat = stats[i];
        const key = stat.key || stat.label
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '');

        const item = await tx.siteStat.create({
          data: {
            key,
            label: stat.label,
            value: stat.value,
            sortOrder: i + 1,
          },
        });
        created.push(item);
      }

      return created;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating site stats:', error);
    const message =
      error instanceof Error && error.message === 'DATABASE_URL is not configured'
        ? error.message
        : 'Failed to update site stats';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
