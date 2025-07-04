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
          <i className="pi pi-truck header-logo-icon"></i>
          <span className="header-logo-text">RouteKeeper</span>
        </Link>

        <nav className="header-nav">
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
        </nav>
      </div>
    </header>
  );
}
