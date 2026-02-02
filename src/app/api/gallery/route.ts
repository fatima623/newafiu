import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { error: 'Deprecated. Use /api/gallery-categories and /api/gallery-photos/[id].' },
    { status: 410 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: 'Deprecated. Use /api/gallery-items.' },
    { status: 410 }
  );
}
