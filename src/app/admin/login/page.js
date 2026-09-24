'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import '../../globals.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', position: 'relative' }}>
      
      {/* Background Decor */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', boxSizing: 'border-box', height: '100%', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '500px', height: '500px', background: 'rgba(0, 153, 255, 0.15)', filter: 'blur(100px)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '600px', height: '600px', background: 'rgba(0, 153, 255, 0.1)', filter: 'blur(120px)', borderRadius: '50%' }}></div>
      </div>

      {/* Login Card */}
      <div className="animate-fade-in" style={{ position: 'relative', zIndex: 1, width: '100%', boxSizing: 'border-box', maxWidth: '400px', background: 'rgba(18, 27, 45, 0.85)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '3rem 2.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <img src="/LogoSehwarent.png" alt="Logo" style={{ height: '45px', margin: '0 auto 1.5rem auto' }} />
          <h1 style={{ fontSize: '1.6rem', color: 'white', letterSpacing: '2px', marginBottom: '0.5rem', textTransform: 'uppercase' }}>ADMIN PORTAL</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontFamily: 'var(--font-geist-sans)' }}>Silakan masuk untuk mengelola sistem</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(255, 77, 77, 0.1)', border: '1px solid rgba(255, 77, 77, 0.3)', color: '#ff4d4d', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem', fontFamily: 'var(--font-geist-sans)', fontWeight: 'bold' }}>USERNAME</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <User size={18} />
              </div>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
                style={{ width: '100%', boxSizing: 'border-box', padding: '1rem 1rem 1rem 45px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--cyan-accent)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem', fontFamily: 'var(--font-geist-sans)', fontWeight: 'bold' }}>PASSWORD</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                style={{ width: '100%', boxSizing: 'border-box', padding: '1rem 1rem 1rem 45px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--cyan-accent)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '1rem',
              background: 'var(--cyan-accent)', 
              color: 'var(--bg-primary)', 
              border: 'none', 
              padding: '1rem', 
              borderRadius: '12px', 
              fontSize: '1rem', 
              fontWeight: 'bold', 
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.3s ease',
              boxShadow: '0 5px 15px rgba(0, 153, 255, 0.4)'
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {loading ? <Loader2 size={20} className="spin" /> : 'LOGIN SEKARANG'}
          </button>

        </form>
      </div>

    </div>
  );
}
