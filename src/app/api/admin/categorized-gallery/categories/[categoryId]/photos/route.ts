import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Deprecated. Use /api/gallery-items.' },
    { status: 410 }
  );
}
