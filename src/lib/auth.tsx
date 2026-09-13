import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { api, ApiError, type SessionUser } from './api';

interface AuthState {
  user: SessionUser | null;
  /** true until the first /api/auth/me check completes (only performed on /backoffice routes) */
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

function isBackofficePath(pathname: string): boolean {
  return pathname === '/backoffice' || pathname.startsWith('/backoffice/');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const inBackoffice = isBackofficePath(location.pathname);
  const checked = useRef(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(inBackoffice);

  const refresh = useCallback(async () => {
    try {
      const res = await api.get<{ user: SessionUser | null }>('/api/auth/me');
      setUser(res.user ?? null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Public pages never need a session, so the probe only runs the first time a back-office route is visited.
  useEffect(() => {
    if (!inBackoffice || checked.current) return;
    checked.current = true;
    setLoading(true);
    void refresh();
  }, [inBackoffice, refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<{ user: SessionUser }>('/api/auth/login', { email, password });
    checked.current = true;
    setUser(res.user);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout');
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(() => ({ user, loading, login, logout, refresh }), [user, loading, login, logout, refresh]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
