import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ theme, toggleTheme, setIsContactOpen, currentView = 'portfolio', setCurrentView }) {
  const { user, logout, toggleRole } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
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

  const handleToggleRole = (e) => {
    e.stopPropagation();
    toggleRole();
    setRoleMenuOpen(false);
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
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', position: 'relative' }}>
              
              {/* Kullanıcı adı + Rol Badge */}
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
                  lineHeight: '1',
                  transition: 'all 0.3s ease'
                }}>
                  {user.role.toUpperCase()}
                </span>
              </div>

              {/* Toggle Role Button */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setRoleMenuOpen(prev => !prev)}
                  title={`Rolü Değiştir (Şu an: ${user.role.toUpperCase()})`}
                  style={{
                    background: user.role === 'admin'
                      ? 'rgba(139, 92, 246, 0.12)'
                      : 'rgba(56, 189, 248, 0.12)',
                    border: user.role === 'admin'
                      ? '1px solid rgba(139, 92, 246, 0.35)'
                      : '1px solid rgba(56, 189, 248, 0.35)',
                    color: user.role === 'admin' ? 'var(--accent-purple)' : 'var(--accent-cyan)',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    padding: '3px 7px',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease',
                    letterSpacing: '0.02em',
                    lineHeight: '1.4'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.opacity = '0.75'; }}
                  onMouseOut={(e) => { e.currentTarget.style.opacity = '1'; }}
                >
                  ⇄ Rol
                </button>

                {/* Dropdown Menu */}
                {roleMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      minWidth: '160px',
                      background: 'rgba(15, 23, 42, 0.97)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      boxShadow: '0 12px 32px -4px rgba(0,0,0,0.5)',
                      backdropFilter: 'blur(12px)',
                      zIndex: 9999,
                      overflow: 'hidden'
                    }}
                    onMouseLeave={() => setRoleMenuOpen(false)}
                  >
                    {/* Header label */}
                    <div style={{ padding: '8px 12px 6px', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--border-color)' }}>
                      Rol Değiştir
                    </div>

                    {/* Admin option */}
                    <button
                      onClick={user.role !== 'admin' ? handleToggleRole : () => setRoleMenuOpen(false)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: user.role === 'admin' ? 'rgba(139,92,246,0.1)' : 'transparent',
                        border: 'none',
                        cursor: user.role === 'admin' ? 'default' : 'pointer',
                        color: user.role === 'admin' ? 'var(--accent-purple)' : 'var(--text-muted)',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background 0.15s'
                      }}
                      onMouseOver={(e) => { if (user.role !== 'admin') e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                      onMouseOut={(e) => { if (user.role !== 'admin') e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span>🛡️</span>
                      <span>Admin</span>
                      {user.role === 'admin' && <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--accent-purple)' }}>✓ Aktif</span>}
                    </button>

                    {/* User option */}
                    <button
                      onClick={user.role !== 'user' ? handleToggleRole : () => setRoleMenuOpen(false)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: user.role === 'user' ? 'rgba(56,189,248,0.1)' : 'transparent',
                        border: 'none',
                        cursor: user.role === 'user' ? 'default' : 'pointer',
                        color: user.role === 'user' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background 0.15s',
                        borderTop: '1px solid var(--border-color)'
                      }}
                      onMouseOver={(e) => { if (user.role !== 'user') e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                      onMouseOut={(e) => { if (user.role !== 'user') e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span>👤</span>
                      <span>User</span>
                      {user.role === 'user' && <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--accent-cyan)' }}>✓ Aktif</span>}
                    </button>
                  </div>
                )}
              </div>

              {/* Logout Button */}
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
