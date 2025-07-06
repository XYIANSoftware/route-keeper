'use client';

import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { User, Drive, Stop } from '@/types';
import { supabase, TABLES } from '@/lib/supabase-config';

interface AppContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  currentDrive: Drive | null;
  drives: Drive[];
  startDrive: () => Promise<void>;
  stopDrive: () => Promise<void>;
  addStop: (category: Stop['category'], notes?: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDrive, setCurrentDrive] = useState<Drive | null>(null);
  const [drives, setDrives] = useState<Drive[]>([]);

  // Initialize auth state
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from(TABLES.profiles)
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            username: profile.username,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load current drive and drives when user changes
  useEffect(() => {
    if (user) {
      loadCurrentDrive();
      loadDrives();
    } else {
      setCurrentDrive(null);
      setDrives([]);
    }
  }, [user]);

  const loadCurrentDrive = async () => {
    if (!user) return;

    const { data } = await supabase
      .from(TABLES.drives)
      .select('*')
      .eq('user_id', user.id)
      .is('end_time', null)
      .single();

    setCurrentDrive(data);
  };

  const loadDrives = async () => {
    if (!user) return;

    const { data } = await supabase
      .from(TABLES.drives)
      .select('*')
      .eq('user_id', user.id)
      .order('start_time', { ascending: false });

    setDrives(data || []);
  };

  const signIn = async (email: string, password: string) => {
    console.log('signIn called with:', { email });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log('signIn result:', { data, error });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, username: string) => {
    console.log('signUp called with:', { email, username });
    
    try {
      // First, try to sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      
      console.log('signUp result:', { data, error });
      
      if (error) {
        console.error('Signup error:', error);
        throw error;
      }
      
      // If signup is successful but user needs email confirmation
      if (data.user && !data.session) {
        console.log('User created but needs email confirmation');
        alert('Please check your email and confirm your account before signing in.');
        return;
      }
      
      // If we have a session, manually create the profile
      if (data.user && data.session) {
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              username: username,
              email: email,
            });
          
          if (profileError) {
            console.warn('Profile creation error (might already exist):', profileError);
          }
        } catch (profileError) {
          console.warn('Profile creation failed:', profileError);
        }
      }
      
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const startDrive = async () => {
    if (!user) return;

    // Get current GPS coordinates
    let latitude = null;
    let longitude = null;

    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true,
          });
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      } catch (error) {
        console.warn('Could not get GPS coordinates:', error);
      }
    }

    const { data, error } = await supabase
      .from(TABLES.drives)
      .insert({
        user_id: user.id,
        start_latitude: latitude,
        start_longitude: longitude,
      })
      .select()
      .single();

    if (error) throw error;
    setCurrentDrive(data);
    await loadDrives();
  };

  const stopDrive = async () => {
    if (!currentDrive) return;

    // Get current GPS coordinates
    let latitude = null;
    let longitude = null;

    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true,
          });
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      } catch (error) {
        console.warn('Could not get GPS coordinates:', error);
      }
    }

    const { error } = await supabase
      .from(TABLES.drives)
      .update({
        end_time: new Date().toISOString(),
        end_latitude: latitude,
        end_longitude: longitude,
      })
      .eq('id', currentDrive.id);

    if (error) throw error;
    setCurrentDrive(null);
    await loadDrives();
  };

  const addStop = async (category: Stop['category'], notes?: string) => {
    if (!currentDrive) return;

    // Get current GPS coordinates
    let latitude = null;
    let longitude = null;

    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true,
          });
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      } catch (error) {
        console.warn('Could not get GPS coordinates:', error);
      }
    }

    const { error } = await supabase.from(TABLES.stops).insert({
      drive_id: currentDrive.id,
      category,
      notes,
      latitude,
      longitude,
    });

    if (error) throw error;
  };

  const value: AppContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    currentDrive,
    drives,
    startDrive,
    stopDrive,
    addStop,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAuth() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AppContextProvider');
  }
  return {
    user: context.user,
    loading: context.loading,
    signIn: context.signIn,
    signUp: context.signUp,
    signOut: context.signOut,
  };
}

export function useDrive() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useDrive must be used within an AppContextProvider');
  }
  return {
    currentDrive: context.currentDrive,
    drives: context.drives,
    loading: context.loading,
    startDrive: context.startDrive,
    stopDrive: context.stopDrive,
    addStop: context.addStop,
  };
}
