import { getOAuth2Client } from '@/lib/googleAuth';
import { NextResponse } from 'next/server';

export async function GET() {
  const oauth2Client = getOAuth2Client();
  
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/drive.file', // scope to create/edit files made by this app
    ],
  });

  return NextResponse.redirect(url);
}
