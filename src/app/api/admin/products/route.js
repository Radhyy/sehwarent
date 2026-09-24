import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
  try {
    const data = await request.json();

    const { id, title, image_id, price, original_price, category_id, tags, login_method, description, whatsapp_text } = data;

    await pool.query(
      'INSERT INTO products (id, title, image_id, price, original_price, category_id, tags, login_method, description, whatsapp_text) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [id, title, image_id, price, original_price, category_id, JSON.stringify(tags), login_method, description, whatsapp_text]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save product error:', error);
    return NextResponse.json({ error: 'Failed to save product' }, { status: 500 });
  }
}
