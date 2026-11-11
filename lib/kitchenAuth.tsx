/**
 * Kitchen Authentication Context
 * Simple password-based authentication without user accounts
 */

'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface KitchenAuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (password: string) => Promise<{ error: string | null }>;
  signOut: () => void;
}

const KitchenAuthContext = createContext<KitchenAuthContextType | undefined>(undefined);

const AUTH_KEY = 'kitchen_auth';

export function KitchenAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated from localStorage
    const authStatus = localStorage.getItem(AUTH_KEY);
    setIsAuthenticated(authStatus === 'true');
    setLoading(false);
  }, []);

  const signIn = async (password: string): Promise<{ error: string | null }> => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'kitchen', password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        localStorage.setItem(AUTH_KEY, 'true');
        setIsAuthenticated(true);
        return { error: null };
      }
      return { error: data.error || 'Invalid password' };
    } catch {
      return { error: 'Could not reach the server' };
    }
  };

  const signOut = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  return (
    <KitchenAuthContext.Provider value={{ isAuthenticated, loading, signIn, signOut }}>
      {children}
    </KitchenAuthContext.Provider>
  );
}

export function useKitchenAuth() {
  const context = useContext(KitchenAuthContext);
  if (context === undefined) {
    throw new Error('useKitchenAuth must be used within KitchenAuthProvider');
  }
  return context;
}
