'use client';

import { Crosshair, ScanLine, MessageSquareShare, Gamepad2 } from 'lucide-react';
import '../globals.css';

export default function CaraSewa() {
  const steps = [
    {
      icon: <Crosshair size={36} color="var(--cyan-accent)" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 0 8px rgba(0,153,255,0.8))' }} />,
      title: '1. Cek & Pilih Produk',
      description: 'Kunjungi halaman Beranda atau Rental, lalu pilih akun sultan PUBG Mobile yang Anda inginkan.'
    },
    {
      icon: <ScanLine size={36} color="var(--cyan-accent)" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 0 8px rgba(0,153,255,0.8))' }} />,
      title: '2. Lihat Detail Akun',
      description: 'Klik pada produk untuk melihat spesifikasi lengkap, harga, serta deskripsi dan aturan rental.'
    },
    {
      icon: <MessageSquareShare size={36} color="var(--cyan-accent)" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 0 8px rgba(0,153,255,0.8))' }} />,
      title: '3. Pesan via WhatsApp',
      description: 'Klik tombol "PESAN VIA WHATSAPP" pada detail produk untuk terhubung langsung ke admin kami.'
    },
    {
      icon: <Gamepad2 size={36} color="var(--cyan-accent)" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 0 8px rgba(0,153,255,0.8))' }} />,
      title: '4. Koordinasi & Main',
      description: 'Admin akan mengarahkan proses pembayaran. Setelah lunas, data akun langsung dikirim dan Anda siap bermain!'
    }
  ];

  return (
    <main className="main-container animate-fade-in" style={{ paddingBottom: '5rem', paddingTop: '3rem', minHeight: '80vh' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'white', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>TUTORIAL CARA SEWA</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'var(--font-geist-sans)' }}>
          Ikuti 4 langkah mudah berikut ini untuk mulai merental akun impian Anda di SehwaRent.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        {steps.map((step, index) => (
          <div key={index} className="product-card hover-glow-blue" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2.5rem 1.5rem', textAlign: 'center', transition: 'all 0.3s ease', cursor: 'default' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(0, 153, 255, 0.15) 0%, rgba(179, 0, 255, 0.15) 100%)', width: '80px', height: '80px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1rem auto 2rem auto', boxShadow: '0 0 25px rgba(0, 153, 255, 0.2), inset 0 0 15px rgba(179, 0, 255, 0.1)', border: '1px solid rgba(0, 153, 255, 0.3)', transform: 'rotate(45deg)' }}>
              <div style={{ transform: 'rotate(-45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {step.icon}
              </div>
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'white' }}>{step.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', fontFamily: 'var(--font-geist-sans)' }}>
              {step.description}
            </p>
          </div>
        ))}
      </div>

    </main>
  );
}
