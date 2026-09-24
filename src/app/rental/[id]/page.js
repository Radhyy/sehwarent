'use client';

import { ArrowLeft, MessageCircle, Info } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import '../../globals.css';

export default function ProductDetail() {
  const params = useParams();
  const { id } = params;

  // Mock data for the first product
  const product = {
    id: 'pubg-glacier-max',
    title: 'PUBG MOBILE - AKUN SULTAN GLACIER MAX',
    image: '/ProductRental/IMG_1955.JPG.jpeg',
    price: 'Rp 25.000',
    originalPrice: 'Rp 40.000',
    tags: ['PUBG MOBILE', 'RENTAL AKUN'],
    loginMethod: 'Twitter / Email',
    description: `Akun Sultan PUBG Mobile dengan spesifikasi GG!
      
- Level: 75
- Rank: Ace Master
- M416 Glacier Level Max (Hit Effect, Kill Message, Loot Box)
- Setelan Mythic banyak
- Title langka
- RP S1 - Sekarang rata-rata max

Aturan Rental:
1. Dilarang menggunakan program ilegal (Cheat/Hack).
2. Dilarang mengubah data akun (Password, Email, dll).
3. Dilarang top up menggunakan metode ilegal.
Pelanggaran akan dikenakan denda dan blacklist!`,
    whatsappText: 'Halo admin SehwaRent, saya ingin merental akun PUBG MOBILE - AKUN SULTAN GLACIER MAX.'
  };

  return (
    <main className="main-container animate-fade-in" style={{ paddingBottom: '5rem', paddingTop: '2rem' }}>
      
      {/* Breadcrumb / Back */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link href="/rental" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--cyan-accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
          <ArrowLeft size={16} /> Kembali ke Katalog
        </Link>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'flex-start' }}>
        
        {/* Left Side - Image */}
        <div style={{ flex: '1 1 min(100%, 400px)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden', padding: '1rem' }}>
          <img src={product.image} alt={product.title} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px' }} />
        </div>

        {/* Right Side - Details */}
        <div style={{ flex: '1 1 min(100%, 400px)', maxWidth: '100%' }}>
          {/* Tags */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
            {product.tags.map(tag => (
              <span key={tag} style={{ background: 'rgba(0, 153, 255, 0.1)', color: 'var(--cyan-accent)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid var(--cyan-accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {tag}
              </span>
            ))}
          </div>

          <h1 style={{ fontSize: '2.2rem', marginBottom: '2rem', lineHeight: '1.3' }}>{product.title}</h1>

          {/* Pricing Box */}
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2.5rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Harga Rental</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Mulai</span>
              <span style={{ color: 'var(--cyan-accent)', fontSize: '2.5rem', fontWeight: 'bold' }}>{product.price}</span>
            </div>
            <p style={{ color: '#ff4d4d', textDecoration: 'line-through', fontSize: '1rem', margin: '0' }}>{product.originalPrice}</p>
          </div>

          {/* Login Method */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={18} color="var(--cyan-accent)" /> Metode Login
            </h3>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem 1.2rem', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {product.loginMethod}
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '3.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'white' }}>Deskripsi & Aturan Rental</h3>
            <div style={{ color: 'var(--text-muted)', lineHeight: '1.8', whiteSpace: 'pre-line', fontSize: '0.95rem' }}>
              {product.description}
            </div>
          </div>

          {/* Order Button */}
          <a 
            href={`https://wa.me/821074350521?text=${encodeURIComponent(product.whatsappText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover-glow-blue"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '10px', 
              width: '100%', 
              padding: '1rem', 
              fontSize: '0.95rem', 
              textDecoration: 'none', 
              borderRadius: '12px',
              background: 'var(--cyan-accent)',
              color: '#000',
              fontWeight: 'bold',
              border: 'none',
              boxShadow: '0 4px 15px rgba(0, 153, 255, 0.4)',
              letterSpacing: '1px',
              boxSizing: 'border-box'
            }}
          >
            <MessageCircle size={20} /> PESAN VIA WHATSAPP
          </a>

        </div>
      </div>
    </main>
  );
}
