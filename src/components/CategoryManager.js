'use client';

import { useState } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import '../app/globals.css';

export default function CategoryManager({ initialCategories }) {
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({ id: '', name: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setFormData({ id: '', name: '' });
        router.refresh();
      } else {
        alert('Gagal menyimpan kategori');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    alert('Fungsi hapus belum diimplementasi');
  };

  return (
    <div className="animate-fade-in">
      <style>{`
        .kategori-title { font-size: 2.2rem; color: white; margin-bottom: 0.5rem; letter-spacing: 1px; }
        .kategori-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; }
        
        @media (max-width: 768px) {
          .kategori-title { font-size: 1.5rem !important; }
          .kategori-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          
          .desktop-table-header { display: none; }
          .cat-table, .cat-tbody, .cat-row, .cat-cell {
            display: block;
            width: 100%;
            box-sizing: border-box;
          }
          .cat-table-wrapper {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          .cat-row {
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.05) !important;
            border-radius: 12px;
            margin-bottom: 1rem;
            padding: 1rem;
          }
          .cat-cell {
            padding: 0.4rem 0 !important;
            border: none !important;
            display: flex;
            align-items: center;
            justify-content: space-between;
            text-align: right;
          }
          .cat-cell:not(.cat-cell-action)::before {
            content: attr(data-label);
            color: var(--text-muted);
            font-size: 0.75rem;
            font-weight: bold;
            text-transform: uppercase;
            text-align: left;
          }
          .cat-cell-action {
            justify-content: flex-end !important;
            margin-top: 0.5rem;
            padding-top: 0.5rem !important;
            border-top: 1px solid rgba(255,255,255,0.1) !important;
          }
        }
      `}</style>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="kategori-title">KELOLA KATEGORI</h1>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-geist-sans)' }}>Atur label dan tag untuk membedakan jenis akun game Anda.</p>
      </div>

      <div className="kategori-grid">
        {/* Form Tambah */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '2rem', height: 'fit-content', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          <h3 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Tambah Kategori</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>ID Kategori (slug)</label>
              <input type="text" required value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} placeholder="contoh: pubg" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nama Kategori</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="PUBG Mobile" style={inputStyle} />
            </div>
            <button type="submit" disabled={loading} style={{ background: 'var(--cyan-accent)', color: 'var(--bg-primary)', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '1rem' }}>
              {loading ? <Loader2 className="spin" size={18} /> : <><Plus size={18} /> TAMBAH</>}
            </button>
          </form>
        </div>

        {/* Tabel Kategori */}
        <div className="cat-table-wrapper" style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          <table className="cat-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead className="desktop-table-header">
              <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem' }}>ID KATEGORI</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem' }}>NAMA KATEGORI</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem', textAlign: 'right' }}>AKSI</th>
              </tr>
            </thead>
            <tbody className="cat-tbody">
              {categories.map(cat => (
                <tr key={cat.id} className="cat-row" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td className="cat-cell" data-label="ID KATEGORI" style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{cat.id}</td>
                  <td className="cat-cell" data-label="NAMA KATEGORI" style={{ padding: '1rem 1.5rem', color: 'white', fontWeight: '500' }}>{cat.name}</td>
                  <td className="cat-cell cat-cell-action" style={{ padding: '1rem 1.5rem', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleDelete(cat.id)} style={{ background: 'rgba(255,77,77,0.1)', color: '#ff4d4d', border: '1px solid rgba(255,77,77,0.3)', padding: '0.6rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
