import React, { useEffect, useState } from 'react';
import { authApi } from '../api/client';
import { AuthContext } from './auth-context';
import type { Session, User } from '../types/pulse';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSession = async () => {
    try {
      setIsLoading(true);
      const res = await authApi.getSession();
      if (res) {
        if ('user' in res && res.user) {
          setUser(res.user);
          setSession((res as any).session || null);
        } else if ('id' in res && 'email' in res) {
          setUser(res as User);
          setSession(null);
        } else {
          setUser(null);
          setSession(null);
        }
      } else {
        setUser(null);
        setSession(null);
      }
    } catch {
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    const res = await authApi.signIn({ email, password });
    if (res) {
      if ('user' in res && res.user) {
        setUser(res.user);
        setSession((res as any).session || null);
      } else if ('id' in res && 'email' in res) {
        setUser(res as User);
      }
    }
    await refreshSession();
  };

  const signUp = async (name: string, email: string, password: string) => {
    const res = await authApi.signUp({ name, email, password });
    if (res) {
      if ('user' in res && res.user) {
        setUser(res.user);
        setSession((res as any).session || null);
      } else if ('id' in res && 'email' in res) {
        setUser(res as User);
      }
    }
    await refreshSession();
  };

  const signOut = async () => {
    try {
      await authApi.signOut();
    } finally {
      setUser(null);
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
