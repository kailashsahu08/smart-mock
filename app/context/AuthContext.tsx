"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";

/* ─── Storage keys ───────────────────────────────────── */
const AUTH_TOKEN_KEY = "sm_auth_token";
const AUTH_USER_KEY = "sm_auth_user";

/* ─── Types matching IUser model ─────────────────────── */
export interface AuthUser {
  id: string;          // MongoDB _id (stringified)
  name: string;
  email: string;
  role: "admin" | "student";
  avatar?: string;
  bio?: string;
  age?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  /** Current signed-in user (null if unauthenticated) */
  user: AuthUser | null;
  /** JWT access token */
  token: string | null;
  /** True once the localStorage check has finished */
  isLoading: boolean;
  /** Convenience flag */
  isAuthenticated: boolean;
  /**
   * Persist token + user to localStorage and hydrate state.
   * Call this from your login / register success handlers.
   */
  login: (token: string, userData: AuthUser) => void;
  /** Clear everything from localStorage and reset state */
  logout: () => void;
  /** Update stored user without a full login round-trip */
  updateUser: (userData: Partial<AuthUser>) => void;
  /** Quick role check helper */
  hasRole: (role: "admin" | "student") => boolean;
}

/* ─── Context ────────────────────────────────────────── */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ─── Provider ───────────────────────────────────────── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* Rehydrate from localStorage on first mount (client-only) */
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      const storedUserJSON = localStorage.getItem(AUTH_USER_KEY);

      if (storedToken && storedUserJSON) {
        const parsedUser: AuthUser = JSON.parse(storedUserJSON);
        setToken(storedToken);
        setUser(parsedUser);
      }
    } catch (err) {
      console.error("[AuthContext] Failed to rehydrate from localStorage:", err);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* login — call after a successful /api/auth/login or /api/auth/register */
  const login = (newToken: string, userData: AuthUser) => {
    localStorage.setItem(AUTH_TOKEN_KEY, newToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    setIsLoading(false);
  };

  /* logout — wipe everything */
  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setToken(null);
    setUser(null);
  };

  /* updateUser — partial update without re-login */
  const updateUser = (updatedFields: Partial<AuthUser>) => {
    if (!user) return;
    const merged = { ...user, ...updatedFields };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(merged));
    setUser(merged);
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: !!user && !!token,
      login,
      logout,
      updateUser,
      hasRole: (role) => user?.role === role,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ─── Hook ───────────────────────────────────────────── */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return context;
}
