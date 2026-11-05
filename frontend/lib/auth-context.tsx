'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '@/services/api';

export interface UserProfile {
  age?: number;
  gender?: string;
  state?: string;
  district?: string;
  occupation?: string;
  annual_income?: number;
  caste_category?: string;
  is_differently_abled?: boolean;
  land_holding_acres?: number;
  family_members_count?: number;
}

export interface User {
  id: number;
  email: string;
  full_name?: string;
  preferred_language: string;
  role: string;
  created_at: string;
  profile?: UserProfile;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session on load
  useEffect(() => {
    const savedToken = localStorage.getItem('jansathi_token');
    const savedUser = localStorage.getItem('jansathi_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Verify with /auth/me in background
        apiRequest<User>('/auth/me')
          .then((freshUser) => {
            setUser(freshUser);
            localStorage.setItem('jansathi_user', JSON.stringify(freshUser));
          })
          .catch(() => {
            // Keep local data or handle expired token gracefully
          })
          .finally(() => setIsLoading(false));
      } catch {
        localStorage.removeItem('jansathi_token');
        localStorage.removeItem('jansathi_user');
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await apiRequest<{ access_token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      setToken(res.access_token);
      setUser(res.user);
      localStorage.setItem('jansathi_token', res.access_token);
      localStorage.setItem('jansathi_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await apiRequest<{ access_token: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      setToken(res.access_token);
      setUser(res.user);
      localStorage.setItem('jansathi_token', res.access_token);
      localStorage.setItem('jansathi_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jansathi_token');
    localStorage.removeItem('jansathi_user');
  };

  const updateProfile = async (profileData: any) => {
    const updated = await apiRequest<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    setUser(updated);
    localStorage.setItem('jansathi_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
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
