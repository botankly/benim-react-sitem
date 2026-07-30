import React from 'react';

export default function Navbar({ theme, toggleTheme, setIsContactOpen }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <a href="#hero" className="navbar-logo">Botan Külay</a>
        <ul className="navbar-links">
          <li><a href="#hakkimda">Hakkımda</a></li>
          <li><a href="#projeler">Projelerim</a></li>
          <li><a href="#mobile-showcase">Mobil</a></li>
          <li><a href="#snippets">Kodlar</a></li>
          <li><a href="#blog">Blog</a></li>
          <li><a href="#github-activity">GitHub</a></li>
          <li><a href="#iletisim" onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }}>İletişim</a></li>
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
