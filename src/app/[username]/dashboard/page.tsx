'use client';

import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DriveCard, StopForm, DriveList, SidebarMenu, LoadingSpinner } from '@/components';
import { useAuth, useDrive } from '@/hooks';
import { useParams } from 'next/navigation';

export default function DashboardPage() {
  const { username } = useParams<{ username: string }>();
  const { user, loading: authLoading } = useAuth();
  const { currentDrive, loading: driveLoading } = useDrive();
  const [stopFormVisible, setStopFormVisible] = useState(false);

  // Redirect if user doesn't match URL or not authenticated
  useEffect(() => {
    if (!authLoading && (!user || user.username !== username)) {
      // TODO: Redirect to login or show error
      console.log('User mismatch or not authenticated');
    }
  }, [user, username, authLoading]);

  if (authLoading || driveLoading) {
    return <LoadingSpinner size="large" text="Loading..." className="min-h-screen" />;
  }

  if (!user || user.username !== username) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <div className="text-center">
            <i className="pi pi-exclamation-triangle text-4xl text-orange-500 mb-4"></i>
            <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-0 mb-2">
              Access Denied
            </h2>
            <p className="text-surface-600 dark:text-surface-400 mb-4">
              You don&apos;t have permission to access this dashboard.
            </p>
            <Button label="Go Home" icon="pi pi-home" className="p-button-primary" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <div className="max-w-7xl mx-auto p-4">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-0">Dashboard</h1>
          <SidebarMenu />
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block mb-6">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-0">
            Welcome back, {user.username}!
          </h1>
          <p className="text-surface-600 dark:text-surface-400">
            Track your drives and manage your stops
          </p>
        </div>

        <div className="grid gap-6">
          {/* Current Drive Section */}
          <section>
            <DriveCard />
          </section>

          {/* Quick Actions */}
           

          {/* Drive History */}
          <section>
            <DriveList />
          </section>
        </div>
      </div>

      {/* Stop Form Modal */}
      <StopForm visible={stopFormVisible} onHide={() => setStopFormVisible(false)} />
    </div>
  );
}
