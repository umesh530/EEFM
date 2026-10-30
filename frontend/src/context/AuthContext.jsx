import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('procureai-token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/profile');
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('procureai-token');
        setToken('');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('procureai-token', response.data.token);
    setToken(response.data.token);
    setUser(response.data);
    return response.data;
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    localStorage.setItem('procureai-token', response.data.token);
    setToken(response.data.token);
    setUser(response.data);
    return response.data;
  };

  const updateProfile = async (profile) => {
    const response = await api.patch('/auth/profile', profile);
    setUser(response.data);
    return response.data;
  };

  const changePassword = async (passwords) => {
    const response = await api.patch('/auth/password', passwords);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('procureai-token');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, updateProfile, changePassword, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
