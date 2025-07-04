'use client';

import { Button } from 'primereact/button';
import { useAuth } from '@/providers/app-context';
import Link from 'next/link';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <Link href="/" className="header-logo">
          <img
            src="/icon-1.png"
            alt="RouteKeeper Logo"
            className="header-logo-icon"
            style={{ width: 32, height: 32, objectFit: 'contain' }}
          />
          <span className="header-logo-text">RouteKeeper</span>
        </Link>

        <nav className="header-nav">
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
        </nav>
      </div>
    </header>
  );
}
