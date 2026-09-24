'use client';

import Link from 'next/link';
import { MessageCircle, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ marginTop: '0', background: '#090d16', position: 'relative' }}>
      {/* Top Decoration */}
      <img 
        src="/HiasanAtasFooter.png" 
        alt="Footer Decoration" 
        style={{ width: '100%', height: 'auto', display: 'block' }} 
      />

      <div className="footer-grid">
        
        {/* Left Column - Brand & CS */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
            <img src="/LogoSehwarent.png" alt="SehwaRent Logo" style={{ height: '45px', width: 'auto' }} />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', fontFamily: 'var(--font-geist-sans)', marginBottom: '2.5rem', maxWidth: '90%' }}>
            SEHWARENT adalah marketplace gaming untuk jual beli akun game, rental akun, top up, dan berbagai layanan gaming. Temukan akun game favorit dengan proses transaksi yang mudah, cepat, dan aman.
          </p>
          
          <h4 style={{ color: '#6b7280', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.2rem' }}>CUSTOMER SERVICE</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <a href="https://wa.me/821074350521" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', color: 'black', padding: '10px 18px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold', textDecoration: 'none', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <MessageCircle size={18} /> CS Rental
              </a>
              <a href="https://whatsapp.com/channel/0029VbCrf9W5kg76mZlo9D3T" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', color: 'black', padding: '10px 18px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold', textDecoration: 'none', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <MessageCircle size={18} /> Saluran
              </a>
            </div>
          </div>
        </div>

        {/* Middle Column - Navigasi */}
        <div>
          <h4 style={{ color: '#6b7280', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.8rem' }}>NAVIGASI</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <li><Link href="/" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.95rem', fontFamily: 'var(--font-geist-sans)', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--cyan-accent)'} onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}>Beranda</Link></li>
            <li><Link href="/rental" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.95rem', fontFamily: 'var(--font-geist-sans)', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--cyan-accent)'} onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}>Katalog Game</Link></li>
            <li><Link href="#" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.95rem', fontFamily: 'var(--font-geist-sans)', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--cyan-accent)'} onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}>Tutorial Belanja</Link></li>
            <li><Link href="#" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.95rem', fontFamily: 'var(--font-geist-sans)', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--cyan-accent)'} onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}>Cek Pesanan</Link></li>
          </ul>
        </div>

        {/* Right Column - Bantuan */}
        <div>
          <h4 style={{ color: '#6b7280', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.8rem' }}>BANTUAN</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <li><Link href="#" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.95rem', fontFamily: 'var(--font-geist-sans)', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--cyan-accent)'} onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}>Syarat & Ketentuan</Link></li>
            <li><Link href="#" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.95rem', fontFamily: 'var(--font-geist-sans)', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--cyan-accent)'} onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}>Kebijakan Privasi</Link></li>
            <li><Link href="#" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.95rem', fontFamily: 'var(--font-geist-sans)', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--cyan-accent)'} onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}>Hubungi Kami</Link></li>
            <li><Link href="#" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.95rem', fontFamily: 'var(--font-geist-sans)', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--cyan-accent)'} onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}>FAQ</Link></li>
          </ul>
        </div>
        
      </div>
    </footer>
  );
}
