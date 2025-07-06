'use client';

import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useAuth } from '@/providers/app-context';
import Link from 'next/link';
import { LoadingImage } from '@/components/common/LoadingImage';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.mobile-menu')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="mobile-menu md:hidden">
      {/* Hamburger Button */}
      <Button
        icon={isOpen ? 'pi pi-times' : 'pi pi-bars'}
        className="p-button-text p-button-rounded"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      />

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-surface-0 dark:bg-surface-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
            <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
              <LoadingImage
                src="/icon-1.png"
                alt="RouteKeeper"
                width={32}
                height={32}
                className="w-8 h-8"
                priority
              />
              <span className="text-lg font-bold text-surface-900 dark:text-surface-0">
                RouteKeeper
              </span>
            </Link>
            <Button
              icon="pi pi-times"
              className="p-button-text p-button-rounded"
              onClick={toggleMenu}
              aria-label="Close menu"
            />
          </div>

          {/* Menu Items */}
          <div className="flex-1 p-4 space-y-2">
            {user ? (
              <>
                <Link href={`/${user.username}/dashboard`} onClick={() => setIsOpen(false)}>
                  <Button
                    label="Dashboard"
                    icon="pi pi-home"
                    className="w-full p-button-text justify-start"
                  />
                </Link>
                <Button
                  label="Sign Out"
                  icon="pi pi-sign-out"
                  className="w-full p-button-text p-button-danger justify-start"
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                />
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button
                    label="Login"
                    icon="pi pi-sign-in"
                    className="w-full p-button-outlined justify-start"
                  />
                </Link>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button
                    label="Sign Up"
                    icon="pi pi-user-plus"
                    className="w-full p-button-primary justify-start"
                  />
                </Link>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-surface-200 dark:border-surface-700">
            <p className="text-sm text-surface-600 dark:text-surface-400 text-center">
              v{process.env.NEXT_PUBLIC_APP_VERSION || '1.2.1'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
