import { getOAuth2Client } from '@/lib/googleAuth';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  
  try {
    const oauth2Client = getOAuth2Client();
    if (!process.env.GOOGLE_REFRESH_TOKEN) {
      return new NextResponse('Not configured', { status: 500 });
    }
    
    oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // Tarik file secara langsung dari server ke server dalam bentuk buffer
    const response = await drive.files.get(
      { fileId: id, alt: 'media' },
      { responseType: 'arraybuffer' }
    );

    const headers = new Headers();
    headers.set('Content-Type', response.headers['content-type'] || 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=31536000');

    return new NextResponse(response.data, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Image not found', { status: 404 });
  }
}
