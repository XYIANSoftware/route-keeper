'use client';

import { Button } from 'primereact/button';
import { useAuth } from '@/providers/app-context';
import Link from 'next/link';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-surface-0 border-b border-surface-200 dark:border-surface-700 shadow-sm">
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <i className="pi pi-truck text-primary text-2xl"></i>
          <span className="text-xl font-bold text-surface-900 dark:text-surface-0">
            RouteKeeper
          </span>
        </Link>

        <div className="flex items-center space-x-2">
          {user ? (
            <>
              <Link href={`/${user.username}/dashboard`}>
                <Button label="Dashboard" icon="pi pi-home" className="p-button-text" />
              </Link>
              <Button
                label="Sign Out"
                icon="pi pi-sign-out"
                className="p-button-outlined p-button-danger"
                onClick={signOut}
              />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button label="Login" icon="pi pi-sign-in" className="p-button-outlined" />
              </Link>
              <Link href="/login">
                <Button label="Sign Up" icon="pi pi-user-plus" className="p-button-primary" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
