'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Package, Tags, Users, CreditCard, PlusCircle, LayoutList, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [estimatedIncome, setEstimatedIncome] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Ambil jumlah produk asli
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProductCount(data.length);

          let estIncome = 0;
          let activeCust = 0;
          data.forEach(product => {
            if (product.available_at) {
              const availableTime = new Date(product.available_at).getTime();
              const now = Date.now();
              if (availableTime > now) {
                activeCust++;
                estIncome += (product.current_rent_price || 0);
              }
            }
          });
          setEstimatedIncome(estIncome);
          setActiveCustomers(activeCust);
        }
      })
      .catch(console.error);

    // Ambil jumlah kategori (kalau ada API-nya, kalau tidak ya biarkan 0 atau dummy)
    // Asumsi kita hardcode 4 untuk kategori game besar
    setCategoryCount(4); 

    // Ambil Log Aktivitas
    fetch('/api/admin/logs?limit=5')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLogs(data);
      })
      .catch(console.error);
  }, []);

  const getTimeAgo = (dateStr) => {
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return interval + " tahun lalu";
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return interval + " bulan lalu";
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + " hari lalu";
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + " jam lalu";
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + " menit lalu";
    return "Baru saja";
  };

  return (
    <AdminLayout>
      <style>{`
        .dash-welcome {
          padding: 2.5rem;
          margin-bottom: 2.5rem;
        }
        .dash-title {
          font-size: 2.2rem;
        }
        .dash-subtitle {
          font-size: 1.05rem;
        }
        .dash-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .dash-bottom-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }
        @media (max-width: 768px) {
          .dash-welcome {
            padding: 1.5rem !important;
            margin-bottom: 1.5rem !important;
          }
          .dash-title {
            font-size: 1.5rem !important;
          }
          .dash-subtitle {
            font-size: 0.9rem !important;
          }
          .dash-stats-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
            margin-bottom: 2rem !important;
          }
          .dash-bottom-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
      <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
        
        {/* Welcome Banner */}
        <div className="dash-welcome" style={{ background: 'linear-gradient(135deg, rgba(0,153,255,0.15) 0%, rgba(179,0,255,0.15) 100%)', borderRadius: '16px', border: '1px solid rgba(0,153,255,0.2)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--cyan-accent)', filter: 'blur(100px)', opacity: '0.2' }}></div>
          <h1 className="dash-title" style={{ color: 'white', marginBottom: '0.5rem', letterSpacing: '1px' }}>Selamat Datang, Admin Sultan! 👑</h1>
          <p className="dash-subtitle" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-geist-sans)', maxWidth: '600px' }}>
            Pantau dan kelola seluruh aset rental, transaksi, dan performa bisnis SehwaRent Anda dari satu tempat kendali pusat.
          </p>
        </div>

        {/* Stats Grid */}
        <h2 style={{ fontSize: '1.4rem', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={24} color="var(--cyan-accent)" /> Statistik Utama
        </h2>
        
        <div className="dash-stats-grid">
          {/* Card 1 */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', transition: 'transform 0.2s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>Total Produk</p>
              <div style={{ background: 'rgba(0,153,255,0.1)', padding: '8px', borderRadius: '10px' }}><Package size={20} color="var(--cyan-accent)" /></div>
            </div>
            <p style={{ fontSize: '2.5rem', color: 'white', fontWeight: 'bold', margin: 0 }}>{productCount}</p>
            <p style={{ color: '#00ffcc', fontSize: '0.8rem', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}><ArrowUpRight size={14} /> +2 dari bulan lalu</p>
          </div>

          {/* Card 2 */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>Total Kategori</p>
              <div style={{ background: 'rgba(179,0,255,0.1)', padding: '8px', borderRadius: '10px' }}><Tags size={20} color="#b300ff" /></div>
            </div>
            <p style={{ fontSize: '2.5rem', color: 'white', fontWeight: 'bold', margin: 0 }}>{categoryCount}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '10px' }}>Status: Stabil</p>
          </div>

          {/* Card 3 */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>Pelanggan Aktif</p>
              <div style={{ background: 'rgba(0,255,204,0.1)', padding: '8px', borderRadius: '10px' }}><Users size={20} color="#00ffcc" /></div>
            </div>
            <p style={{ fontSize: '2.5rem', color: 'white', fontWeight: 'bold', margin: 0 }}>{activeCustomers}</p>
            <p style={{ color: '#00ffcc', fontSize: '0.8rem', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>Berdasarkan akun yg dirental</p>
          </div>

          {/* Card 4 */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>Pendapatan Aktif (Est)</p>
              <div style={{ background: 'rgba(255,77,77,0.1)', padding: '8px', borderRadius: '10px' }}><CreditCard size={20} color="#ff4d4d" /></div>
            </div>
            <p style={{ fontSize: '1.8rem', color: 'white', fontWeight: 'bold', margin: 0, marginTop: '8px' }}>
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(estimatedIncome)}
            </p>
            <p style={{ color: '#ff4d4d', fontSize: '0.8rem', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>Berdasarkan durasi rental aktif saat ini</p>
          </div>
        </div>

        {/* Bottom Section: Activity & Actions */}
        <div className="dash-bottom-grid">
          
          {/* Recent Activity */}
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Log Aktivitas Terbaru
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {logs.length > 0 ? logs.map((log, i) => (
                <div key={i} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', paddingBottom: '1rem', borderBottom: i !== logs.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: log.color || 'var(--cyan-accent)', marginTop: '6px' }}></div>
                  <div>
                    <p style={{ color: 'white', fontSize: '0.95rem', margin: '0 0 4px 0' }}>{log.action}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{log.detail} <span style={{ opacity: 0.5 }}>• {getTimeAgo(log.created_at)}</span></p>
                  </div>
                </div>
              )) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Belum ada log aktivitas.</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '1.5rem' }}>
              Aksi Cepat
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Link href="/admin/rental/tambah" className="hover-glow-blue" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'rgba(0,153,255,0.1)', border: '1px solid rgba(0,153,255,0.3)', borderRadius: '12px', padding: '1.5rem 1rem', textDecoration: 'none', textAlign: 'center', transition: 'all 0.3s' }}>
                <PlusCircle size={28} color="var(--cyan-accent)" />
                <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 'bold' }}>Tambah Produk</span>
              </Link>

              <Link href="/admin/rental" className="hover-glow-blue" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'rgba(179,0,255,0.1)', border: '1px solid rgba(179,0,255,0.3)', borderRadius: '12px', padding: '1.5rem 1rem', textDecoration: 'none', textAlign: 'center', transition: 'all 0.3s' }}>
                <LayoutList size={28} color="#b300ff" />
                <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 'bold' }}>Kelola Produk</span>
              </Link>
              
              <Link href="/admin/kategori" className="hover-glow-blue" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'rgba(0,255,204,0.1)', border: '1px solid rgba(0,255,204,0.3)', borderRadius: '12px', padding: '1.5rem 1rem', textDecoration: 'none', textAlign: 'center', transition: 'all 0.3s' }}>
                <Tags size={28} color="#00ffcc" />
                <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 'bold' }}>Kelola Kategori</span>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
