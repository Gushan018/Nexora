import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isImpersonating, setIsImpersonating] = useState(false);

  useEffect(() => {
    // Check for token on mount
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsImpersonating(!!localStorage.getItem('adminToken'));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post(`/auth/login`, { email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData, accountType = 'customer') => {
    try {
      const response = await api.post(`/auth/register/${accountType}`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
    setIsImpersonating(false);
  };

  // Admin support tool: temporarily assume a user's session without their password.
  const loginAsUser = (token, impersonatedUser) => {
    if (!localStorage.getItem('adminToken')) {
      localStorage.setItem('adminToken', localStorage.getItem('token'));
      localStorage.setItem('adminUser', localStorage.getItem('user'));
    }
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(impersonatedUser));
    setUser(impersonatedUser);
    setIsImpersonating(true);
  };

  const returnToAdmin = () => {
    const adminToken = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');
    if (!adminToken || !adminUser) return;

    localStorage.setItem('token', adminToken);
    localStorage.setItem('user', adminUser);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(JSON.parse(adminUser));
    setIsImpersonating(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, setUser, isImpersonating, loginAsUser, returnToAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
