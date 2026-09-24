import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import pool from '@/lib/db';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super_secret_admin_key_2026_sehwarent');

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Find user
    const res = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const admin = res.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, admin.password_hash);
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create session token
    const alg = 'HS256';
    const token = await new SignJWT({ id: admin.id, username: admin.username })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
