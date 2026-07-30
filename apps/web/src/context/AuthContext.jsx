import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('auth_token', data.token);
        // Include subscription plan (default to free if not set in response)
        const userObj = { 
          id: data.id, 
          name: data.name, 
          email: data.email, 
          role: data.role, 
          subscriptionPlan: data.subscriptionPlan || (data.role === 'admin' ? 'enterprise' : 'free') 
        };
        localStorage.setItem('auth_user', JSON.stringify(userObj));
        setToken(data.token);
        setUser(userObj);
        setLoading(false);
        return { success: true };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Giriş yapılamadı.');
      }
    } catch (error) {
      console.warn('Backend login connection failed, trying fallback mock auth mechanism.', error);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
      
      if (email === 'admin@botankulay.com' && password === 'admin123') {
        const mockToken = 'mock_jwt_token_admin_xyz';
        const mockUser = { id: '1', name: 'Botan Admin', email: 'admin@botankulay.com', role: 'admin', subscriptionPlan: 'enterprise' };
        localStorage.setItem('auth_token', mockToken);
        localStorage.setItem('auth_user', JSON.stringify(mockUser));
        setToken(mockToken);
        setUser(mockUser);
        setLoading(false);
        return { success: true };
      } else if (email === 'user@test.com' && password === 'user123') {
        const mockToken = 'mock_jwt_token_user_abc';
        const mockUser = { id: '2', name: 'Test User', email: 'user@test.com', role: 'user', subscriptionPlan: 'free' };
        localStorage.setItem('auth_token', mockToken);
        localStorage.setItem('auth_user', JSON.stringify(mockUser));
        setToken(mockToken);
        setUser(mockUser);
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false);
        return { success: false, message: 'Geçersiz e-posta adresi veya şifre. (İpucu: admin@botankulay.com / admin123 VEYA user@test.com / user123)' };
      }
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('auth_token', data.token);
        const userObj = { id: data.id, name: data.name, email: data.email, role: data.role, subscriptionPlan: 'free' };
        localStorage.setItem('auth_user', JSON.stringify(userObj));
        setToken(data.token);
        setUser(userObj);
        setLoading(false);
        return { success: true };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Kayıt başarısız.');
      }
    } catch (error) {
      console.warn('Backend register connection failed, using fallback mock registration.', error);
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockToken = 'mock_jwt_token_new_user_' + Math.random().toString(36).substring(2, 7);
      const mockUser = { id: Math.random().toString(), name, email, role: 'user', subscriptionPlan: 'free' };
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      setToken(mockToken);
      setUser(mockUser);
      setLoading(false);
      return { success: true };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
  };

  const updateSubscriptionPlan = (newPlan) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, subscriptionPlan: newPlan };
      localStorage.setItem('auth_user', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleRole = () => {
    setUser((prev) => {
      if (!prev) return null;
      const newRole = prev.role === 'admin' ? 'user' : 'admin';
      const updated = { ...prev, role: newRole };
      localStorage.setItem('auth_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateSubscriptionPlan, toggleRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
