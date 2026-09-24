'use client';

import { useState, useEffect } from 'react';
import { Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import '@/app/globals.css';

export default function TambahProduk() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    price: '',
    original_price: '',
    category_id: 'pubg', // default
    tags: '',
    login_method: '',
    description: '',
    whatsapp_text: ''
  });
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);

  // Helper function to format Rupiah
  const formatRupiah = (value) => {
    const numberString = value.replace(/[^,\d]/g, '').toString();
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

  // Fetch categories on mount
  useEffect(() => {
    fetch('/api/admin/categories').then(res => res.json()).then(data => {
      if (Array.isArray(data)) setCategories(data);
    });
  }, []);

  const handleAIGenerate = async () => {
    if (!formData.title || !formData.price) {
      alert("Isi Nama Produk dan Harga terlebih dahulu untuk menggunakan AI!");
      return;
    }
    setGeneratingAI(true);
    try {
      const res = await fetch('/api/admin/generate-desc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formData.title, price: formData.price })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFormData(prev => ({
        ...prev,
        description: data.description,
        whatsapp_text: data.whatsapp_text
      }));
    } catch (err) {
      alert("Gagal memanggil AI: " + err.message);
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!file) throw new Error("File gambar belum dipilih");

      const uploadData = new FormData();
      uploadData.append('file', file);
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData
      });
      const uploadResult = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadResult.error);
      
      const imageId = uploadResult.id;

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          image_id: imageId,
          tags: formData.tags.split(',').map(t => t.trim())
        })
      });

      if (res.ok) {
        router.push('/admin/rental');
      } else {
        alert('Gagal menyimpan produk');
      }
    } catch (err) {
      alert(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <style>{`
        .tambah-title { font-size: 2.2rem; color: white; margin-bottom: 0.2rem; letter-spacing: 1px; }
        .tambah-subtitle { color: var(--text-muted); font-family: var(--font-geist-sans); }
        .tambah-form-container { background: var(--bg-secondary); padding: 2.5rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        
        @media (max-width: 768px) {
          .tambah-title { font-size: 1.5rem !important; }
          .tambah-subtitle { font-size: 0.85rem !important; }
          .tambah-form-container { padding: 1.5rem !important; }
        }
      `}</style>
      <div className="animate-fade-in">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '2rem' }}>
          <Link href="/admin/rental">
            <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', marginTop: '2px' }}>
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <h1 className="tambah-title">TAMBAH PRODUK BARU</h1>
            <p className="tambah-subtitle">Masukkan detail akun game yang ingin direntalkan.</p>
          </div>
        </div>

        <div className="tambah-form-container">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>ID Produk (URL slug)</label>
                <input type="text" readOnly required value={formData.id} placeholder="Otomatis terisi..." style={{...inputStyle, background: 'rgba(0,0,0,0.6)', color: 'var(--text-muted)', cursor: 'not-allowed'}} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nama Produk / Judul</label>
                <input type="text" required value={formData.title} onChange={e => {
                  const newTitle = e.target.value;
                  const newId = newTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
                  setFormData({...formData, title: newTitle, id: newId});
                }} placeholder="PUBG MOBILE - SULTAN" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Harga Rental</label>
                <input type="text" required value={formData.price} onChange={e => setFormData({...formData, price: formatRupiah(e.target.value)})} placeholder="Rp 25.000" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Harga Coret (Original)</label>
                <input type="text" required value={formData.original_price} onChange={e => setFormData({...formData, original_price: formatRupiah(e.target.value)})} placeholder="Rp 40.000" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Metode Login</label>
                <input type="text" required value={formData.login_method} onChange={e => setFormData({...formData, login_method: e.target.value})} placeholder="Twitter / Email" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Tags (Pisahkan koma)</label>
                <input type="text" required value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="PUBG MOBILE, RARE" style={inputStyle} />
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Deskripsi & Aturan</label>
                
                {formData.title && formData.price && (
                  <button 
                    type="button" 
                    onClick={handleAIGenerate} 
                    disabled={generatingAI}
                    style={{ 
                      background: 'linear-gradient(135deg, #0099ff, #b300ff)', 
                      color: 'white', 
                      border: 'none', 
                      padding: '0.4rem 1rem', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold', 
                      cursor: generatingAI ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      opacity: generatingAI ? 0.7 : 1
                    }}
                  >
                    {generatingAI ? <Loader2 className="spin" size={14} /> : <Sparkles size={14} />}
                    {generatingAI ? 'AI Sedang Berpikir...' : 'Isi Otomatis dgn AI'}
                  </button>
                )}
              </div>
              <textarea required rows={5} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Deskripsi spesifikasi akun..." style={{...inputStyle, resize: 'vertical'}} />
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Teks Default WhatsApp</label>
              <input type="text" required value={formData.whatsapp_text} onChange={e => setFormData({...formData, whatsapp_text: e.target.value})} placeholder="Halo admin, saya mau rental..." style={inputStyle} />
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Foto Produk (Upload ke Drive)</label>
              <div style={{ border: '1px dashed rgba(255,255,255,0.2)', padding: '2rem', borderRadius: '8px', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>
                <input type="file" required accept="image/*" onChange={e => setFile(e.target.files[0])} style={{ color: 'white' }} />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ background: 'var(--cyan-accent)', color: 'var(--bg-primary)', border: 'none', padding: '1rem', borderRadius: '8px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '1rem', boxShadow: '0 5px 15px rgba(0, 153, 255, 0.3)' }}>
              {loading ? <Loader2 className="spin" size={20} /> : 'SIMPAN PRODUK'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
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
