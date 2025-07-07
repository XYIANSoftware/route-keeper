'use client';

import { useAuth } from '@/hooks';
import { useEffect, useState } from 'react';

export function DebugAuth() {
  const { user, loading } = useAuth();
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { supabase } = await import('@/lib/supabase-config');
        const { data: { session }, error } = await supabase.auth.getSession();
        setSessionInfo({ session: !!session, user: session?.user?.email, error });
      } catch (err) {
        setSessionInfo({ error: err });
      }
    };
    
    checkSession();
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <div><strong>Auth Debug:</strong></div>
      <div>Loading: {loading ? 'true' : 'false'}</div>
      <div>User: {user ? `${user.username} (${user.email})` : 'null'}</div>
      <div>Session: {sessionInfo ? JSON.stringify(sessionInfo) : 'loading...'}</div>
    </div>
  );
} 