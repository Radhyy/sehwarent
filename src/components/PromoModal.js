'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

export default function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Check if user has requested not to show it again
    const hidePromo = localStorage.getItem('hidePromo');
    if (hidePromo === 'true') {
      return;
    }

    // Don't show on admin routes if desired (optional), but user said everywhere
    if (pathname && pathname.startsWith('/admin')) {
      return;
    }

    setIsOpen(true);
  }, [pathname]);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('hidePromo', 'true');
    }
    setIsOpen(false);
  };

  const handleLinkClick = () => {
    if (dontShowAgain) {
      localStorage.setItem('hidePromo', 'true');
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '1rem',
      backdropFilter: 'blur(5px)'
    }}>
      <div className="animate-fade-in" style={{
        backgroundColor: '#13141c',
        borderRadius: '24px',
        maxWidth: '380px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
      }}>
        {/* Close button */}
        <button 
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            color: 'white',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            backdropFilter: 'blur(4px)'
          }}
        >
          <X size={18} />
        </button>

        {/* Image */}
        <div style={{ width: '100%', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', overflow: 'hidden' }}>
          <img 
            src="/Promosi.png" 
            alt="Promosi SehwaRent" 
            style={{ width: '100%', display: 'block', objectFit: 'cover' }}
          />
        </div>

        {/* Content */}
        <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'white', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '2rem', fontWeight: '500' }}>
            Mau Info Akun Rental Yang Paling Ganteng? Join Saluran Sekarang!
          </p>

          <a 
            href="https://whatsapp.com/channel/0029VbCrf9W5kg76mZlo9D3T"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className="hover-glow-blue"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '0.9rem',
              borderRadius: '30px',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              textDecoration: 'none',
              background: 'transparent',
              marginBottom: '1.5rem',
              transition: 'all 0.3s ease',
              fontSize: '0.95rem',
              fontWeight: 'bold',
              textAlign: 'center',
              boxSizing: 'border-box',
              margin: '0 auto 1.5rem auto'
            }}
          >
            Join sekarang
          </a>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={dontShowAgain} 
              onChange={(e) => setDontShowAgain(e.target.checked)}
              style={{ cursor: 'pointer', accentColor: 'var(--cyan-accent)' }}
            />
            Jangan tampilkan lagi
          </label>
        </div>
      </div>
    </div>
  );
}
