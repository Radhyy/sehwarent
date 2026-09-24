'use client';

import { useState, useEffect } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/app/globals.css';

export default function EditProductForm({ product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Exclude ID from being edited ideally, but keeping in state
  const [formData, setFormData] = useState({
    id: product.id,
    title: product.title,
    price: product.price,
    price_3_hari: product.price_3_hari || '',
    price_7_hari: product.price_7_hari || '',
    original_price: product.original_price,
    category_id: product.category_id || 'pubg',
    tags: product.tags,
    login_method: product.login_method,
    description: product.description,
    whatsapp_text: product.whatsapp_text
  });
  
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);

  // Helper function to format Rupiah
  const formatRupiah = (value) => {
    if (!value) return '';
    const numberString = value.toString().replace(/[^,\d]/g, '');
    const split = numberString.split(',');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      const separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return rupiah ? 'Rp ' + rupiah : '';
  };

  useEffect(() => {
    fetch('/api/admin/categories').then(res => res.json()).then(data => {
      if (Array.isArray(data)) setCategories(data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageId = product.image_id;

      // If user uploaded a new file, upload it
      if (file) {
        const uploadData = new FormData();
        uploadData.append('file', file);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
          credentials: 'same-origin'
        });
        const uploadResult = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadResult.error);
        
        imageId = uploadResult.id;
      }

      // Update product via API (You will need to create PUT /api/admin/products/[id])
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          image_id: imageId,
          tags: formData.tags.split(',').map(t => t.trim())
        })
      });

      if (res.ok) {
        router.push('/admin/rental');
        router.refresh();
      } else {
        alert('Gagal mengupdate produk');
      }
    } catch (err) {
      alert(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <style>{`
        .edit-title { font-size: 2.2rem; color: white; margin-bottom: 0.2rem; letter-spacing: 1px; }
        .edit-subtitle { color: var(--text-muted); font-family: var(--font-geist-sans); }
        .edit-form-container { background: var(--bg-secondary); padding: 2.5rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        
        @media (max-width: 768px) {
          .edit-title { font-size: 1.5rem !important; }
          .edit-subtitle { font-size: 0.85rem !important; }
          .edit-form-container { padding: 1.5rem !important; }
        }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/rental">
          <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', marginTop: '2px' }}>
            <ArrowLeft size={20} />
          </button>
        </Link>
        <div>
          <h1 className="edit-title">EDIT PRODUK</h1>
          <p className="edit-subtitle">Ubah informasi detail produk rental ini.</p>
        </div>
      </div>

      <div className="edit-form-container">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>ID Produk (Tidak bisa diubah)</label>
              <input type="text" disabled value={formData.id} style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nama Produk / Judul</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Harga 1 Hari</label>
              <input type="text" required value={formData.price} onChange={e => setFormData({...formData, price: formatRupiah(e.target.value)})} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Harga 3 Hari</label>
              <input type="text" required value={formData.price_3_hari} onChange={e => setFormData({...formData, price_3_hari: formatRupiah(e.target.value)})} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Harga 7 Hari</label>
              <input type="text" required value={formData.price_7_hari} onChange={e => setFormData({...formData, price_7_hari: formatRupiah(e.target.value)})} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Metode Login</label>
              <input type="text" required value={formData.login_method} onChange={e => setFormData({...formData, login_method: e.target.value})} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Tags (Pisahkan koma)</label>
              <input type="text" required value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Kategori Game</label>
              <select required value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} style={inputStyle}>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id} style={{ background: '#121b2d', color: 'white' }}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Deskripsi & Aturan</label>
            <textarea required rows={5} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{...inputStyle, resize: 'vertical'}} />
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Teks Default WhatsApp</label>
            <input type="text" required value={formData.whatsapp_text} onChange={e => setFormData({...formData, whatsapp_text: e.target.value})} style={inputStyle} />
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Foto Produk (Upload baru untuk mengganti)</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', border: '1px dashed rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
              <img src={`/api/image/${product.image_id}`} alt="Current" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} style={{ color: 'white' }} />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ background: 'var(--cyan-accent)', color: 'var(--bg-primary)', border: 'none', padding: '1rem', borderRadius: '8px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '1rem', boxShadow: '0 5px 15px rgba(0, 153, 255, 0.3)' }}>
            {loading ? <Loader2 className="spin" size={20} /> : 'SIMPAN PERUBAHAN'}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.8rem 1rem',
  background: 'rgba(0,0,0,0.3)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: 'white',
  fontSize: '0.95rem',
  outline: 'none',
  boxSizing: 'border-box'
};
