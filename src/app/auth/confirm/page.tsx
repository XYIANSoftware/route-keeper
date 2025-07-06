'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { supabaseClient as supabase } from '@/lib';
import { LoadingImage } from '@/components';
import Link from 'next/link';

function ConfirmEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get all possible URL parameters
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        const access_token = searchParams.get('access_token');
        const refresh_token = searchParams.get('refresh_token');
        const token = searchParams.get('token');

        console.log('URL Parameters:', {
          token_hash,
          type,
          access_token: access_token ? 'present' : 'missing',
          refresh_token: refresh_token ? 'present' : 'missing',
          token: token ? 'present' : 'missing',
        });

        // Method 1: PKCE Flow (token_hash + type)
        if (type === 'signup' && token_hash) {
          console.log('Processing PKCE email confirmation...');

          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'signup',
          });

          if (error) {
            console.error('PKCE confirmation error:', error);

            if (error.message.includes('expired')) {
              setStatus('expired');
              setMessage('Your confirmation link has expired. Please request a new one.');
            } else if (error.message.includes('invalid')) {
              setStatus('error');
              setMessage('Invalid confirmation link. Please try signing up again.');
            } else {
              setStatus('error');
              setMessage(`Confirmation failed: ${error.message}`);
            }
            return;
          }

          if (data.user) {
            console.log('Email confirmed successfully for user:', data.user.id);
            setStatus('success');
            setMessage('Your email has been confirmed successfully! You can now sign in.');

            // Redirect to login after a short delay
            setTimeout(() => {
              router.push('/login?confirmed=true');
            }, 3000);
          } else {
            setStatus('error');
            setMessage('Confirmation failed. Please try again.');
          }
          return;
        }

        // Method 2: JWT Flow (access_token + refresh_token)
        if (access_token && refresh_token) {
          console.log('Processing JWT email confirmation...');

          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) {
            console.error('JWT confirmation error:', error);
            setStatus('error');
            setMessage(`Confirmation failed: ${error.message}`);
            return;
          }

          if (data.user) {
            console.log('Email confirmed successfully for user:', data.user.id);
            setStatus('success');
            setMessage('Your email has been confirmed successfully! You can now sign in.');

            // Redirect to login after a short delay
            setTimeout(() => {
              router.push('/login?confirmed=true');
            }, 3000);
          } else {
            setStatus('error');
            setMessage('Confirmation failed. Please try again.');
          }
          return;
        }

        // Method 3: Legacy token format
        if (type === 'signup' && token) {
          console.log('Processing legacy token confirmation...');

          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token, // Try using token as token_hash
            type: 'signup',
          });

          if (error) {
            console.error('Legacy confirmation error:', error);
            setStatus('error');
            setMessage(`Confirmation failed: ${error.message}`);
            return;
          }

          if (data.user) {
            console.log('Email confirmed successfully for user:', data.user.id);
            setStatus('success');
            setMessage('Your email has been confirmed successfully! You can now sign in.');

            // Redirect to login after a short delay
            setTimeout(() => {
              router.push('/login?confirmed=true');
            }, 3000);
          } else {
            setStatus('error');
            setMessage('Confirmation failed. Please try again.');
          }
          return;
        }

        // No valid confirmation parameters found
        console.log('No valid confirmation parameters found');
        setStatus('error');
        setMessage('Invalid confirmation link. Please check your email for the correct link.');
      } catch (error) {
        console.error('Confirmation error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    handleEmailConfirmation();
  }, [searchParams, router]);

  const handleResendConfirmation = async () => {
    router.push('/auth/resend');
  };

  return (
    <div className="min-h-screen flex align-items-center justify-content-center p-4">
      <Card className="w-full max-w-md text-center">
        <div className="mb-6">
          <Link href="/" className="flex align-items-center justify-content-center mb-4">
            <LoadingImage
              src="/icon-1.png"
              alt="RouteKeeper"
              width={50}
              height={50}
              className="w-12 h-12 mr-3"
              priority
            />
            <span className="text-2xl font-bold text-surface-900 dark:text-surface-0">
              RouteKeeper
            </span>
          </Link>
          <h1 className="text-xl font-semibold text-surface-900 dark:text-surface-0 m-0">
            Email Confirmation
          </h1>
        </div>

        {status === 'loading' && (
          <div className="flex flex-column align-items-center gap-4">
            <ProgressSpinner style={{ width: '50px', height: '50px' }} />
            <p className="text-surface-600 dark:text-surface-400 m-0">
              Confirming your email address...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-column align-items-center gap-4">
            <i className="pi pi-check-circle text-green-500 text-4xl"></i>
            <Message severity="success" text={message} className="w-full" />
            <p className="text-surface-600 dark:text-surface-400 text-sm m-0">
              Redirecting to login page...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-column align-items-center gap-4">
            <i className="pi pi-exclamation-triangle text-red-500 text-4xl"></i>
            <Message severity="error" text={message} className="w-full" />
            <div className="flex flex-column gap-2 w-full">
              <Button
                label="Go to Login"
                icon="pi pi-sign-in"
                className="p-button-primary"
                onClick={() => router.push('/login')}
              />
              <Button
                label="Try Signing Up Again"
                icon="pi pi-user-plus"
                className="p-button-outlined"
                onClick={() => router.push('/signup')}
              />
            </div>
          </div>
        )}

        {status === 'expired' && (
          <div className="flex flex-column align-items-center gap-4">
            <i className="pi pi-clock text-orange-500 text-4xl"></i>
            <Message severity="warn" text={message} className="w-full" />
            <div className="flex flex-column gap-2 w-full">
              <Button
                label="Request New Confirmation"
                icon="pi pi-send"
                className="p-button-primary"
                onClick={handleResendConfirmation}
              />
              <Button
                label="Go to Login"
                icon="pi pi-sign-in"
                className="p-button-outlined"
                onClick={() => router.push('/login')}
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmEmailForm />
    </Suspense>
  );
}
