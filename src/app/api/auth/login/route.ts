import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';
import { initDatabase } from '@/lib/init-db';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Server configuration error: database not configured' }, { status: 500 });
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    let users;
    try {
      users = await sql`
        SELECT id, email, password_hash, name FROM admin_users WHERE email = ${email}
      `;
    } catch (dbError: unknown) {
      const msg = String(dbError);
      if (msg.includes('does not exist') || msg.includes('relation')) {
        await initDatabase();
        users = await sql`
          SELECT id, email, password_hash, name FROM admin_users WHERE email = ${email}
        `;
      } else {
        throw dbError;
      }
    }

    if (users.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = users[0];
    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken({ id: user.id, email: user.email, name: user.name });

    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
