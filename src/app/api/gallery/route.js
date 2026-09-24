import { getOAuth2Client } from '@/lib/googleAuth';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const oauth2Client = getOAuth2Client();

    if (!process.env.GOOGLE_REFRESH_TOKEN) {
      return NextResponse.json({ error: 'Token Drive belum dikonfigurasi.' }, { status: 500 });
    }
    
    oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // 1. Cari folder
    const FOLDER_NAME = 'Foto Catalog Web';
    const folderSearch = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${FOLDER_NAME}' and trashed=false`,
      fields: 'files(id)',
      spaces: 'drive',
    });

    if (folderSearch.data.files.length === 0) {
      return NextResponse.json({ files: [] }); // Kosong
    }

    const folderId = folderSearch.data.files[0].id;

    // 2. Ambil foto
    const filesSearch = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`,
      fields: 'files(id, name, thumbnailLink, webContentLink)',
      orderBy: 'createdTime desc', // Urutkan dari yang terbaru
    });

    return NextResponse.json({ files: filesSearch.data.files });
  } catch (error) {
    console.error('Gallery fetch error:', error);
    return NextResponse.json({ error: 'Gagal memuat galeri.' }, { status: 500 });
  }
}
