import { getOAuth2Client } from '@/lib/googleAuth';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    
    // Jika ada refresh token, simpan ke .env.local secara otomatis
    if (tokens.refresh_token) {
      const envPath = path.join(process.cwd(), '.env.local');
      fs.appendFileSync(envPath, `\nGOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`);
      console.log('Refresh token berhasil disimpan ke .env.local!');
    }
    
    // We store the tokens in a cookie for simple session management
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('google_tokens', JSON.stringify(tokens), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
