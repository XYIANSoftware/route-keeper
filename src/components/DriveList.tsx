'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { DriveWithStops } from '@/types';
import Link from 'next/link';
import { useDrive } from '@/hooks/useDrive';

export function DriveList() {
  const { drives, loading } = useDrive();

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
    return new Date(dateString).toLocaleDateString();
  };

  const stopsTemplate = (drive: DriveWithStops) => {
    return (
      <div className="flex items-center space-x-1">
        <i className="pi pi-map-marker text-primary"></i>
        <span>{drive.stops.length}</span>
      </div>
    );
  };

  const actionsTemplate = (drive: DriveWithStops) => {
    return (
      <Link href={`/drives/${drive.id}`}>
        <Button icon="pi pi-eye" className="p-button-text p-button-sm" aria-label="View details" />
      </Link>
    );
  };

  const emptyMessage = () => {
    return (
      <div className="text-center p-8">
        <i className="pi pi-list text-4xl text-surface-400 mb-4"></i>
        <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-2">
          No Drives Yet
        </h3>
        <p className="text-surface-600 dark:text-surface-400">
          Start your first drive to see it here!
        </p>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-0">
          Drive History
        </h2>
        <Button
          icon="pi pi-refresh"
          className="p-button-text p-button-rounded"
          loading={loading}
          aria-label="Refresh"
        />
      </div>

      <DataTable
        value={drives}
        loading={loading}
        emptyMessage={emptyMessage}
        className="w-full"
        stripedRows
        showGridlines
        responsiveLayout="scroll"
      >
        <Column
          field="start_time"
          header="Date"
          body={drive => formatDate(drive.start_time)}
          className="min-w-[100px]"
        />
        <Column
          field="duration"
          header="Duration"
          body={drive => formatDuration(drive.start_time, drive.end_time)}
          className="min-w-[120px]"
        />
        <Column
          field="stops"
          header="Stops"
          body={stopsTemplate}
          className="min-w-[80px] text-center"
        />
        <Column
          field="notes"
          header="Notes"
          body={drive => drive.notes || '-'}
          className="min-w-[150px]"
        />
        <Column body={actionsTemplate} className="min-w-[60px] text-center" />
      </DataTable>
    </div>
  );
}
