'use client';

import { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { LoadingImage } from '@/components/common/LoadingImage';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', { email });
      await signIn(email, password);
      console.log('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      alert(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen flex align-items-center justify-content-center p-4">
      <Card className="w-full max-w-md shadow-4">
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
            <span className="text-2xl font-bold text-gray-800">RouteKeeper</span>
          </Link>
          <h1 className="text-xl font-semibold text-gray-800 m-0">Welcome Back</h1>
          <p className="text-gray-600 m-0">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-column gap-4">
          <div className="flex flex-column gap-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
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

          <div className="flex flex-column gap-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <Password
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full"
              required
              feedback={false}
              toggleMask
            />
          </div>

          <Button
            type="submit"
            label="Sign In"
            icon="pi pi-sign-in"
            className="w-full p-button-primary"
            loading={loading}
          />
        </form>

        <div className="text-center mt-6">
          <Link href="/signup" className="text-blue-600 hover:text-blue-800 transition-colors">
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}
