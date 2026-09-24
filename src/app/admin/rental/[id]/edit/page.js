import AdminLayout from '@/components/AdminLayout';
import pool from '@/lib/db';
import EditProductForm from './EditProductForm';

export default async function EditProdukPage({ params }) {
  const { id } = await params;
  
  const res = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  
  if (res.rows.length === 0) {
    return (
      <AdminLayout>
        <div style={{ color: 'white' }}>Produk tidak ditemukan.</div>
      </AdminLayout>
    );
  }

  const product = res.rows[0];
  const formattedProduct = {
    ...product,
    tags: typeof product.tags === 'string' ? JSON.parse(product.tags).join(', ') : product.tags.join(', ')
  };

  return (
    <AdminLayout>
      <EditProductForm product={formattedProduct} />
    </AdminLayout>
  );
}
