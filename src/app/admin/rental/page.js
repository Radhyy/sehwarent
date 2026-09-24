import AdminLayout from '@/components/AdminLayout';
import pool from '@/lib/db';
import ProductManager from '@/components/ProductManager';

export const dynamic = 'force-dynamic';

export default async function KelolaRental() {
  const res = await pool.query(`
    SELECT p.*, c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id 
    ORDER BY p.created_at DESC
  `);
  
  const products = res.rows.map(row => ({
    id: row.id,
    title: row.title,
    image_id: row.image_id,
    price: row.price,
    original_price: row.original_price,
    category_id: row.category_id,
    category_name: row.category_name,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
    login_method: row.login_method,
    description: row.description,
    whatsapp_text: row.whatsapp_text,
    available_at: row.available_at ? new Date(row.available_at).toISOString() : null
  }));

  return (
    <AdminLayout>
      <ProductManager initialProducts={products} />
    </AdminLayout>
  );
}
