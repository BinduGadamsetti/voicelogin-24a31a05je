"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  voicePrint: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  register: (id: string, voicePrint: string) => boolean;
  login: (voicePrint: string) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'voicekey_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const storedAuthState = localStorage.getItem(`${USER_STORAGE_KEY}_auth`);
      if (storedUser && storedAuthState) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(JSON.parse(storedAuthState));
      }
    } catch (error) {
      console.error("Failed to load user from local storage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = (id: string, voicePrint: string): boolean => {
    // In a real app, you'd check for username availability on the server.
    // Here we'll just assume it's a new user for simplicity.
    const newUser: User = { id, voicePrint };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    localStorage.setItem(`${USER_STORAGE_KEY}_auth`, JSON.stringify(false)); // Not authenticated yet
    return true;
  };

  const login = (voicePrint: string): boolean => {
    // This is a mock authentication. In a real app, you'd send the voicePrint
    // to a server for comparison against the stored one.
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        // Simple mock: succeed if any user is registered.
        setUser(parsedUser);
        setIsAuthenticated(true);
        localStorage.setItem(`${USER_STORAGE_KEY}_auth`, JSON.stringify(true));
        return true;
      }
    } catch (error) {
      console.error("Login failed", error);
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Do not clear the user registration, just the auth state
    localStorage.setItem(`${USER_STORAGE_KEY}_auth`, JSON.stringify(false));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
