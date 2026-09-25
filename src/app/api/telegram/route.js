import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import Groq from 'groq-sdk';

// Initialize Groq with random key for load balancing
const getGroqClient = () => {
  const keys = process.env.GROQ_API_KEYS.split(',').map(k => k.trim()).filter(k => k);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return new Groq({ apiKey: randomKey });
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
  let chatId = null;
  try {
    const body = await req.json();
    
    // Check if it's a message
    if (!body.message || !body.message.text) {
      return NextResponse.json({ status: 'ok' });
    }

    chatId = body.message.chat.id.toString();
    const text = body.message.text;

    // Security check: Allow multiple admins
    const adminIds = (process.env.TELEGRAM_ADMIN_ID || '').split(',').map(id => id.trim());
    if (!adminIds.includes(chatId)) {
      await sendMessage(chatId, "⚠️ <b>Akses Ditolak!</b> Anda bukan Bos saya.");
      return NextResponse.json({ status: 'ok' });
    }

    // Acknowledge receipt
    await sendMessage(chatId, "⏳ <i>Memproses...</i>");

    // Fetch all products to give context to AI
    const resProducts = await pool.query('SELECT id, title, price, price_3_hari, price_7_hari, available_at FROM products');
    const productsList = resProducts.rows.map(p => {
      const isRented = p.available_at && new Date(p.available_at) > new Date();
      let statusStr = '🟢 Tersedia';
      if (isRented) {
        statusStr = `🔴 Di Rental (Bebas pada: ${new Date(p.available_at).toLocaleString('id-ID')})`;
      }
      return `- ID: ${p.id} | Nama: ${p.title} | Status: ${statusStr} | Harga: 1 Hari=${p.price}, 3 Hari=${p.price_3_hari}, 7 Hari=${p.price_7_hari}`;
    }).join('\n');

    // Use Groq AI to parse intent
    const groq = getGroqClient();
    const systemPrompt = `Kamu adalah AI asisten SehwaRent di Telegram. Tugasmu membantu Bos mengelola rental akun. Selalu panggil user "Bos" dan gunakan bahasa santai namun profesional.

Berikut adalah kondisi database/akun saat ini secara real-time:
${productsList}

Kamu WAJIB membalas dengan format JSON murni TANPA teks apa pun di luarnya!

Aturan Format JSON:
1. Jika Bos bertanya sesuatu tentang akun (misal: "akun apa aja yang kosong?", "yang lagi disewa apa aja?"), gunakan format:
{
  "action": "reply",
  "message": "Jawabanmu ke bos. Jawablah dengan SANGAT SINGKAT, PADAT, DAN JELAS! Jangan bertele-tele. Boleh pakai emoji dan tag HTML dasar seperti <b>tebal</b> atau <i>miring</i>"
}

2. Jika Bos MENYURUH untuk MENYEWAKAN/MERENTAL produk (misal: "rentalkan pubg 3 hari", "sewakan ml 1 hari"), gunakan format:
{
  "action": "rent",
  "product_id": "ID_YANG_PALING_COCOK",
  "days": ANGKA_HARI (hanya boleh 1, 3, atau 7. Jika tidak ada, default 1)
}

3. Jika Bos MENYURUH untuk MENGHENTIKAN/MEMBATALKAN rental (misal: "pubg udah beres", "batalkan mlbb"), gunakan format:
{
  "action": "available",
  "product_id": "ID_YANG_PALING_COCOK"
}

4. Jika Bos meminta untuk mengecek SEMUA STOK atau DAFTAR AKUN (misal: "cek stok", "tampilkan semua akun"), gunakan format:
{
  "action": "list_stock"
}

Ingat, pastikan JSON valid!`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      model: 'qwen/qwen3.8-27b', // using stable model available on groq 2026
      temperature: 0,
      max_tokens: 850,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content);

    if (result.action === 'reply' && result.message) {
      await sendMessage(chatId, result.message);
      return NextResponse.json({ status: 'ok' });
    }

    if (result.action === 'list_stock') {
      const availableProducts = resProducts.rows.filter(p => !p.available_at || new Date(p.available_at) < new Date());
      let msg = `📦 <b>Info Stok Akun (${availableProducts.length} Tersedia)</b>\n\n`;
      availableProducts.forEach(p => {
        msg += `🟢 <b>${p.title}</b>\n└ 1H: ${p.price} | 3H: ${p.price_3_hari} | 7H: ${p.price_7_hari}\n\n`;
      });
      if (availableProducts.length === 0) msg += "Semua akun sedang dirental Bos! 🚀";
      
      // Jika teksnya kepanjangan (misal lebih dari 4000 karakter), kita potong agar Telegram tidak error
      if (msg.length > 4000) {
        msg = msg.substring(0, 3900) + "\n\n... (Sebagian disembunyikan karena terlalu panjang)";
      }
      
      await sendMessage(chatId, msg);
      return NextResponse.json({ status: 'ok' });
    }

    if (!result.product_id || !['rent', 'available'].includes(result.action)) {
      await sendMessage(chatId, "❓ Maaf Bos, instruksi kurang jelas atau saya kebingungan mencerna perintahnya. Coba diulangi lagi.");
      return NextResponse.json({ status: 'ok' });
    }

    // Perform database action
    if (result.action === 'rent' || result.action === 'available') {
      const prodRes = await pool.query('SELECT title, price, price_3_hari, price_7_hari, current_rent_price, available_at FROM products WHERE id = $1', [result.product_id]);
      
      if (prodRes.rowCount === 0) {
        await sendMessage(chatId, "❌ Gagal. ID Produk tidak ditemukan di database.");
        return NextResponse.json({ status: 'ok' });
      }

      const product = prodRes.rows[0];
      const title = product.title;

      if (result.action === 'rent') {
        let days = result.days;
        if (![1, 3, 7].includes(days)) days = 1;
        
        const date = new Date();
        date.setHours(date.getHours() + (days * 24));
        const available_at = date.toISOString();

        let priceStr = product.price;
        if (days === 3 && product.price_3_hari) priceStr = product.price_3_hari;
        else if (days === 7 && product.price_7_hari) priceStr = product.price_7_hari;
        const priceVal = parseInt(priceStr?.replace(/[^0-9]/g, '')) || 0;

        await pool.query(
          'UPDATE products SET available_at = $1, current_rent_price = $2, rent_count = rent_count + 1, total_revenue = total_revenue + $2 WHERE id = $3',
          [available_at, priceVal, result.product_id]
        );

        await pool.query('INSERT INTO activity_logs (action, detail, color) VALUES ($1, $2, $3)', ['Sewa dimulai', `[Telegram] Produk ${title} dirental selama ${days} hari`, '#b300ff']);
        await sendMessage(chatId, `✅ <b>Berhasil Bos!</b>\n\nProduk <b>${title}</b> telah diubah statusnya menjadi 🔴 <b>Di Rental</b> selama <b>${days} Hari</b>.`);
        
      } else if (result.action === 'available') {
        const isPast = product.available_at && new Date(product.available_at) < new Date();
        
        if (product.available_at && !isPast) {
          // Cancelled early
          await pool.query(
            'UPDATE products SET available_at = NULL, current_rent_price = 0, rent_count = GREATEST(rent_count - 1, 0), total_revenue = GREATEST(total_revenue - $2, 0) WHERE id = $1',
            [result.product_id, product.current_rent_price]
          );
          
          await pool.query(
            `DELETE FROM activity_logs WHERE id IN (
              SELECT id FROM activity_logs 
              WHERE detail LIKE $1 AND action = 'Sewa dimulai' 
              ORDER BY created_at DESC LIMIT 1
            )`,
            [`[Telegram] Produk ${title} dirental%`]
          );
          
          await sendMessage(chatId, `✅ <b>Berhasil Bos!</b>\n\nRental produk <b>${title}</b> telah <b>dibatalkan</b> dan kembali Tersedia.`);
        } else {
          // Finished naturally
          await pool.query(
            'UPDATE products SET available_at = NULL, current_rent_price = 0 WHERE id = $1',
            [result.product_id]
          );
          await pool.query('INSERT INTO activity_logs (action, detail, color) VALUES ($1, $2, $3)', ['Sewa selesai', `[Telegram] Produk ${title} dikembalikan (Tersedia)`, '#00ffcc']);
          await sendMessage(chatId, `✅ <b>Berhasil Bos!</b>\n\nProduk <b>${title}</b> telah dikembalikan ke status 🟢 <b>Tersedia</b>.`);
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Telegram Webhook Error:', error);
    // Send error message to admin if possible
    try {
      if (chatId) {
        await sendMessage(chatId, `❌ Maaf Bos, terjadi kesalahan internal:\n${error.message}`);
      }
    } catch (e) {}
    
    // Always return 200 OK so Telegram doesn't retry
    return NextResponse.json({ status: 'ok' });
  }
}
