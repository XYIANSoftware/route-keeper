'use client';

import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { supabase, TABLES } from '@/lib/supabase-config';

export function DatabaseStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    try {
      // Try to query the profiles table to see if it exists
      const { error } = await supabase.from(TABLES.profiles).select('count').limit(1);

      if (error) {
        setStatus('error');
        setError('Database schema not set up. Please run the SQL setup script.');
      } else {
        setStatus('connected');
      }
    } catch {
      setStatus('error');
      setError('Unable to connect to database.');
    }
  };

  if (status === 'checking') {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-2xl text-primary mb-2"></i>
          <p>Checking database connection...</p>
        </div>
      </Card>
    );
  }

  if (status === 'error') {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <div className="text-center">
          <i className="pi pi-exclamation-triangle text-2xl text-red-500 mb-2"></i>
          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-2">
            Database Setup Required
          </h3>
          <p className="text-surface-600 dark:text-surface-400 mb-4">{error}</p>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              <strong>To fix this:</strong>
              <br />
              1. Go to your Supabase dashboard
              <br />
              2. Open the SQL editor
              <br />
              3. Run the contents of <code>supasetup.sql</code>
            </p>
          </div>
          <Button
            label="Check Again"
            icon="pi pi-refresh"
            className="p-button-outlined"
            onClick={checkDatabaseStatus}
          />
        </div>
      </Card>
    );
  }

  return null;
}
