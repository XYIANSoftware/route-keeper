'use client';

import { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { FormInput } from '@/components/inputs/FormInput';
import { FormPassword } from '@/components/inputs/FormPassword';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks';
import { testSupabaseConnection, testSignup, testDatabaseConnection } from '@/lib';
import Link from 'next/link';
import { LoadingImage } from '@/components';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
  const [isSignup, setIsSignup] = useState(mode === 'signup');
  const { signIn, signUp, loading } = useAuth();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onLoginSubmit = async (data: LoginForm) => {
    try {
      console.log('Attempting login with:', { email: data.email });
      await signIn(data.email, data.password);
      console.log('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      alert(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const onSignupSubmit = async (data: SignupForm) => {
    try {
      console.log('Attempting signup with:', { email: data.email, username: data.username });
      await signUp(data.email, data.password, data.username);
      console.log('Signup successful');
    } catch (error) {
      console.error('Signup error:', error);
      alert(`Signup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testConnection = async () => {
    try {
      const result = await testSupabaseConnection();
      alert(
        result
          ? 'Supabase connection successful!'
          : 'Supabase connection failed. Check console for details.'
      );
    } catch (error) {
      alert(`Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testSignupFunction = async () => {
    try {
      const testEmail = `test${Date.now()}@example.com`;
      const testPassword = 'testpassword123';

      console.log('Testing signup with:', { testEmail, testPassword });

      const result = await testSignup(testEmail, testPassword);

      if (result.success) {
        alert('Test signup successful! Check console for details.');
      } else {
        const errorMessage =
          result.error && typeof result.error === 'object' && 'message' in result.error
            ? result.error.message
            : 'Unknown error';
        alert(`Test signup failed: ${errorMessage}`);
      }
    } catch (error) {
      alert(`Test signup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testDatabase = async () => {
    try {
      const result = await testDatabaseConnection();

      if (result.success) {
        alert('Database connection successful! Check console for details.');
      } else {
        const errorMessage =
          result.error && typeof result.error === 'object' && 'message' in result.error
            ? result.error.message
            : 'Unknown error';
        alert(`Database connection failed: ${errorMessage}`);
      }
    } catch (error) {
      alert(`Database test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
            <LoadingImage
              src="/icon-1.png"
              alt="RouteKeeper"
              width={32}
              height={32}
              className="w-8 h-8"
              priority
            />
            <span className="text-2xl font-bold text-surface-900 dark:text-surface-0">
              RouteKeeper
            </span>
          </Link>
          <h1 className="text-xl font-semibold text-surface-900 dark:text-surface-0">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-surface-600 dark:text-surface-400">
            {isSignup ? 'Sign up to start tracking your drives' : 'Sign in to your account'}
          </p>
        </div>

        {isSignup ? (
          <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
            <FormInput
              label="Username"
              name="username"
              value={signupForm.watch('username') || ''}
              onChange={value => signupForm.setValue('username', value)}
              placeholder="Enter username"
              error={signupForm.formState.errors.username?.message}
              required
            />

            <FormInput
              label="Email"
              name="email"
              type="email"
              value={signupForm.watch('email') || ''}
              onChange={value => signupForm.setValue('email', value)}
              placeholder="Enter email"
              error={signupForm.formState.errors.email?.message}
              required
            />

            <FormPassword
              label="Password"
              name="password"
              value={signupForm.watch('password') || ''}
              onChange={value => signupForm.setValue('password', value)}
              placeholder="Enter password"
              error={signupForm.formState.errors.password?.message}
              required
            />

            <Button
              type="submit"
              label="Sign Up"
              icon="pi pi-user-plus"
              className="w-full p-button-primary"
              loading={loading}
            />

            <Button
              type="button"
              label="Test Connection"
              icon="pi pi-refresh"
              className="w-full p-button-secondary"
              onClick={testConnection}
            />

            <Button
              type="button"
              label="Test Signup"
              icon="pi pi-user-plus"
              className="w-full p-button-outlined"
              onClick={testSignupFunction}
            />

            <Button
              type="button"
              label="Test Database"
              icon="pi pi-database"
              className="w-full p-button-outlined"
              onClick={testDatabase}
            />
          </form>
        ) : (
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={loginForm.watch('email') || ''}
              onChange={value => loginForm.setValue('email', value)}
              placeholder="Enter email"
              error={loginForm.formState.errors.email?.message}
              required
            />

            <FormPassword
              label="Password"
              name="password"
              value={loginForm.watch('password') || ''}
              onChange={value => loginForm.setValue('password', value)}
              placeholder="Enter password"
              error={loginForm.formState.errors.password?.message}
              required
            />

            <Button
              type="submit"
              label="Sign In"
              icon="pi pi-sign-in"
              className="w-full p-button-primary"
              loading={loading}
            />
          </form>
        )}

        <div className="text-center mt-6">
          <Button
            type="button"
            label={isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            icon={isSignup ? 'pi pi-sign-in' : 'pi pi-user-plus'}
            className="p-button-text p-button-secondary"
            onClick={() => setIsSignup(!isSignup)}
          />
        </div>
      </Card>
    </div>
  );
}
