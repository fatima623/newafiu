import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getPrisma } from '@/lib/prisma';
import { signToken, setSessionCookie, getSession, clearSessionCookie } from '@/lib/auth';
import { getClientIpFromHeaders, rateLimit } from '@/lib/rateLimit';

// POST /api/auth/login - Login
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIpFromHeaders(request.headers);
    const prisma = getPrisma();
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const rl = rateLimit(`login:${ip}:${String(username).toLowerCase()}`, {
      windowMs: 60_000,
      max: 10,
    });
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const admin = await prisma.user.findUnique({
      where: { username },
    });

    const isValid = admin ? await bcrypt.compare(password, admin.passwordHash) : false;
    if (!admin || !isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = await signToken({ id: admin.id, username: admin.username });
    await setSessionCookie(token);

    return NextResponse.json({ success: true, username: admin.username });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/auth/login - Get current session (me)
export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ id: session.id, username: session.username });
}

// DELETE /api/auth/login - Logout
export async function DELETE() {
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
