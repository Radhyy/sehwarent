import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const res = await pool.query('SELECT * FROM categories ORDER BY created_at ASC');
    return NextResponse.json(res.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { id, name } = await request.json();
    await pool.query('INSERT INTO categories (id, name) VALUES ($1, $2)', [id, name]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add category' }, { status: 500 });
  }
}
