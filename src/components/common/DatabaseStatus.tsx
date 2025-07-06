'use client';

import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { supabase } from '@/lib/supabase-config';

export function DatabaseStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    try {
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setStatus('error');
        setError(
          'Supabase configuration missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
        );
        return;
      }

      console.log('Checking database connection...');
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log(
        'Supabase Key (first 20 chars):',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...'
      );

      // First, test basic connection
      const { data: testData, error: testError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      console.log('Test query result:', { testData, testError });

      if (testError) {
        console.error('Database check error:', testError);
        setStatus('error');

        if (
          testError.message.includes('relation') ||
          testError.message.includes('does not exist')
        ) {
          setError(
            'Database schema not set up. Please run the SQL setup script in your Supabase dashboard. The profiles table does not exist.'
          );
        } else if (testError.message.includes('Invalid API key')) {
          setError('Invalid Supabase configuration. Please check your API keys.');
        } else if (testError.message.includes('JWT')) {
          setError('Authentication error. Please check your Supabase configuration.');
        } else {
          setError(`Database connection error: ${testError.message}`);
        }
      } else {
        console.log('Database connection successful!');
        setStatus('connected');
      }
    } catch (error) {
      console.error('Database check exception:', error);
      setStatus('error');
      setError('Unable to connect to database. Please check your Supabase configuration.');
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
