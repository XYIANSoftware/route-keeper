'use client';

import { ReactNode, createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Drive, Stop, SignupResult } from '@/types';
import { supabaseClient as supabase, TABLES } from '@/lib';

interface AppContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<SignupResult>;
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

  const loadCurrentDrive = useCallback(async () => {
    if (!user) return;

    const { data } = await supabase
      .from(TABLES.drives)
      .select('*')
      .eq('user_id', user.id)
      .is('end_time', null)
      .single();

    setCurrentDrive(data);
  }, [user]);

  const loadDrives = useCallback(async () => {
    if (!user) return;

    const { data } = await supabase
      .from(TABLES.drives)
      .select('*')
      .eq('user_id', user.id)
      .order('start_time', { ascending: false });

    setDrives(data || []);
  }, [user]);

  // Load current drive and drives when user changes
  useEffect(() => {
    if (user) {
      loadCurrentDrive();
      loadDrives();
    } else {
      setCurrentDrive(null);
      setDrives([]);
    }
  }, [user, loadCurrentDrive, loadDrives]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, username: string) => {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error(
        'Supabase configuration missing. Please check your environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY).'
      );
    }

    console.log('Starting signup process for:', email);

    // Create the user account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    if (error) {
      console.error('Signup error details:', error);
      console.error('Error code:', error.status);
      console.error('Error message:', error.message);

      // Handle rate limiting
      if (error.status === 429) {
        throw new Error('Too many signup attempts. Please wait a moment before trying again.');
      }

      // Handle user already exists
      if (error.message.includes('User already registered')) {
        throw new Error(
          'An account with this email already exists. Please try signing in instead.'
        );
      }

      // Provide more specific error messages
      if (
        error.message.includes('Database error') ||
        error.message.includes('relation') ||
        error.message.includes('does not exist') ||
        error.message.includes('table') ||
        error.message.includes('schema')
      ) {
        throw new Error(
          'Database setup required. Please run the SQL setup script in your Supabase dashboard. The profiles table or trigger function may not exist.'
        );
      }

      if (error.message.includes('Invalid API key') || error.status === 401) {
        throw new Error(
          'Invalid Supabase configuration. Please check your API keys in the environment variables.'
        );
      }

      if (error.message.includes('Email not confirmed')) {
        throw new Error('Please check your email to confirm your account before signing in.');
      }

      if (error.message.includes('JWT') || error.status === 403) {
        throw new Error('Authentication error. Please check your Supabase configuration.');
      }

      // Generic error with more details
      throw new Error(`Signup failed: ${error.message}`);
    }

    console.log('Signup response:', { user: data.user, session: data.session });

    // Check if email confirmation is required
    if (data.user && !data.session) {
      // Email confirmation is required - this is the expected flow
      console.log('Email confirmation required for user:', data.user.id);

      // Return success with confirmation message
      return {
        success: true,
        user: null, // User will be set after confirmation
        requiresConfirmation: true,
        message: `Account created successfully! We've sent a confirmation email to ${email}. Please check your email and click the confirmation link to complete your registration.`,
      };
    }

    // If we get here, signup was successful and user is automatically signed in
    console.log('Signup successful and user signed in automatically');
    return {
      success: true,
      user: null, // User will be set by auth state change
      requiresConfirmation: false,
      message: 'Account created and signed in successfully!',
    };
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
