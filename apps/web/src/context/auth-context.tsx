'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  username: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const DEFAULT_MOCK_USER: User = {
  id: 'user-admin',
  username: 'admin',
  name: 'Enterprise Architect',
  email: 'architect@codeatlas.ai',
  avatar_url: null,
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(DEFAULT_MOCK_USER);
  const [token, setToken] = React.useState<string | null>('stub_token');
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    async function loadSession() {
      const storedToken = localStorage.getItem('ca_token') || 'stub_token';
      setToken(storedToken);
      try {
        const res = await fetch('/api/v1/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          setUser(DEFAULT_MOCK_USER);
        }
      } catch (error) {
        setUser(DEFAULT_MOCK_USER);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, []);

  const login = async (newToken: string) => {
    localStorage.setItem('ca_token', newToken);
    setToken(newToken);
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/me', {
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        setUser(DEFAULT_MOCK_USER);
      }
    } catch (e) {
      setUser(DEFAULT_MOCK_USER);
    } finally {
      setLoading(false);
      router.push('/');
    }
  };

  const logout = () => {
    localStorage.removeItem('ca_token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
