import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './ToastContext';

export interface UserProfile {
  name: string;
  email: string;
  title: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  skills: string[];
}

interface UserContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  logout: () => void;
  isLoggedIn: boolean;
  login: () => void;
}

const defaultProfile: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex@example.com',
  title: 'Senior Full Stack Engineer',
  location: 'San Francisco, CA',
  linkedin: 'https://linkedin.com/in/alexj',
  github: 'https://github.com/alexj',
  summary: 'Senior Full Stack Engineer with 8+ years of experience building scalable distributed systems and AI-powered web applications. Proven track record of leading high-performance teams and architecting cloud-native solutions.',
  skills: ['TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'GraphQL', 'Next.js']
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('is_logged_in') !== 'false'; // Default to true for demo purposes
  });
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('user_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('is_logged_in', String(isLoggedIn));
  }, [isLoggedIn]);

  const updateProfile = (updates: Partial<UserProfile>, showToast = true) => {
    setProfile(prev => ({ ...prev, ...updates }));
    if (showToast) {
      toast('Profile updated successfully', 'success');
    }
  };

  const logout = () => {
    localStorage.removeItem('user_profile');
    localStorage.removeItem('is_logged_in');
    setProfile(defaultProfile);
    setIsLoggedIn(false);
    toast('Logged out successfully', 'success');
  };

  const login = () => {
    setIsLoggedIn(true);
    toast('Logged in successfully', 'success');
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile, logout, isLoggedIn, login }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
