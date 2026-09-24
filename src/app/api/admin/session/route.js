import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super_secret_admin_key_2026_sehwarent');

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    return NextResponse.json({ authenticated: true, user: { username: payload.username || 'Admin' } });
  } catch (err) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
