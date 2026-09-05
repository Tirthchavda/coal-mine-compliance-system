import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => Promise<void>;
  hasRole: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('coal_gov_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('coal_gov_token'));
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('coal_gov_token'));
  });

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('coal_gov_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          const userData = res.data.data || res.data.user;
          if (userData) {
            setUser(userData);
            localStorage.setItem('coal_gov_user', JSON.stringify(userData));
          }
        } catch (err) {
          console.warn('Session invalid or expired, logging out...');
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password = 'CoalGov@2026') => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', {
        email: email.trim(),
        password
      });
      if (res.data.success) {
        const payload = res.data.data || res.data;
        const authToken = payload.token;
        const authUser = payload.user;

        setToken(authToken);
        setUser(authUser);
        localStorage.setItem('coal_gov_token', authToken);
        localStorage.setItem('coal_gov_user', JSON.stringify(authUser));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Attempt backend audit log asynchronously
    api.post('/auth/logout').catch(() => {});
    setToken(null);
    setUser(null);
    localStorage.removeItem('coal_gov_token');
    localStorage.removeItem('coal_gov_user');
  };

  const switchRole = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/switch-demo', { role });
      if (res.data.success) {
        const payload = res.data.data || res.data;
        const authToken = payload.token;
        const authUser = payload.user;

        setToken(authToken);
        setUser(authUser);
        localStorage.setItem('coal_gov_token', authToken);
        localStorage.setItem('coal_gov_user', JSON.stringify(authUser));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isLoading,
        login,
        logout,
        switchRole,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
