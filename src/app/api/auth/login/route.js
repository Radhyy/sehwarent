import { NextResponse } from 'next/server';

export async function POST(request) {
  const { username, password } = await request.json();
  
  // Hardcoded kredensial untuk admin
  if (username === 'admin' && password === 'admin123') {
    const response = NextResponse.json({ success: true, role: 'admin' });
    // Set cookie agar login tersimpan
    response.cookies.set('user_role', 'admin', { path: '/' });
    return response;
  }
  
  return NextResponse.json({ error: 'Username atau password salah!' }, { status: 401 });
}
