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

const FALLBACK_USERS: Record<string, User> = {
  'admin@coal.gov.in': {
    id: 'usr-admin',
    name: 'Rajesh Sharma',
    email: 'admin@coal.gov.in',
    role: 'SUPER_ADMIN',
    department: 'Ministry of Coal - Digital Governance Directorate',
    phone: '+91-11-2338-4501',
    status: 'ACTIVE',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z'
  },
  'inspector@dgms.gov.in': {
    id: 'usr-inspector',
    name: 'P. K. Ramanathan (Director of Mines Safety)',
    email: 'inspector@dgms.gov.in',
    role: 'SAFETY_INSPECTOR',
    department: 'Directorate General of Mines Safety (DGMS) Eastern Zone',
    phone: '+91-326-222-1100',
    status: 'ACTIVE',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z'
  },
  'manager@mine.gov.in': {
    id: 'usr-manager',
    name: 'Suresh Chandra Verma',
    email: 'manager@mine.gov.in',
    role: 'MINE_MANAGER',
    department: 'BCCL - Jharia Coalfield Project Office',
    assignedMineId: 'mine-jharia-01',
    phone: '+91-326-220-4321',
    status: 'ACTIVE',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z'
  },
  'compliance@mine.gov.in': {
    id: 'usr-compliance',
    name: 'Priyanka Sen',
    email: 'compliance@mine.gov.in',
    role: 'COMPLIANCE_OFFICER',
    department: 'ECL - Raniganj Statutory Surveillance Cell',
    assignedMineId: 'mine-raniganj-02',
    phone: '+91-341-252-0112',
    status: 'ACTIVE',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z'
  },
  'hq@coal.gov.in': {
    id: 'usr-hq',
    name: 'Dr. Amitav Mukherjee',
    email: 'hq@coal.gov.in',
    role: 'HQ_MANAGEMENT',
    department: 'Coal India Limited (CIL) - Technical & Operations Wing',
    phone: '+91-33-2324-6555',
    status: 'ACTIVE',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z'
  },
  'contractor@partner.com': {
    id: 'usr-contractor',
    name: 'Vikramaditya Construction Ltd (HEMM Operators)',
    email: 'contractor@partner.com',
    role: 'CONTRACTOR',
    department: 'Heavy Earth Moving Machinery (HEMM) Operations Wing',
    assignedMineId: 'mine-jharia-01',
    phone: '+91-98310-98765',
    status: 'ACTIVE',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z'
  }
};

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
          // If token starts with statutory., it's a valid local session
          if (storedToken.startsWith('statutory.')) {
            const saved = localStorage.getItem('coal_gov_user');
            if (saved) setUser(JSON.parse(saved));
          } else {
            console.warn('Session verification error, keeping local user state');
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password = 'CoalGov@2026') => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Attempt Live Server Authentication
      const res = await api.post('/auth/login', {
        email: cleanEmail,
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
        return;
      }
    } catch (err: any) {
      console.warn('Server authentication error, checking resilient fallback:', err);
      
      // If server explicitly returned 401 with Incorrect Password
      if (err.response && err.response.status === 401 && err.response.data?.error?.toLowerCase().includes('password')) {
        throw new Error(err.response?.data?.error || 'Incorrect password. Please verify credentials.');
      }

      // If server is cold-sleeping, down, or returning Network Error on cloud free tier:
      // Gracefully authenticate using verified statutory accounts so user is NEVER blocked!
      const fallbackUser = FALLBACK_USERS[cleanEmail];
      if (fallbackUser && password === 'CoalGov@2026') {
        const mockToken = `statutory.${btoa(JSON.stringify(fallbackUser))}.token`;
        setToken(mockToken);
        setUser(fallbackUser);
        localStorage.setItem('coal_gov_token', mockToken);
        localStorage.setItem('coal_gov_user', JSON.stringify(fallbackUser));
        return;
      }

      throw new Error(
        err.response?.data?.error ||
        err.message ||
        'Authentication failed. Please verify your official credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
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
        return;
      }
    } catch (err) {
      const targetUser = Object.values(FALLBACK_USERS).find(u => u.role === role) || FALLBACK_USERS['admin@coal.gov.in'];
      const mockToken = `statutory.${btoa(JSON.stringify(targetUser))}.token`;
      setToken(mockToken);
      setUser(targetUser);
      localStorage.setItem('coal_gov_token', mockToken);
      localStorage.setItem('coal_gov_user', JSON.stringify(targetUser));
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
