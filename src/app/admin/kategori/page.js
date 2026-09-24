import AdminLayout from '@/components/AdminLayout';
import pool from '@/lib/db';
import CategoryManager from '@/components/CategoryManager';

export const dynamic = 'force-dynamic';

export default async function KelolaKategori() {
  const res = await pool.query('SELECT * FROM categories ORDER BY created_at ASC');
  
  return (
    <AdminLayout>
      <CategoryManager initialCategories={res.rows} />
    </AdminLayout>
  );
}
