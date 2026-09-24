require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function uploadToDrive(filePath, fileName, oauth2Client) {
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  
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
    const folderRes = await drive.files.create({
      requestBody: { name: FOLDER_NAME, mimeType: 'application/vnd.google-apps.folder' },
      fields: 'id',
    });
    folderId = folderRes.data.id;
  }

  const fileMetadata = { name: fileName, parents: [folderId] };
  const media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream(filePath),
  };

  const driveRes = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id',
  });

  await drive.permissions.create({
    fileId: driveRes.data.id,
    requestBody: { role: 'reader', type: 'anyone' }
  });

  return driveRes.data.id;
}

async function seed() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image_id VARCHAR(255) NOT NULL,
        price VARCHAR(50) NOT NULL,
        original_price VARCHAR(50) NOT NULL,
        tags JSONB NOT NULL,
        login_method VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        whatsapp_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const res = await pool.query('SELECT COUNT(*) FROM products');
    if (parseInt(res.rows[0].count) === 0) {
      console.log('Uploading IMG_1955...');
      const id1 = await uploadToDrive(path.join(__dirname, '../public/ProductRental/IMG_1955.JPG.jpeg'), 'IMG_1955.jpeg', oauth2Client);
      
      console.log('Uploading IMG_2069...');
      const id2 = await uploadToDrive(path.join(__dirname, '../public/ProductRental/IMG_2069.JPG.jpeg'), 'IMG_2069.jpeg', oauth2Client);
      
      console.log('Uploading IMG_2089...');
      const id3 = await uploadToDrive(path.join(__dirname, '../public/ProductRental/IMG_2089.JPG.jpeg'), 'IMG_2089.jpeg', oauth2Client);

      const products = [
        {
          id: 'pubg-glacier-max',
          title: 'PUBG MOBILE - AKUN SULTAN GLACIER MAX',
          image_id: id1,
          price: 'Rp 25.000',
          original_price: 'Rp 40.000',
          tags: JSON.stringify(['PUBG MOBILE', 'RENTAL AKUN']),
          login_method: 'Twitter / Email',
          description: 'Akun Sultan PUBG Mobile dengan spesifikasi GG!\n\n- Level: 75\n- Rank: Ace Master\n- M416 Glacier Level Max (Hit Effect, Kill Message, Loot Box)\n- Setelan Mythic banyak\n- Title langka\n- RP S1 - Sekarang rata-rata max\n\nAturan Rental:\n1. Dilarang menggunakan program ilegal (Cheat/Hack).\n2. Dilarang mengubah data akun (Password, Email, dll).\n3. Dilarang top up menggunakan metode ilegal.\nPelanggaran akan dikenakan denda dan blacklist!',
          whatsapp_text: 'Halo admin SehwaRent, saya ingin merental akun PUBG MOBILE - AKUN SULTAN GLACIER MAX.'
        },
        {
          id: 'pubg-mummy-set',
          title: 'PUBG MOBILE - MUMMY SET EXCLUSIVE',
          image_id: id2,
          price: 'Rp 30.000',
          original_price: 'Rp 50.000',
          tags: JSON.stringify(['PUBG MOBILE', 'RENTAL AKUN', 'RARE']),
          login_method: 'Facebook',
          description: 'Akun Sultan PUBG Mobile dengan set Mummy langka!\n\n- Level: 72\n- Rank: Ace\n- Mummy Set Kuning & Putih lengkap\n- Skin senjata banyak\n- Akun aman dan bersih\n\nAturan Rental:\n1. Dilarang menggunakan program ilegal.\n2. Dilarang mengubah data.',
          whatsapp_text: 'Halo admin SehwaRent, saya ingin merental akun PUBG MOBILE - MUMMY SET EXCLUSIVE.'
        },
        {
          id: 'pubg-xsuit-pharaoh',
          title: 'PUBG MOBILE - X-SUIT PHARAOH MAX',
          image_id: id3,
          price: 'Rp 40.000',
          original_price: 'Rp 75.000',
          tags: JSON.stringify(['PUBG MOBILE', 'X-SUIT', 'SULTAN']),
          login_method: 'Twitter',
          description: 'Akun Sultan Super GG dengan X-Suit Pharaoh Level Max!\n\n- Level: 80\n- X-Suit Pharaoh Max (Semua Emote & Efek)\n- Skin mobil langka\n- Inventory super sultan\n\nAturan Rental:\n1. Dilarang menggunakan program ilegal.\n2. Dilarang mengubah data.',
          whatsapp_text: 'Halo admin SehwaRent, saya ingin merental akun PUBG MOBILE - X-SUIT PHARAOH MAX.'
        }
      ];

      for (const p of products) {
        await pool.query(
          'INSERT INTO products (id, title, image_id, price, original_price, tags, login_method, description, whatsapp_text) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
          [p.id, p.title, p.image_id, p.price, p.original_price, p.tags, p.login_method, p.description, p.whatsapp_text]
        );
      }
      console.log('Seeded 3 products successfully.');
    } else {
      console.log('Products table already has data.');
    }
  } catch (error) {
    console.error('Seed Error:', error);
  } finally {
    await pool.end();
  }
}

seed();
