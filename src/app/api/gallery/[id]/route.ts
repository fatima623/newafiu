import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { error: 'Deprecated. Use /api/gallery-items.' },
    { status: 410 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Deprecated. Use /api/gallery-items/[id].' },
    { status: 410 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Deprecated. Use /api/gallery-items/[id].' },
    { status: 410 }
  );
}
