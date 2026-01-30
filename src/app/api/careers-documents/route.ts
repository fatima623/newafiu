import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { error: 'This endpoint has been replaced by /api/careers-forms' },
    { status: 410 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: 'This endpoint has been replaced by /api/careers-forms' },
    { status: 410 }
  );
}
