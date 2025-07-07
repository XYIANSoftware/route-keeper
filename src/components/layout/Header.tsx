'use client';

import { useState } from 'react';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { Image } from 'primereact/image';
import { useAuth } from '@/hooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
    // { label: 'Drives', href: user ? `/${user.username}/drives` : '/', icon: 'pi pi-car' },
    // {
    //   label: 'Analytics',
    //   href: user ? `/${user.username}/analytics` : '/',
    //   icon: 'pi pi-chart-bar',
    // },
    // { label: 'Settings', href: user ? `/${user.username}/settings` : '/', icon: 'pi pi-cog' },
  ];

  const mobileMenuItems = [
    ...navigationItems,
    // { label: 'Profile', href: user ? `/${user.username}/profile` : '/', icon: 'pi pi-user' },
    // { label: 'Help', href: '/help', icon: 'pi pi-question-circle' },
  ];

  return (
    <>
      {/* Mobile Header - Fixed at top */}
      <header className="fixed top-0 left-0 right-0 z-50 lg:hidden bg-gradient-to-r from-amber-900 to-amber-800 text-white shadow-lg">
        <div className="flex align-items-center justify-content-between px-4 py-3">
          <div className="flex align-items-center">
            <Image
              src="/icon-1.png"
              alt="RouteKeeper"
              width="50"
              height="50"
              className="w-12 h-12 mr-3"
            />
            <span className="text-xl font-bold">RouteKeeper</span>
          </div>

          <div className="flex align-items-center gap-2">
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

      {/* Desktop Header - Fixed at top */}
      <header className="fixed top-0 left-0 right-0 z-50 hidden lg:block bg-gradient-to-r from-amber-900 to-amber-800 text-white shadow-lg">
        <div className="flex align-items-center justify-content-between px-6 py-4 max-w-screen-xl mx-auto">
          <div className="flex align-items-center">
            <Image
              src="/icon-1.png"
              alt="RouteKeeper"
              width="50"
              height="50"
              className="w-12 h-12 mr-4"
            />
            <div className="flex flex-column">
              <h1 className="text-2xl font-bold m-0">RouteKeeper</h1>
              <p className="text-amber-200 text-sm m-0">Professional Route Tracking</p>
            </div>
          </div>

          <nav className="flex align-items-center gap-4">
            {navigationItems.map(item => (
              <Link key={item.label} href={item.href}>
                <Button label={item.label} icon={item.icon} className="p-button-text text-white" />
              </Link>
            ))}
          </nav>

          <div className="flex align-items-center gap-3">
            {user ? (
              <div className="flex align-items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium m-0">{user.username}</p>
                  <p className="text-xs text-amber-200 m-0">Driver</p>
                </div>
                <Button
                  icon="pi pi-sign-out"
                  label="Sign Out"
                  className="p-button-outlined p-button-sm"
                  onClick={handleSignOut}
                  loading={loading}
                />
              </div>
            ) : (
              <div className="flex align-items-center gap-3">
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
      </header>

      {/* Mobile Sidebar */}
      <Sidebar
        visible={sidebarVisible}
        position="right"
        onHide={() => setSidebarVisible(false)}
        className="w-20rem bg-gradient-to-b from-amber-900 to-amber-800 text-white"
      >
        <div className="p-4">
          <div className="flex align-items-center justify-content-between mb-6">
            <h2 className="text-xl font-bold m-0">Menu</h2>
            <Button
              icon="pi pi-times"
              className="p-button-text p-button-rounded"
              onClick={() => setSidebarVisible(false)}
            />
          </div>

          <nav className="flex flex-column gap-2">
            {mobileMenuItems.map(item => (
              <Link key={item.label} href={item.href}>
                <Button
                  label={item.label}
                  icon={item.icon}
                  className="p-button-text text-white w-full justify-content-start"
                  onClick={() => setSidebarVisible(false)}
                />
              </Link>
            ))}
          </nav>

          {user && (
            <div className="mt-6 pt-4 border-top-1 border-amber-700">
              <div className="flex align-items-center gap-3 mb-4">
                <div className="w-3rem h-3rem bg-amber-600 border-circle flex align-items-center justify-content-center">
                  <i className="pi pi-user text-white"></i>
                </div>
                <div>
                  <p className="font-medium m-0">{user.username}</p>
                  <p className="text-sm text-amber-200 m-0">Driver</p>
                </div>
              </div>
              <Button
                label="Sign Out"
                icon="pi pi-sign-out"
                className="p-button-outlined w-full"
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
