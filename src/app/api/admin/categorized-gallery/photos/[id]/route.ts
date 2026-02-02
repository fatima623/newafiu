import { NextResponse } from 'next/server';

export async function DELETE() {
  return NextResponse.json(
    { error: 'Deprecated. Use /api/gallery-items/[id].' },
    { status: 410 }
  );
}
