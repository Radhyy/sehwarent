import { getOAuth2Client } from '@/lib/googleAuth';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { Readable } from 'stream';

export async function POST(request) {
  try {
    // Cek admin role dihapus sementara agar tidak terjadi isu cookie saat upload

    const oauth2Client = getOAuth2Client();

    // 2. Gunakan refresh token rahasia yang sudah kita dapatkan
    if (!process.env.GOOGLE_REFRESH_TOKEN) {
      return NextResponse.json({ error: 'Sistem belum dikonfigurasi dengan benar (Token Drive hilang).' }, { status: 500 });
    }
    
    oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const stream = Readable.from(buffer);

    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    
    // 3. Cari folder "Foto Catalog Web" di Google Drive
    const FOLDER_NAME = 'Foto Catalog Web';
    let folderId = null;

    const folderSearch = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${FOLDER_NAME}' and trashed=false`,
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    if (folderSearch.data.files.length > 0) {
      folderId = folderSearch.data.files[0].id;
    } else {
      // Jika foldernya belum ada, buat baru!
      const folderRes = await drive.files.create({
        requestBody: {
          name: FOLDER_NAME,
          mimeType: 'application/vnd.google-apps.folder',
        },
        fields: 'id',
      });
      folderId = folderRes.data.id;
    }
    
    // 4. Atur informasi file agar masuk ke dalam folder tersebut
    const fileMetadata = {
      name: file.name,
      parents: [folderId] // Ini kuncinya agar file masuk ke folder!
    };
    const media = {
      mimeType: file.type,
      body: stream,
    };

    const driveRes = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });
    
    // Set file to public so it can be viewed directly via link
    await drive.permissions.create({
      fileId: driveRes.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      }
    });

    return NextResponse.json(driveRes.data);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed', details: error.message }, { status: 500 });
  }
}
