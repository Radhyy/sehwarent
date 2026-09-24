import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request, { params }) {
  const { id } = await params;
  const { days } = await request.json();

  try {
    let available_at = null;
    let title = '';
    
    if (days > 0) {
      // Set available_at to current time + days
      const date = new Date();
      date.setHours(date.getHours() + (days * 24));
      available_at = date.toISOString();
      
      const prodRes = await pool.query('SELECT title, price, price_3_hari, price_7_hari FROM products WHERE id = $1', [id]);
      if (prodRes.rowCount === 0) return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
      
      title = prodRes.rows[0].title;
      let priceStr = prodRes.rows[0].price;
      if (days === 3 && prodRes.rows[0].price_3_hari) priceStr = prodRes.rows[0].price_3_hari;
      else if (days === 7 && prodRes.rows[0].price_7_hari) priceStr = prodRes.rows[0].price_7_hari;
      
      const priceVal = parseInt(priceStr?.replace(/[^0-9]/g, '')) || 0;

      const res = await pool.query(
        'UPDATE products SET available_at = $1, current_rent_price = $2, rent_count = rent_count + 1, total_revenue = total_revenue + $2 WHERE id = $3 RETURNING available_at',
        [available_at, priceVal, id]
      );
      
      await pool.query('INSERT INTO activity_logs (action, detail, color) VALUES ($1, $2, $3)', ['Sewa dimulai', `Produk ${title} dirental selama ${days} hari`, '#b300ff']);
      
      return NextResponse.json({ available_at: res.rows[0].available_at });
    } else {
      const prodRes = await pool.query('SELECT title, available_at, current_rent_price FROM products WHERE id = $1', [id]);
      if (prodRes.rowCount === 0) return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
      
      const { title, available_at: current_available_at, current_rent_price } = prodRes.rows[0];
      const isPast = current_available_at && new Date(current_available_at) < new Date();
      
      if (current_available_at && !isPast) {
        // Dibatalkan (Early Cancel)
        await pool.query(
          'UPDATE products SET available_at = NULL, current_rent_price = 0, rent_count = GREATEST(rent_count - 1, 0), total_revenue = GREATEST(total_revenue - $2, 0) WHERE id = $1',
          [id, current_rent_price]
        );
        
        // Hapus log "Sewa dimulai" terakhir untuk produk ini
        await pool.query(
          `DELETE FROM activity_logs WHERE id IN (
            SELECT id FROM activity_logs 
            WHERE detail LIKE $1 AND action = 'Sewa dimulai' 
            ORDER BY created_at DESC LIMIT 1
          )`,
          [`Produk ${title} dirental%`]
        );
      } else {
        // Selesai secara natural
        await pool.query(
          'UPDATE products SET available_at = NULL, current_rent_price = 0 WHERE id = $1',
          [id]
        );
        await pool.query('INSERT INTO activity_logs (action, detail, color) VALUES ($1, $2, $3)', ['Sewa selesai', `Produk ${title} dikembalikan (Tersedia)`, '#00ffcc']);
      }
      
      return NextResponse.json({ available_at: null });
    }

  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
