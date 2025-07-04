'use client';

import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { User, Drive, Stop, DriveWithStops, AuthContextType, DriveContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const DriveContext = createContext<DriveContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDrive, setCurrentDrive] = useState<Drive | null>(null);
  const [drives, setDrives] = useState<DriveWithStops[]>([]);

  // Auth methods (to be connected to Supabase)
  const signIn = async (email: string, password: string) => {
    // TODO: Implement Supabase auth
    console.log('Sign in:', email, password);
  };

  const signUp = async (email: string, password: string, username: string) => {
    // TODO: Implement Supabase auth
    console.log('Sign up:', email, password, username);
  };

  const signOut = async () => {
    // TODO: Implement Supabase auth
    setUser(null);
    setCurrentDrive(null);
    setDrives([]);
  };

  // Drive methods (to be connected to Supabase)
  const startDrive = async () => {
    // TODO: Implement GPS and Supabase
    console.log('Start drive');
  };

  const stopDrive = async () => {
    // TODO: Implement GPS and Supabase
    console.log('Stop drive');
  };

  const addStop = async (category: Stop['category'], notes?: string) => {
    // TODO: Implement Supabase
    console.log('Add stop:', category, notes);
  };

  const loadDrives = async () => {
    // TODO: Implement Supabase
    console.log('Load drives');
  };

  useEffect(() => {
    // TODO: Check for existing session
    setLoading(false);
  }, []);

  const authValue: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  const driveValue: DriveContextType = {
    currentDrive,
    drives,
    loading,
    startDrive,
    stopDrive,
    addStop,
    loadDrives,
  };

  return (
    <AuthContext.Provider value={authValue}>
      <DriveContext.Provider value={driveValue}>{children}</DriveContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AppContextProvider');
  }
  return context;
}

export function useDrive() {
  const context = useContext(DriveContext);
  if (context === undefined) {
    throw new Error('useDrive must be used within an AppContextProvider');
  }
  return context;
}
