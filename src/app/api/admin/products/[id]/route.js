import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const { title, image_id, price, price_3_hari, price_7_hari, original_price, category_id, tags, login_method, description, whatsapp_text } = data;

    await pool.query(
      'UPDATE products SET title = $1, image_id = $2, price = $3, price_3_hari = $4, price_7_hari = $5, original_price = $6, category_id = $7, tags = $8, login_method = $9, description = $10, whatsapp_text = $11 WHERE id = $12',
      [title, image_id, price, price_3_hari, price_7_hari, original_price, category_id, JSON.stringify(tags), login_method, description, whatsapp_text, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
