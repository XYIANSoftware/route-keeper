'use client';

import { useState } from 'react';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoadingImage } from '@/components/common/LoadingImage';

export function Header() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navigationItems = [
    { label: 'Dashboard', href: user ? `/${user.username}/dashboard` : '/', icon: 'pi pi-home' },
    { label: 'Drives', href: user ? `/${user.username}/drives` : '/', icon: 'pi pi-car' },
    {
      label: 'Analytics',
      href: user ? `/${user.username}/analytics` : '/',
      icon: 'pi pi-chart-bar',
    },
    { label: 'Settings', href: user ? `/${user.username}/settings` : '/', icon: 'pi pi-cog' },
  ];

  const mobileMenuItems = [
    ...navigationItems,
    { label: 'Profile', href: user ? `/${user.username}/profile` : '/', icon: 'pi pi-user' },
    { label: 'Help', href: '/help', icon: 'pi pi-question-circle' },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden bg-gradient-to-r from-amber-900 to-amber-800 text-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center space-x-3">
            <LoadingImage
              src="/icon-1.png"
              alt="RouteKeeper"
              width={75}
              height={75}
              className="w-12 h-12 rounded-lg shadow-md"
              priority
            />
            <span className="text-xl font-bold">RouteKeeper</span>
          </Link>

          <div className="flex items-center space-x-2">
            {user ? (
              <Button
                icon="pi pi-user"
                className="p-button-text p-button-rounded"
                onClick={() => router.push(`/${user.username}/dashboard`)}
              />
            ) : (
              <Button
                label="Sign In"
                icon="pi pi-sign-in"
                className="p-button-outlined p-button-sm"
                onClick={() => router.push('/login')}
              />
            )}
            <Button
              icon="pi pi-bars"
              className="p-button-text p-button-rounded"
              onClick={() => setSidebarVisible(true)}
            />
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block bg-gradient-to-r from-amber-900 to-amber-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-4">
              <LoadingImage
                src="/icon-1.png"
                alt="RouteKeeper"
                width={75}
                height={75}
                className="w-16 h-16 rounded-lg shadow-md"
                priority
              />
              <div>
                <h1 className="text-2xl font-bold">RouteKeeper</h1>
                <p className="text-amber-200 text-sm">Professional Route Tracking</p>
              </div>
            </Link>

            <nav className="flex items-center space-x-6">
              {navigationItems.map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200"
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-amber-200">Driver</p>
                    </div>
                    <Button
                      icon="pi pi-sign-out"
                      label="Sign Out"
                      className="p-button-outlined p-button-sm"
                      onClick={handleSignOut}
                      loading={loading}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    label="Sign In"
                    icon="pi pi-sign-in"
                    className="p-button-outlined"
                    onClick={() => router.push('/login')}
                  />
                  <Button
                    label="Sign Up"
                    icon="pi pi-user-plus"
                    className="p-button-primary"
                    onClick={() => router.push('/signup')}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <Sidebar
        visible={sidebarVisible}
        position="right"
        onHide={() => setSidebarVisible(false)}
        className="w-80 bg-gradient-to-b from-amber-900 to-amber-800 text-white"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Menu</h2>
            <Button
              icon="pi pi-times"
              className="p-button-text p-button-rounded"
              onClick={() => setSidebarVisible(false)}
            />
          </div>

          <nav className="space-y-2">
            {mobileMenuItems.map(item => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-amber-700 transition-colors duration-200"
                onClick={() => setSidebarVisible(false)}
              >
                <i className={`${item.icon} text-lg`}></i>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {user && (
            <div className="mt-8 pt-6 border-t border-amber-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                  <i className="pi pi-user text-white"></i>
                </div>
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-amber-200">Driver</p>
                </div>
              </div>
              <Button
                label="Sign Out"
                icon="pi pi-sign-out"
                className="w-full p-button-outlined"
                onClick={() => {
                  handleSignOut();
                  setSidebarVisible(false);
                }}
                loading={loading}
              />
            </div>
          )}
        </div>
      </Sidebar>
    </>
  );
}
