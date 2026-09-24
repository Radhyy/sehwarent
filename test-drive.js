const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
const drive = google.drive({ version: 'v3', auth: oauth2Client });

async function test() {
  const res = await drive.files.list({ q: "name='Foto Catalog Web'" });
  const folderId = res.data.files[0].id;
  const filesRes = await drive.files.list({ q: `'${folderId}' in parents` });
  const fileId = filesRes.data.files[0].id;
  
  const imgRes = await drive.files.get({ fileId: fileId, alt: 'media' }, { responseType: 'arraybuffer' });
  console.log('Buffer length:', imgRes.data.byteLength || imgRes.data.length);
  console.log('Type:', typeof imgRes.data, imgRes.data instanceof ArrayBuffer, Buffer.isBuffer(imgRes.data));
}
test().catch(console.error);
