import { createContext, useContext, useState, useEffect } from 'react';
import { auth as authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await authApi.login({ email, password });
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    setUser(data.data.user);
    return data.data.user;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    } catch {} finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'Super Admin' || user?.role === 'Admin';
  const isCustomer = user?.role === 'Customer';

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated, isAdmin, isCustomer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
