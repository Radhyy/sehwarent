'use client';

import { Search, Home, Package, Clock, ShieldCheck, ShoppingCart, MessageCircle, Info } from 'lucide-react';
import Link from 'next/link';
import RentBadge from '@/components/RentBadge';
import '../globals.css';

import { useState, useEffect } from 'react';

export default function RentalPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(console.error);
  }, []);
  return (
    <>




      {/* Main Content */}
      <main className="main-container">
        
        {/* Flyer Banner */}
        <div className="hero-banner animate-fade-in">
          <img src="/Flyer.png" alt="Promo Flyer SehwaRent" />
        </div>

        {/* Search Bar */}
        <div className="search-container animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Search size={20} color="#94a3b8" />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Cari produk rental — judul, deskripsi, metode login..." 
          />
        </div>

        {/* Products Section */}
        <div className="animate-fade-in" style={{ marginTop: '3rem', animationDelay: '0.2s', paddingBottom: '5rem' }}>
          
          <div className="product-grid">
            {products.length > 0 ? products.map(product => (
              <Link key={product.id} href={`/rental/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="product-card hover-glow-blue" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', overflow: 'hidden', padding: '1rem', transition: 'all 0.3s ease', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={`/api/image/${product.image_id}`} alt={product.title} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px', filter: (product.available_at && new Date(product.available_at) > new Date()) ? 'grayscale(80%)' : 'none' }} />
                    <RentBadge availableAt={product.available_at} />
                  </div>
                  <div className="product-card-body" style={{ padding: '1.5rem 0.5rem 0.5rem 0.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div className="product-badge" style={{ background: 'rgba(0, 153, 255, 0.1)', color: 'var(--cyan-accent)', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', display: 'inline-block', marginBottom: '0.8rem', border: '1px solid rgba(0, 153, 255, 0.2)' }}>
                      {product.category_name || product.category_id}
                    </div>
                    <h3 className="product-title" style={{ fontSize: '1rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>{product.title}</h3>
                    <p className="product-duration" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem', marginTop: 'auto', fontFamily: 'var(--font-geist-sans)' }}>Mulai 1 Hari</p>
                    <div>
                      <p className="product-price-final" style={{ color: 'var(--cyan-accent)', fontSize: '1.3rem', fontWeight: 'bold', margin: '0' }}>Mulai {product.price}</p>
                    </div>
                  </div>
                </div>
              </Link>
            )) : (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', width: '100%' }}>Memuat produk...</p>
            )}

          </div>
        </div>
      </main>
    </>
  );
}
