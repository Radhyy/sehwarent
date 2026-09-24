import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const { title, image_id, price, original_price, category_id, tags, login_method, description, whatsapp_text } = data;

    await pool.query(
      'UPDATE products SET title = $1, image_id = $2, price = $3, original_price = $4, category_id = $5, tags = $6, login_method = $7, description = $8, whatsapp_text = $9 WHERE id = $10',
      [title, image_id, price, original_price, category_id, JSON.stringify(tags), login_method, description, whatsapp_text, id]
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
