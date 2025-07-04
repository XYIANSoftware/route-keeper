'use client';

import { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { FormInput } from '@/components/inputs/FormInput';
import { FormPassword } from '@/components/inputs/FormPassword';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

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
      await signIn(data.email, data.password);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const onSignupSubmit = async (data: SignupForm) => {
    try {
      await signUp(data.email, data.password, data.username);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-50 via-surface-50 to-primary-100 dark:from-surface-900 dark:via-surface-800 dark:to-primary-900">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
            <i className="pi pi-truck text-primary text-3xl"></i>
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
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-primary hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </Card>
    </div>
  );
}
