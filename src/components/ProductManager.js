'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Clock, CheckCircle2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../app/globals.css';

export default function ProductManager({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [deleteId, setDeleteId] = useState(null);
  const [rentModalOpen, setRentModalOpen] = useState(null);
  const [cancelRentId, setCancelRentId] = useState(null);
  const [rentDays, setRentDays] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const filteredProducts = products.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/products/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== deleteId));
        setDeleteId(null);
        router.refresh();
      } else {
        alert('Gagal menghapus produk');
      }
    } catch (e) {
      alert('Terjadi kesalahan');
    }
  };

  const handleUpdateStatus = async (productId, days = 0) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days })
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(products.map(p => p.id === productId ? { ...p, available_at: data.available_at, current_rent_price: days > 0 ? p.current_rent_price : 0 } : p));
        setRentModalOpen(null);
        setCancelRentId(null);
        router.refresh();
      } else {
        alert('Gagal mengupdate status');
      }
    } catch (e) {
      alert('Terjadi kesalahan');
    }
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .desktop-table-header { display: none; }
          .product-table, .product-tbody, .product-row, .product-cell {
            display: block;
            width: 100%;
            box-sizing: border-box;
          }
          .product-row {
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.05) !important;
            border-radius: 12px;
            margin-bottom: 1rem;
            padding: 1rem;
          }
          .product-cell {
            padding: 0.4rem 0 !important;
            border: none !important;
            display: flex;
            align-items: center;
            justify-content: space-between;
            text-align: right;
          }
          .product-cell-img {
            display: block;
            margin: 0 auto 1rem auto;
            text-align: center;
          }
          .product-cell-img img {
            width: 80px !important;
            height: 80px !important;
            border-radius: 12px !important;
          }
          .product-cell:not(.product-cell-img):not(.product-cell-action)::before {
            content: attr(data-label);
            color: var(--text-muted);
            font-size: 0.75rem;
            font-weight: bold;
            text-transform: uppercase;
            text-align: left;
          }
          .product-cell-action {
            justify-content: center !important;
            margin-top: 0.8rem;
            padding-top: 1rem !important;
            border-top: 1px solid rgba(255,255,255,0.1) !important;
          }
        }
      `}</style>
      <div className="animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: 'white', marginBottom: '0.5rem', letterSpacing: '1px' }}>KELOLA RENTAL</h1>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-geist-sans)' }}>Tambah, edit, atau hapus produk rental akun game Anda.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Cari nama produk..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '8px', color: 'white', outline: 'none', width: '200px', flex: 1, minWidth: '150px' }}
            />
          </div>
          <Link href="/admin/rental/tambah" style={{ textDecoration: 'none' }}>
            <button 
              style={{ background: 'var(--cyan-accent)', color: 'var(--bg-primary)', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 15px rgba(0, 153, 255, 0.4)', display: 'flex', alignItems: 'center', gap: '8px', height: '100%' }}
            >
              <Plus size={20} /> TAMBAH PRODUK
            </button>
          </Link>
        </div>
      </div>

      {/* Table of Products */}
      <div style={{ overflow: 'hidden' }}>
        <table className="product-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead className="desktop-table-header">
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem' }}>GAMBAR</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem' }}>NAMA PRODUK</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem' }}>KATEGORI</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem' }}>STATUS</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem' }}>HARGA</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem', textAlign: 'right' }}>AKSI</th>
            </tr>
          </thead>
          <tbody className="product-tbody">
            {filteredProducts.map(product => (
              <tr key={product.id} className="product-row" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'var(--bg-secondary)' }}>
                <td className="product-cell product-cell-img" data-label="GAMBAR" style={{ padding: '1rem 1.5rem' }}>
                  <img src={`/api/image/${product.image_id}`} alt={product.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                </td>
                <td className="product-cell" data-label="NAMA PRODUK" style={{ padding: '1rem 1.5rem', color: 'white', fontWeight: '500' }}>{product.title}</td>
                <td className="product-cell" data-label="KATEGORI" style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>
                  <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {product.category_name || product.category_id || '-'}
                  </span>
                </td>
                <td className="product-cell" data-label="STATUS" style={{ padding: '1rem 1.5rem' }}>
                  {(() => {
                    const isRented = product.available_at && new Date(product.available_at) > new Date();
                    if (isRented) {
                      return (
                        <button onClick={() => setCancelRentId(product.id)} style={{ background: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d', border: '1px solid rgba(255, 77, 77, 0.3)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={14} /> Di Rental
                        </button>
                      );
                    }
                    return (
                      <button onClick={() => setRentModalOpen(product.id)} style={{ background: 'rgba(0, 255, 204, 0.1)', color: '#00ffcc', border: '1px solid rgba(0, 255, 204, 0.3)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={14} /> Tersedia
                      </button>
                    );
                  })()}
                </td>
                <td className="product-cell" data-label="HARGA" style={{ padding: '1rem 1.5rem', color: 'var(--cyan-accent)', fontWeight: 'bold' }}>{product.price}</td>
                <td className="product-cell product-cell-action" style={{ padding: '1rem 1.5rem', display: 'flex', gap: '10px', justifyContent: 'flex-end', height: '100%', alignItems: 'center' }}>
                  <Link href={`/admin/rental/${product.id}/edit`}>
                    <button style={{ background: 'rgba(0, 153, 255, 0.1)', color: 'var(--cyan-accent)', border: '1px solid rgba(0, 153, 255, 0.3)', padding: '0.6rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Edit size={16} />
                    </button>
                  </Link>
                  <button onClick={() => setDeleteId(product.id)} style={{ background: 'rgba(255,77,77,0.1)', color: '#ff4d4d', border: '1px solid rgba(255,77,77,0.3)', padding: '0.6rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Belum ada produk.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteId && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="animate-fade-in" style={{ background: 'var(--bg-secondary)', width: '90%', maxWidth: '400px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,77,77,0.1)', color: '#ff4d4d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Trash2 size={30} />
            </div>
            <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>Hapus Produk?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Tindakan ini tidak dapat dibatalkan. Produk akan dihapus permanen dari sistem.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Batal</button>
              <button onClick={confirmDelete} style={{ flex: 1, padding: '0.8rem', background: '#ff4d4d', border: 'none', color: 'white', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 5px 15px rgba(255, 77, 77, 0.3)' }}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Rent Duration Modal */}
      {rentModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="animate-fade-in" style={{ background: 'var(--bg-secondary)', width: '90%', maxWidth: '400px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(0,153,255,0.1)', color: 'var(--cyan-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Clock size={30} />
            </div>
            <h2 style={{ color: 'white', marginBottom: '1rem' }}>Atur Durasi Rental</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Pilih berapa hari akun ini akan di rental. Status akan otomatis kembali 'Tersedia' setelah waktu habis.</p>
            
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '1rem' }}>
                {[1, 3, 7].map(d => (
                  <button 
                    key={d}
                    onClick={() => setRentDays(d)}
                    style={{ 
                      background: rentDays === d ? 'var(--cyan-accent)' : 'rgba(255,255,255,0.05)', 
                      color: rentDays === d ? '#000' : 'white', 
                      border: `1px solid ${rentDays === d ? 'var(--cyan-accent)' : 'rgba(255,255,255,0.1)'}`, 
                      padding: '0.8rem 0', 
                      borderRadius: '8px', 
                      fontWeight: 'bold', 
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {d} Hari
                  </button>
                ))}
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  min="1"
                  value={rentDays}
                  onChange={e => setRentDays(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value) || 1))}
                  style={{ 
                    width: '100%', 
                    padding: '1rem 3rem 1rem 1rem', 
                    background: 'rgba(0,0,0,0.3)', 
                    border: '1px solid rgba(255,255,255,0.2)', 
                    color: 'white', 
                    borderRadius: '8px', 
                    outline: 'none',
                    fontSize: '1.1rem',
                    textAlign: 'center',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Ketik manual (Hari)"
                />
                <span style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 'bold' }}>Hari</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setRentModalOpen(null)} style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Batal</button>
              <button onClick={() => handleUpdateStatus(rentModalOpen, rentDays)} style={{ flex: 1, padding: '0.8rem', background: 'var(--cyan-accent)', border: 'none', color: '#000', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0, 153, 255, 0.3)' }}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Rent Confirmation Modal */}
      {cancelRentId && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="animate-fade-in" style={{ background: 'var(--bg-secondary)', width: '90%', maxWidth: '400px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,165,0,0.1)', color: 'orange', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Clock size={30} />
            </div>
            <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>Batalkan Rental?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Apakah Anda yakin ingin membatalkan status rental untuk akun ini? Status akan kembali menjadi 'Tersedia'.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setCancelRentId(null)} style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Batal</button>
              <button onClick={() => handleUpdateStatus(cancelRentId, 0)} style={{ flex: 1, padding: '0.8rem', background: 'orange', border: 'none', color: '#000', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 5px 15px rgba(255, 165, 0, 0.3)' }}>Ya, Batalkan</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
