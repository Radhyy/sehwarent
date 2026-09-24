import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    await pool.query('DELETE FROM activity_logs WHERE id = $1', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting log:', error);
    return NextResponse.json({ error: 'Failed to delete log' }, { status: 500 });
  }
}
