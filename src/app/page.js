'use client';

import { useState, useEffect } from 'react';
import { Search, Home, Package, Clock, ShieldCheck, ShoppingCart, MessageCircle, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import RentBadge from '@/components/RentBadge';
import './globals.css';

export default function LandingPage() {
  const flyers = ['/FlyerLandingPage1.png', '/FlyerLandingPage2.png'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data.slice(0, 4)); // show top 4
      })
      .catch(console.error);
  }, []);

  const faqs = [
    {
      question: "Apakah akun rental aman dari hack & terpercaya?",
      answer: "Tentu saja! SehwaRent adalah platform terpercaya dan sudah melayani ribuan pelanggan. Semua akun kami legal dan aman untuk digunakan bermain santai maupun turnamen."
    },
    {
      question: "Bagaimana cara menyewa akun di SehwaRent?",
      answer: "Pilih akun yang Anda inginkan di halaman Rental, lalu klik pesanan untuk terhubung dengan Admin via WhatsApp. Setelah proses pembayaran selesai, data akun akan langsung dikirim."
    },
    {
      question: "Apakah bisa login di semua device (iOS / Android / Emulator)?",
      answer: "Mayoritas akun kami bisa diloginkan di iOS dan Android. Untuk informasi lebih spesifik mengenai emulator atau detail metode login, silakan cek detail pada produk masing-masing atau tanyakan langsung ke admin."
    },
    {
      question: "Apa yang terjadi jika saya menggunakan program ilegal (Cheat)?",
      answer: "Penggunaan program ilegal (cheat) sangat DILARANG KERAS. Jika terdeteksi, durasi rental Anda otomatis hangus, dan Anda bisa dikenakan denda ganti rugi serta di-*blacklist* secara permanen."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % flyers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? flyers.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % flyers.length);
  };
  return (
    <>




      {/* Main Content */}
      <main className="main-container">
        
        {/* Landing Page Hero Carousel */}
        <div className="hero-carousel animate-fade-in" style={{ position: 'relative', width: '100%', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          {/* Hidden image just to preserve the exact dynamic height based on aspect ratio */}
          <img src={flyers[0]} alt="Spacer" style={{ width: '100%', height: 'auto', display: 'block', visibility: 'hidden' }} />
          
          {flyers.map((flyer, index) => (
            <img 
              key={index}
              src={flyer} 
              alt={`Promo Flyer ${index + 1}`} 
              style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%', 
                height: '100%',
                objectFit: 'cover',
                opacity: currentIndex === index ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out',
                display: 'block'
              }} 
            />
          ))}
          
          {/* Nav Arrows */}
          <button className="carousel-arrow" onClick={handlePrev} style={{ position: 'absolute', top: '50%', left: '20px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', transition: 'background 0.3s', zIndex: 10 }}>
            <ChevronLeft size={24} />
          </button>
          
          <button className="carousel-arrow" onClick={handleNext} style={{ position: 'absolute', top: '50%', right: '20px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', transition: 'background 0.3s', zIndex: 10 }}>
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="carousel-dots" style={{ position: 'absolute', bottom: '20px', width: '100%', display: 'flex', justifyContent: 'center', gap: '8px', zIndex: 10 }}>
            {flyers.map((_, idx) => (
              <div 
                key={idx} 
                onClick={() => setCurrentIndex(idx)}
                style={{ 
                  width: '30px', 
                  height: '6px', 
                  borderRadius: '4px', 
                  background: currentIndex === idx ? 'var(--cyan-accent)' : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'background 0.3s'
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Two Action Cards Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
          
          {/* Rental Card */}
          <Link href="/rental" style={{ textDecoration: 'none' }}>
            <div className="action-card hover-glow-purple" style={{ 
              position: 'relative', 
              background: 'linear-gradient(135deg, #2a0845 0%, #6441A5 100%)', 
              borderRadius: '16px', 
              padding: '2rem 1.5rem', 
              border: '1px solid #b300ff',
              boxShadow: '0 0 20px rgba(179, 0, 255, 0.4), inset 0 0 15px rgba(179, 0, 255, 0.2)',
              color: 'white',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              {/* Badge */}
              <div style={{
                position: 'absolute',
                top: '0',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: '#ffd700',
                color: '#000',
                padding: '0.4rem 1.2rem',
                borderRadius: '20px',
                fontWeight: '700',
                fontSize: '0.9rem',
                boxShadow: '0 0 15px rgba(255, 215, 0, 0.8)',
                whiteSpace: 'nowrap'
              }}>
                WAJIB COBA
              </div>

              <h2 className="action-title" style={{ margin: '0', textTransform: 'uppercase' }}>RENTAL AKUN</h2>
              <p style={{ fontSize: '1.1rem', margin: '0.5rem 0 0 0', opacity: '0.9', fontFamily: 'var(--font-geist-sans)' }}>Akun Sultan Siap Main</p>
            </div>
          </Link>

          {/* Saluran Card */}
          <a href="https://whatsapp.com/channel/0029VbCrf9W5kg76mZlo9D3T" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div className="action-card hover-glow-blue" style={{ 
              position: 'relative', 
              background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', 
              borderRadius: '16px', 
              padding: '2rem 1.5rem', 
              border: '1px solid #00d2ff',
              boxShadow: '0 0 20px rgba(0, 153, 255, 0.4), inset 0 0 15px rgba(0, 153, 255, 0.2)',
              color: 'white',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              {/* Badge */}
              <div style={{
                position: 'absolute',
                top: '0',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: '#ffd700',
                color: '#000',
                padding: '0.4rem 1.2rem',
                borderRadius: '20px',
                fontWeight: '700',
                fontSize: '0.9rem',
                boxShadow: '0 0 15px rgba(255, 215, 0, 0.8)',
                whiteSpace: 'nowrap'
              }}>
                DISKON SPECIAL DISINI
              </div>

              <h2 className="action-title" style={{ margin: '0', textTransform: 'uppercase' }}>SALURAN</h2>
              <p style={{ fontSize: '1.1rem', margin: '0.5rem 0 0 0', opacity: '0.9', fontFamily: 'var(--font-geist-sans)' }}>Join Sekarang Nikmatin Diskonnya</p>
            </div>
          </a>

        </div>

        {/* Official Number Section */}
        <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem', marginBottom: '2rem', animationDelay: '0.4s' }}>
          <a href="https://wa.me/821074350521" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div className="hover-glow-blue" style={{
              background: 'rgba(0, 153, 255, 0.05)',
              border: '1px solid var(--cyan-accent)',
              borderRadius: '50px',
              padding: '1rem 3rem',
              textAlign: 'center',
              boxShadow: '0 0 15px rgba(0, 153, 255, 0.3), inset 0 0 10px rgba(0, 153, 255, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <p style={{ margin: '0', fontSize: '0.9rem', color: 'var(--cyan-accent)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>
                Nomor Resmi SehwaRent
              </p>
              <p style={{ margin: '0.3rem 0 0 0', fontSize: '1.8rem', fontWeight: 'bold', color: 'white', letterSpacing: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <MessageCircle size={24} color="var(--cyan-accent)" /> +821074350521
              </p>
            </div>
          </a>
        </div>

        {/* Products Section */}
        <div className="animate-fade-in" style={{ marginTop: '5rem', animationDelay: '0.6s' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'white', letterSpacing: '2px', textTransform: 'uppercase' }}>PRODUK RENTAL UNGGULAN</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontFamily: 'var(--font-geist-sans)' }}>Pilih akun sultan impianmu dan mainkan sekarang juga.</p>
          </div>

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

          <div style={{ textAlign: 'center', marginTop: '4rem', paddingBottom: '2rem' }}>
            <Link href="/rental" style={{ textDecoration: 'none' }}>
              <button className="btn-cyan hover-glow-blue" style={{ padding: '1rem 3rem', fontSize: '1.2rem', borderRadius: '50px' }}>
                JELAJAHI SEMUA PRODUCT
              </button>
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="animate-fade-in" style={{ marginTop: '5rem', paddingBottom: '5rem', animationDelay: '0.8s', maxWidth: '800px', margin: '5rem auto 5rem auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'white', letterSpacing: '2px', textTransform: 'uppercase' }}>PERTANYAAN UMUM</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontFamily: 'var(--font-geist-sans)' }}>Yang sering ditanyakan oleh pelanggan kami.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, index) => (
              <div key={index} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden', transition: 'all 0.3s ease' }}>
                <div 
                  onClick={() => toggleFaq(index)}
                  style={{ padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', cursor: 'pointer', background: openFaqIndex === index ? 'rgba(0, 153, 255, 0.05)' : 'transparent' }}
                >
                  <h3 style={{ margin: 0, fontSize: '1rem', color: openFaqIndex === index ? 'var(--cyan-accent)' : 'white', fontFamily: 'var(--font-geist-sans)', fontWeight: '600', flex: 1, lineHeight: '1.4' }}>
                    {faq.question}
                  </h3>
                  <span style={{ transition: 'transform 0.3s ease', transform: openFaqIndex === index ? 'rotate(180deg)' : 'rotate(0deg)', color: openFaqIndex === index ? 'var(--cyan-accent)' : 'white', fontSize: '0.9rem', flexShrink: 0 }}>
                    ▼
                  </span>
                </div>
                
                {/* Answer Content */}
                <div style={{ 
                  maxHeight: openFaqIndex === index ? '200px' : '0', 
                  opacity: openFaqIndex === index ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  padding: openFaqIndex === index ? '0 1.5rem 1.5rem 1.5rem' : '0 1.5rem'
                }}>
                  <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '1rem' }}></div>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6', fontFamily: 'var(--font-geist-sans)' }}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </>
  );
}
