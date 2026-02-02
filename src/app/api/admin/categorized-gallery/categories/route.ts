import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { GALLERY_CATEGORIES } from '@/lib/galleryCategories';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(
      GALLERY_CATEGORIES.map((c, idx) => ({
        id: idx + 1,
        name: c.label,
        slug: c.slug,
        sortOrder: idx,
        photos: [],
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
    return NextResponse.json(
      { error: 'Categories are predefined' },
      { status: 405 }
    );
  } catch (error) {
    console.error('Error creating categorized gallery category:', error);
    return NextResponse.json(
      { error: 'Failed to create categorized gallery category' },
      { status: 500 }
    );
  }
}
