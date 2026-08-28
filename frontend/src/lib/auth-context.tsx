'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo users for the prototype
const DEMO_USERS: Record<string, { password: string; user: AuthUser }> = {
  'admin@fiduscan.io': {
    password: 'admin123',
    user: {
      id: 'usr_admin_001',
      name: 'System Administrator',
      email: 'admin@fiduscan.io',
      role: 'admin',
    },
  },
  'investigator@fiduscan.io': {
    password: 'user123',
    user: {
      id: 'usr_inv_001',
      name: 'Lead Investigator',
      email: 'investigator@fiduscan.io',
      role: 'user',
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('fiduscan_user');
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(stored));
      }
    } catch {
      /* ignore */
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    // Simulate network latency
    await new Promise(r => setTimeout(r, 900));

    const match = DEMO_USERS[email.toLowerCase()];
    if (!match || match.password !== password) {
      setIsLoading(false);
      throw new Error('Invalid credentials. Please try again.');
    }
    if (match.user.role !== role) {
      setIsLoading(false);
      throw new Error(`This account does not have ${role} privileges.`);
    }

    localStorage.setItem('fiduscan_user', JSON.stringify(match.user));
    setUser(match.user);
    setIsLoading(false);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('fiduscan_user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
