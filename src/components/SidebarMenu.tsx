'use client';

import { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { useAuth } from '@/lib/providers/app-context';
import Link from 'next/link';

export function SidebarMenu() {
  const [visible, setVisible] = useState(false);
  const { user } = useAuth();

  const menuItems = user
    ? [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          href: `/${user.username}/dashboard`,
        },
        {
          label: 'My Drives',
          icon: 'pi pi-list',
          href: `/${user.username}/drives`,
        },
        {
          label: 'Profile',
          icon: 'pi pi-user',
          href: `/${user.username}/profile`,
        },
      ]
    : [
        {
          label: 'Home',
          icon: 'pi pi-home',
          href: '/',
        },
        {
          label: 'Login',
          icon: 'pi pi-sign-in',
          href: '/login',
        },
      ];

  return (
    <>
      <Button
        icon="pi pi-bars"
        className="p-button-text p-button-rounded"
        onClick={() => setVisible(true)}
        aria-label="Menu"
      />

      <Sidebar visible={visible} position="left" onHide={() => setVisible(false)} className="w-64">
        <div className="flex flex-col h-full">
          <div className="flex items-center space-x-2 p-4 border-b border-surface-200 dark:border-surface-700">
            <i className="pi pi-truck text-primary text-xl"></i>
            <span className="text-lg font-bold text-surface-900 dark:text-surface-0">
              RouteKeeper
            </span>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center space-x-3 p-3 rounded-lg text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                    onClick={() => setVisible(false)}
                  >
                    <i className={`${item.icon} text-lg`}></i>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {user && (
            <div className="p-4 border-t border-surface-200 dark:border-surface-700">
              <div className="flex items-center space-x-3 mb-3">
                <i className="pi pi-user-circle text-2xl text-surface-600 dark:text-surface-400"></i>
                <div>
                  <p className="font-medium text-surface-900 dark:text-surface-0">
                    {user.username}
                  </p>
                  <p className="text-sm text-surface-600 dark:text-surface-400">{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Sidebar>
    </>
  );
}
