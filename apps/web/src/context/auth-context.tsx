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

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    async function loadSession() {
      const storedToken = localStorage.getItem('ca_token');
      if (storedToken) {
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
            localStorage.removeItem('ca_token');
          }
        } catch (error) {
          console.error('Failed to verify authentication session:', error);
        }
      }
      setLoading(false);
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
        router.push('/');
      } else {
        logout();
      }
    } catch (e) {
      console.error(e);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ca_token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
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
