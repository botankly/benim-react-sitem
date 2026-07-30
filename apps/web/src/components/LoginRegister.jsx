import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginRegister({ onAuthSuccess, onBackToPortfolio }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      const res = await login(email, password);
      if (res.success) {
        onAuthSuccess();
      } else {
        setError(res.message || 'Giriş yapılamadı.');
      }
    } else {
      if (!name) {
        setError('Lütfen isminizi girin.');
        setLoading(false);
        return;
      }
      const res = await register(name, email, password);
      if (res.success) {
        onAuthSuccess();
      } else {
        setError(res.message || 'Kayıt başarısız.');
      }
    }
    setLoading(false);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 80px)',
      padding: '2rem 1.5rem',
      color: 'var(--text-main)'
    }}>
      
      {/* Glassmorphic Form Card */}
      <div className="card animate-fadeIn" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '2.5rem',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-color)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </h2>
          <p style={{ margin: '0.4rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {isLogin ? 'SaaS Dashboard ve AI paneline erişmek için oturum açın.' : 'Yeni bir kullanıcı hesabı oluşturun.'}
          </p>
        </div>

        {/* Informative Alert for Mock Users */}
        {isLogin && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '12px',
            backgroundColor: 'rgba(99, 102, 241, 0.05)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            fontSize: '0.8rem',
            lineHeight: '1.4',
            color: 'var(--text-muted)'
          }}>
            🔑 **Test Bilgileri / Mock Accounts:**
            <div style={{ marginTop: '4px' }}>
              👤 **Admin:** `admin@botankulay.com` / `admin123` <br/>
              👥 **User:** `user@test.com` / `user123`
            </div>
          </div>
        )}

        {/* Error Box */}
        {error && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.07)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            fontSize: '0.8rem',
            fontWeight: '600'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {/* Name Field (only for register) */}
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>İsim / Name</label>
              <input 
                type="text"
                placeholder="Adınız Soyadınız"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  background: 'rgba(255,255,255,0.02)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>
          )}

          {/* Email Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>E-posta / Email</label>
            <input 
              type="email"
              placeholder="isim@ornek.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'rgba(255,255,255,0.02)',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Şifre / Password</label>
            <input 
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'rgba(255,255,255,0.02)',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              padding: '12px',
              borderRadius: '12px',
              fontWeight: 'bold',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? 'var(--border-color)' : 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
              color: '#fff',
              fontSize: '0.9rem',
              marginTop: '0.5rem'
            }}
          >
            {loading ? 'İşlem yapılıyor...' : isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>

        {/* Footer Switching & Back */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', fontSize: '0.8rem', marginTop: '0.5rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>
              {isLogin ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
            </span>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-cyan)',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginLeft: '5px',
                padding: 0
              }}
            >
              {isLogin ? 'Kayıt Olun' : 'Giriş Yapın'}
            </button>
          </div>

          <button
            onClick={onBackToPortfolio}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              textDecoration: 'underline',
              marginTop: '8px',
              padding: 0
            }}
          >
            ← Portfolyo Sayfasına Geri Dön
          </button>
        </div>

      </div>
    </div>
  );
}
