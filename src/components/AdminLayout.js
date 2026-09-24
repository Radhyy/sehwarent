'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Package, Tags, LogOut, Menu, X, User, Globe, Search, Activity } from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (e) {
      console.error(e);
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: <Home size={18} />, path: '/admin/dashboard' },
    { name: 'Kelola Rental', icon: <Package size={18} />, path: '/admin/rental' },
    { name: 'Kelola Kategori', icon: <Tags size={18} />, path: '/admin/kategori' },
    { name: 'Aktivitas Rental', icon: <Activity size={18} />, path: '/admin/aktivitas' },
  ];

  return (
    <>
      <style>{`
        .admin-sidebar {
          display: flex;
        }
        .admin-bottom-nav {
          display: none;
        }
        .admin-header-logo {
          display: none;
        }
        @media (max-width: 768px) {
          .admin-sidebar {
            display: none !important;
          }
          .admin-bottom-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: rgba(10, 15, 28, 0.95);
            backdrop-filter: blur(10px);
            border-top: 1px solid rgba(255,255,255,0.1);
            z-index: 1000;
            justify-content: space-around;
            padding: 0.6rem 0;
            padding-bottom: calc(0.6rem + env(safe-area-inset-bottom));
          }
          .admin-header-menu-btn {
            display: none !important;
          }
          .admin-main-content {
            padding: 1rem !important;
            padding-bottom: 90px !important;
          }
          .admin-header-title {
            display: none !important;
          }
          .admin-header {
            padding: 0 1rem !important;
          }
          .admin-header-logo {
            display: block !important;
            height: 30px;
          }
        }
      `}</style>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)', fontFamily: 'var(--font-geist-sans)' }}>
      {/* Sidebar */}
      <div className="admin-sidebar" style={{ 
        width: isSidebarOpen ? '260px' : '0px', 
        background: 'var(--bg-secondary)', 
        borderRight: '1px solid rgba(255,255,255,0.05)', 
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        flexDirection: 'column',
        boxShadow: '5px 0 15px rgba(0,0,0,0.2)'
      }}>
        {/* Logo */}
        <div style={{ padding: '2rem 1.5rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '260px', width: '100%', boxSizing: 'border-box' }}>
          <img src="/LogoSehwarent.png" alt="Logo" style={{ height: '40px' }} />
        </div>

        {/* Search Bar */}
        <div style={{ padding: '0 1.5rem 1.5rem', minWidth: '260px', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.6rem 0.8rem', color: 'var(--text-muted)', boxSizing: 'border-box', width: '100%' }}>
            <Search size={16} style={{ marginRight: '8px', flexShrink: 0 }} />
            <input type="text" placeholder="Search" style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontSize: '0.85rem' }} />
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0, marginLeft: '8px' }}>⌘ S</div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '0 1.5rem', display: 'flex', flexDirection: 'column', minWidth: '260px', boxSizing: 'border-box' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '1rem', marginTop: '0.5rem' }}>MAIN</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {menuItems.map(item => {
              const active = pathname === item.path;
              return (
                <Link key={item.name} href={item.path} style={{ textDecoration: 'none' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    padding: '0.75rem 1rem', 
                    borderRadius: '8px',
                    color: active ? 'white' : 'var(--text-muted)',
                    background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
                    transition: 'all 0.2s ease',
                    fontWeight: active ? '600' : '500',
                    boxSizing: 'border-box'
                  }}>
                    <div style={{ color: active ? 'white' : 'inherit', display: 'flex', alignItems: 'center' }}>
                      {item.icon}
                    </div>
                    <span style={{ fontSize: '0.9rem' }}>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Links */}
        <div style={{ padding: '1.5rem', minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '0.2rem', boxSizing: 'border-box', marginTop: 'auto' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: '500', transition: 'color 0.2s', borderRadius: '8px' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
              <Globe size={18} />
              <span style={{ fontSize: '0.9rem' }}>Landing Page</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Header */}
        <header className="admin-header" style={{ 
          height: '70px', 
          background: 'rgba(10, 15, 28, 0.8)', 
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 2rem'
        }}>
          <button 
            className="admin-header-menu-btn"
            onClick={() => setSidebarOpen(!isSidebarOpen)} 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <img src="/LogoSehwarent.png" alt="SehwaRent" className="admin-header-logo" />
          
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
            <span className="admin-header-title" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Admin SehwaRent</span>
            <div 
              onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
              style={{ width: '32px', height: '32px', background: 'rgba(0, 153, 255, 0.1)', border: '1px solid var(--cyan-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan-accent)', cursor: 'pointer' }}
            >
              <User size={16} />
            </div>
            
            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '50px',
                right: '0',
                background: 'rgba(10, 15, 28, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '0.5rem',
                minWidth: '180px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(10px)',
                zIndex: 1000
              }}>
                <div 
                  onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.8rem 1rem', color: '#ff4d4d', cursor: 'pointer', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '500', whiteSpace: 'nowrap' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 77, 77, 0.1)'} 
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <LogOut size={16} /> Keluar
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-main-content" style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="admin-bottom-nav">
        {menuItems.map(item => {
          const active = pathname === item.path;
          return (
            <Link key={item.name} href={item.path} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: active ? 'var(--cyan-accent)' : 'var(--text-muted)', transition: 'color 0.2s' }}>
                {item.icon}
                <span style={{ fontSize: '0.65rem', fontWeight: active ? 'bold' : 'normal' }}>{item.name === 'Kelola Kategori' ? 'Kategori' : item.name === 'Kelola Rental' ? 'Rental' : item.name}</span>
              </div>
            </Link>
          );
        })}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
            <Globe size={18} />
            <span style={{ fontSize: '0.65rem' }}>Landing</span>
          </div>
        </Link>
      </div>
    </div>
    </>
  );
}
