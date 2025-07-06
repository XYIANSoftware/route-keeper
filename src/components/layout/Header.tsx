'use client';

import { Button } from 'primereact/button';
import { useAuth } from '@/providers/app-context';
import Link from 'next/link';
import { LoadingImage } from '@/components/common/LoadingImage';
import { MobileMenu } from './MobileMenu';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-surface-0/95 dark:bg-surface-900/95 border-b border-surface-200 dark:border-surface-700 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <LoadingImage
            src="/icon-1.png"
            alt="RouteKeeper"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="text-lg md:text-xl font-bold text-surface-900 dark:text-surface-0">
            RouteKeeper
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-2">
          {user ? (
            <>
              <Link href={`/${user.username}/dashboard`}>
                <Button label="Dashboard" icon="pi pi-home" text />
              </Link>
              <Button
                label="Sign Out"
                icon="pi pi-sign-out"
                outlined
                severity="danger"
                onClick={signOut}
              />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button label="Login" icon="pi pi-sign-in" outlined />
              </Link>
              <Link href="/login">
                <Button label="Sign Up" icon="pi pi-user-plus" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <MobileMenu />
      </div>
    </header>
  );
}
