'use client';

import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useAuth, useDrive } from '@/hooks';
import { useParams, useRouter } from 'next/navigation';
import { DriveWithStops } from '@/types';
import Link from 'next/link';

export default function DriveDetailPage() {
  const { username, driveid } = useParams<{ username: string; driveid: string }>();
  const { user, loading: authLoading } = useAuth();
  const { drives, loading: driveLoading } = useDrive();
  const [drive, setDrive] = useState<DriveWithStops | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.username !== username)) {
      router.push('/login');
      return;
    }

    if (drives.length > 0 && driveid) {
      const foundDrive = drives.find(d => d.id === driveid);
      if (foundDrive) {
        // Convert Drive to DriveWithStops (stops will be loaded separately)
        setDrive({ ...foundDrive, stops: [] });
      } else {
        setDrive(null);
      }
    }
  }, [user, username, drives, driveid, authLoading, router]);

  const formatDuration = (startTime: string, endTime?: string) => {
    if (!endTime) return 'In Progress';
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const duration = end - start;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const categoryTemplate = (stop: { category: string }) => {
    const categoryIcons = {
      gas: 'pi pi-car',
      food: 'pi pi-utensils',
      rest: 'pi pi-home',
      maintenance: 'pi pi-wrench',
      other: 'pi pi-ellipsis-h',
    };
    return (
      <div className="flex items-center space-x-2">
        <i className={categoryIcons[stop.category as keyof typeof categoryIcons]}></i>
        <span className="capitalize">{stop.category}</span>
      </div>
    );
  };

  if (authLoading || driveLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-4xl text-primary mb-4"></i>
          <p className="text-surface-600 dark:text-surface-400">Loading...</p>
        </div>
      </div>
    );
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
              You don&apos;t have permission to access this drive.
            </p>
            <Link href="/">
              <Button label="Go Home" icon="pi pi-home" className="p-button-primary" />
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (!drive) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <div className="text-center">
            <i className="pi pi-search text-4xl text-surface-400 mb-4"></i>
            <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-0 mb-2">
              Drive Not Found
            </h2>
            <p className="text-surface-600 dark:text-surface-400 mb-4">
              The drive you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to
              it.
            </p>
            <Link href={`/${username}/dashboard`}>
              <Button label="Back to Dashboard" icon="pi pi-home" className="p-button-primary" />
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href={`/${username}/dashboard`}>
              <Button icon="pi pi-arrow-left" className="p-button-text mb-2" />
            </Link>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-0">
              Drive Details
            </h1>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Drive Summary */}
          <Card>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-4">
                  Drive Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-surface-600 dark:text-surface-400">Start Time</p>
                    <p className="text-surface-900 dark:text-surface-0">
                      {formatDate(drive.start_time)}
                    </p>
                  </div>
                  {drive.end_time && (
                    <div>
                      <p className="text-sm text-surface-600 dark:text-surface-400">End Time</p>
                      <p className="text-surface-900 dark:text-surface-0">
                        {formatDate(drive.end_time)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-surface-600 dark:text-surface-400">Duration</p>
                    <p className="text-surface-900 dark:text-surface-0">
                      {formatDuration(drive.start_time, drive.end_time)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-surface-600 dark:text-surface-400">Total Stops</p>
                    <p className="text-surface-900 dark:text-surface-0">{drive.stops.length}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-4">
                  Notes
                </h3>
                {drive.notes ? (
                  <p className="text-surface-900 dark:text-surface-0">{drive.notes}</p>
                ) : (
                  <p className="text-surface-400 italic">No notes for this drive</p>
                )}
              </div>
            </div>
          </Card>

          {/* Stops List */}
          <Card>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-4">
              Stops
            </h3>
            {drive.stops.length > 0 ? (
              <DataTable value={drive.stops} className="w-full" stripedRows showGridlines>
                <Column
                  field="created_at"
                  header="Time"
                  body={stop => formatDate(stop.created_at)}
                  className="min-w-[150px]"
                />
                <Column
                  field="category"
                  header="Type"
                  body={categoryTemplate}
                  className="min-w-[120px]"
                />
                <Column
                  field="notes"
                  header="Notes"
                  body={stop => stop.notes || '-'}
                  className="min-w-[200px]"
                />
              </DataTable>
            ) : (
              <div className="text-center p-8">
                <i className="pi pi-map-marker text-4xl text-surface-400 mb-4"></i>
                <p className="text-surface-600 dark:text-surface-400">
                  No stops recorded for this drive
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
