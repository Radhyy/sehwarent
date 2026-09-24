'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Activity, Trash2, Clock, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import '../../globals.css';

export default function AktivitasRental() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchLogs = () => {
    setLoading(true);
    // limit 100 untuk histori yang lebih panjang
    fetch('/api/admin/logs?limit=100')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLogs(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus log riwayat ini? Tindakan ini tidak dapat dibatalkan.')) {
      try {
        const res = await fetch(`/api/admin/logs/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          fetchLogs();
        } else {
          alert('Gagal menghapus log.');
        }
      } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan saat menghapus log.');
      }
    }
  };

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
      <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', color: 'white', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={32} color="var(--cyan-accent)" /> Aktivitas Rental
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontFamily: 'var(--font-geist-sans)' }}>
              Pantau semua riwayat penyewaan dan pengembalian akun.
            </p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem 1.2rem', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Total Log: <span style={{ color: 'white', fontWeight: 'bold' }}>{logs.length}</span> (Max 100)
          </div>
        </div>

        {/* Logs List */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Memuat riwayat aktivitas...</div>
          ) : logs.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada log aktivitas.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {logs.map((log, index) => {
                const isStart = log.action === 'Sewa dimulai';
                const Icon = isStart ? Clock : CheckCircle;
                
                return (
                  <div key={log.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '1.5rem', 
                    borderBottom: index !== logs.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    transition: 'background 0.2s',
                  }} className="hover-glow-blue-subtle">
                    
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <div style={{ 
                        width: '45px', 
                        height: '45px', 
                        borderRadius: '50%', 
                        background: log.color ? `${log.color}15` : 'rgba(0,153,255,0.1)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}>
                        <Icon size={20} color={log.color || 'var(--cyan-accent)'} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <p style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>{log.action}</p>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '12px' }}>
                            {getTimeAgo(log.created_at)}
                          </span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{log.detail}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDelete(log.id)}
                      style={{ 
                        background: 'rgba(255, 77, 77, 0.1)', 
                        color: '#ff4d4d', 
                        border: '1px solid rgba(255, 77, 77, 0.2)', 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '8px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        flexShrink: 0
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 77, 77, 0.2)'; e.currentTarget.style.borderColor = 'rgba(255, 77, 77, 0.5)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 77, 77, 0.1)'; e.currentTarget.style.borderColor = 'rgba(255, 77, 77, 0.2)'; }}
                      title="Hapus Log"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
