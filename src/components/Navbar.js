'use client';

import { Home, Clock, Info, User, ChevronDown, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    fetch('/api/admin/session')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setUser(null);
    router.refresh();
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link href="/">
          <img src="/LogoSehwarent.png" alt="SehwaRent Logo" style={{ height: '50px', objectFit: 'contain' }} />
        </Link>
      </div>
      
      <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <li className={pathname === '/' ? 'active' : ''}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none', width: '100%' }}>
            <Home size={18} /> Beranda
          </Link>
        </li>
        <li className={pathname === '/rental' ? 'active' : ''}>
          <Link href="/rental" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none', width: '100%' }}>
            <Clock size={18} /> Rental
          </Link>
        </li>
        <li className={pathname === '/cara-sewa' ? 'active' : ''}>
          <Link href="/cara-sewa" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none', width: '100%' }}>
            <Info size={18} /> Cara Sewa
          </Link>
        </li>
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="nav-auth" style={{ position: 'relative' }}>
        {user ? (
          <div>
            <div 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0, 153, 255, 0.1)', padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer', border: '1px solid var(--cyan-accent)' }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--cyan-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-primary)' }}>
                <User size={16} />
              </div>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>{user.username}</span>
              <ChevronDown size={16} style={{ color: 'var(--cyan-accent)' }} />
            </div>

            {dropdownOpen && (
              <div style={{ position: 'absolute', top: '120%', right: 0, width: '200px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 100 }}>
                <Link href="/admin/dashboard" style={{ textDecoration: 'none' }} onClick={() => setDropdownOpen(false)}>
                  <div style={{ padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <LayoutDashboard size={18} color="var(--cyan-accent)" />
                    <span style={{ fontSize: '0.9rem' }}>Admin Dashboard</span>
                  </div>
                </Link>
                <div onClick={() => { setDropdownOpen(false); handleLogout(); }} style={{ padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#ff4d4d', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,77,77,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <LogOut size={18} />
                  <span style={{ fontSize: '0.9rem' }}>Keluar</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link href="/admin/login" style={{ textDecoration: 'none' }}>
            <button className="btn-cyan" style={{ padding: '0.5rem 1.5rem', fontSize: '0.95rem' }}>LOGIN</button>
          </Link>
        )}
        </div>

        <button className="hamburger-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </nav>
  );
}
