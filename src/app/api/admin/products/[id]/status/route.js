import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request, { params }) {
  const { id } = await params;
  const { hours } = await request.json();

  try {
    let available_at = null;
    
    if (hours > 0) {
      // Set available_at to current time + hours
      const date = new Date();
      date.setHours(date.getHours() + hours);
      available_at = date.toISOString();
    }

    const res = await pool.query(
      'UPDATE products SET available_at = $1 WHERE id = $2 RETURNING available_at, title',
      [available_at, id]
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    const title = res.rows[0].title;
    if (hours > 0) {
      await pool.query('INSERT INTO activity_logs (action, detail, color) VALUES ($1, $2, $3)', ['Sewa dimulai', `Produk ${title} dirental selama ${hours} jam`, '#b300ff']);
    } else {
      await pool.query('INSERT INTO activity_logs (action, detail, color) VALUES ($1, $2, $3)', ['Sewa selesai', `Produk ${title} dikembalikan (Tersedia)`, '#00ffcc']);
    }

    if (res.rowCount === 0) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ available_at: res.rows[0].available_at });
  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
