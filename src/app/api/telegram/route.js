import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import Groq from 'groq-sdk';

// Initialize Groq
const getGroqClient = () => {
  const keys = process.env.GROQ_API_KEYS.split(',');
  return new Groq({ apiKey: keys[0] }); // Just use the first key for now
};

// Send message back to Telegram
async function sendMessage(chatId, text) {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    })
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Check if it's a message
    if (!body.message || !body.message.text) {
      return NextResponse.json({ status: 'ok' });
    }

    const chatId = body.message.chat.id.toString();
    const text = body.message.text;

    // Security check: Only allow Admin ID
    if (chatId !== process.env.TELEGRAM_ADMIN_ID) {
      await sendMessage(chatId, "⚠️ <b>Akses Ditolak!</b> Anda bukan Bos saya.");
      return NextResponse.json({ status: 'ok' });
    }

    // Acknowledge receipt
    await sendMessage(chatId, "⏳ <i>Memproses perintah Anda...</i>");

    // Fetch all products to give context to AI
    const resProducts = await pool.query('SELECT id, title FROM products');
    const productsList = resProducts.rows.map(p => `- ID: ${p.id}, Nama: ${p.title}`).join('\n');

    // Use Groq AI to parse intent
    const groq = getGroqClient();
    const systemPrompt = `Kamu adalah AI asisten rental. 
Tugasmu membaca pesan user dan mencocokkannya dengan daftar produk ini:
${productsList}

Jika pesan mengandung niat untuk merental/menyewa produk, kembalikan JSON murni TANPA TEKS LAIN dengan format:
{
  "action": "rent",
  "product_id": "ID_YANG_PALING_COCOK",
  "hours": ANGKA_JAM (jika tidak disebutkan, default 1)
}

Jika user meminta untuk menghentikan rental / membuat tersedia kembali, formatnya:
{
  "action": "available",
  "product_id": "ID_YANG_PALING_COCOK"
}

Jika tidak paham, kembalikan:
{
  "action": "unknown"
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      model: 'qwen-2.5-32b',
      temperature: 0,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content);

    if (result.action === 'unknown' || !result.product_id) {
      await sendMessage(chatId, "❓ Maaf Bos, saya tidak paham produk mana yang dimaksud atau perinthanya kurang jelas. Coba sebutkan nama produknya.");
      return NextResponse.json({ status: 'ok' });
    }

    // Perform database action
    if (result.action === 'rent' || result.action === 'available') {
      let available_at = null;
      
      if (result.action === 'rent') {
        const hours = result.hours || 1;
        const date = new Date();
        date.setHours(date.getHours() + hours);
        available_at = date.toISOString();
      }

      const updateRes = await pool.query(
        'UPDATE products SET available_at = $1 WHERE id = $2 RETURNING title',
        [available_at, result.product_id]
      );

      if (updateRes.rowCount > 0) {
        const productName = updateRes.rows[0].title;
        if (result.action === 'rent') {
          await pool.query('INSERT INTO activity_logs (action, detail, color) VALUES ($1, $2, $3)', ['Sewa dimulai', `[Telegram] Produk ${productName} dirental selama ${result.hours} jam`, '#b300ff']);
          await sendMessage(chatId, `✅ <b>Berhasil Bos!</b>\n\nProduk <b>${productName}</b> telah diubah statusnya menjadi 🔴 <b>Di Rental</b> selama <b>${result.hours} Jam</b>.`);
        } else {
          await pool.query('INSERT INTO activity_logs (action, detail, color) VALUES ($1, $2, $3)', ['Sewa selesai', `[Telegram] Produk ${productName} dikembalikan (Tersedia)`, '#00ffcc']);
          await sendMessage(chatId, `✅ <b>Berhasil Bos!</b>\n\nProduk <b>${productName}</b> telah dikembalikan ke status 🟢 <b>Tersedia</b>.`);
        }
      } else {
        await sendMessage(chatId, "❌ Gagal. ID Produk tidak ditemukan di database.");
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Telegram Webhook Error:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
