import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ theme, toggleTheme, setIsContactOpen, currentView = 'portfolio', setCurrentView }) {
  const { user, logout } = useAuth();
  const isDashboard = currentView === 'dashboard';
  const isLoginView = currentView === 'login';

  const handleDashboardClick = (e) => {
    e.preventDefault();
    if (user) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('login');
    }
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    logout();
    setCurrentView('portfolio');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <a 
          href="#hero" 
          onClick={(e) => { 
            if (isDashboard || isLoginView) {
              e.preventDefault();
              setCurrentView('portfolio');
            } 
          }} 
          className="navbar-logo"
        >
          Botan Külay
        </a>
        <ul className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          
          {/* Ana Bağlantılar */}
          {isDashboard ? (
            <li>
              <a 
                href="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  setCurrentView('portfolio'); 
                }}
                style={{ fontWeight: 'bold', color: 'var(--accent-cyan)' }}
              >
                ← Portfolyo'ya Dön
              </a>
            </li>
          ) : isLoginView ? (
            <li>
              <a 
                href="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  setCurrentView('portfolio'); 
                }}
                style={{ fontWeight: 'bold', color: 'var(--accent-cyan)' }}
              >
                ← Portfolyo'ya Dön
              </a>
            </li>
          ) : (
            <>
              <li><a href="#hakkimda">Hakkımda</a></li>
              <li><a href="#projeler">Projelerim</a></li>
              <li><a href="#mobile-showcase">Mobil</a></li>
              <li><a href="#snippets">Kodlar</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#github-activity">GitHub</a></li>
              <li><a href="#iletisim" onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }}>İletişim</a></li>
              <li>
                <a 
                  href="#dashboard" 
                  onClick={handleDashboardClick}
                  style={{ fontWeight: 'bold', color: 'var(--accent-purple)' }}
                  className="navbar-dashboard-link"
                >
                  SaaS Dashboard ✨
                </a>
              </li>
            </>
          )}

          {/* Auth Profil / Giriş Bölümü */}
          {user ? (
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#fff', lineHeight: '1.2' }}>{user.name}</span>
                <span style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: '800', 
                  padding: '1px 6px', 
                  borderRadius: '4px',
                  backgroundColor: user.role === 'admin' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                  color: user.role === 'admin' ? 'var(--accent-purple)' : 'var(--accent-cyan)',
                  border: user.role === 'admin' ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid rgba(56, 189, 248, 0.4)',
                  marginTop: '2px',
                  lineHeight: '1'
                }}>
                  {user.role.toUpperCase()}
                </span>
              </div>
              <button 
                onClick={handleLogoutClick}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'none'}
              >
                Çıkış
              </button>
            </li>
          ) : (
            !isLoginView && (
              <li>
                <button 
                  onClick={() => setCurrentView('login')}
                  className="btn"
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Giriş Yap
                </button>
              </li>
            )
          )}

          {/* Tema Değiştirici Buton */}
          <li>
            <button 
              onClick={toggleTheme} 
              className="theme-toggle-btn"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-main)',
                cursor: 'pointer',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                padding: '4px 8px',
                borderRadius: '8px',
                transition: 'background 0.2s',
                lineHeight: '1'
              }}
              title={theme === 'dark' ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
              aria-label={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
