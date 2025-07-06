'use client';

import { useState, Suspense } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { supabaseClient as supabase } from '@/lib';
import { LoadingImage } from '@/components';
import Link from 'next/link';

function ResendConfirmationForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage('');
    setMessageType(null);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (error) {
        console.error('Resend error:', error);
        setMessage(`Failed to resend confirmation email: ${error.message}`);
        setMessageType('error');
      } else {
        setMessage(`Confirmation email sent to ${email}. Please check your inbox and spam folder.`);
        setMessageType('success');
      }
    } catch (error) {
      console.error('Resend error:', error);
      setMessage('An unexpected error occurred. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex align-items-center justify-content-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
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
            Resend Confirmation Email
          </h1>
          <p className="text-surface-600 dark:text-surface-400 m-0">
            Enter your email address to receive a new confirmation link
          </p>
        </div>

        {message && <Message severity={messageType || 'info'} text={message} className="mb-4" />}

        <form onSubmit={handleResend} className="flex flex-column gap-4">
          <div className="flex flex-column gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-surface-700 dark:text-surface-300"
            >
              Email Address
            </label>
            <InputText
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full"
              required
            />
          </div>

          <Button
            type="submit"
            label="Resend Confirmation Email"
            icon="pi pi-send"
            className="w-full p-button-primary"
            loading={loading}
          />
        </form>

        <div className="text-center mt-6 flex flex-column gap-2">
          <Link href="/login" className="text-blue-600 hover:text-blue-800 transition-colors">
            Back to Login
          </Link>
          <Link href="/signup" className="text-blue-600 hover:text-blue-800 transition-colors">
            Create New Account
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function ResendConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResendConfirmationForm />
    </Suspense>
  );
}
