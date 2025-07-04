'use client';

import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Drive } from '@/types';
import { useDrive } from '@/hooks/useDrive';

interface DriveCardProps {
  drive?: Drive;
}

export function DriveCard({ drive }: DriveCardProps) {
  const { currentDrive, startDrive, stopDrive } = useDrive();
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (currentDrive && !currentDrive.end_time) {
      interval = setInterval(() => {
        const start = new Date(currentDrive.start_time).getTime();
        const now = new Date().getTime();
        setElapsedTime(now - start);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentDrive]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const getDriveDuration = (drive: Drive) => {
    if (!drive.end_time) return null;
    const start = new Date(drive.start_time).getTime();
    const end = new Date(drive.end_time).getTime();
    return formatTime(end - start);
  };

  if (!currentDrive && !drive) {
    return (
      <Card className="mb-4">
        <div className="text-center p-4">
          <i className="pi pi-car text-4xl text-surface-400 mb-4"></i>
          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-2">
            No Active Drive
          </h3>
          <p className="text-surface-600 dark:text-surface-400 mb-4">
            Ready to start tracking your drive?
          </p>
          <Button
            label="Start Drive"
            icon="pi pi-play"
            className="p-button-primary"
            onClick={startDrive}
          />
        </div>
      </Card>
    );
  }

  const activeDrive = currentDrive || drive;
  if (!activeDrive) return null;

  const isActive = !activeDrive.end_time;
  const duration = isActive ? formatTime(elapsedTime) : getDriveDuration(activeDrive);

  return (
    <Card className="mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <i className="pi pi-car text-2xl text-primary"></i>
            <div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-0">
                {isActive ? 'Active Drive' : 'Drive Details'}
              </h3>
              <p className="text-sm text-surface-600 dark:text-surface-400">
                Started: {new Date(activeDrive.start_time).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">Duration</p>
              <p className="text-xl font-mono font-bold text-surface-900 dark:text-surface-0">
                {isActive ? (
                  <span className="flex items-center">
                    {duration}
                    {isActive && (
                      <ProgressSpinner style={{ width: '20px', height: '20px' }} className="ml-2" />
                    )}
                  </span>
                ) : (
                  duration
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">Status</p>
              <p
                className={`font-semibold ${
                  isActive ? 'text-green-600' : 'text-surface-600 dark:text-surface-400'
                }`}
              >
                {isActive ? 'In Progress' : 'Completed'}
              </p>
            </div>
          </div>

          {activeDrive.notes && (
            <div className="mb-4">
              <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">Notes</p>
              <p className="text-surface-900 dark:text-surface-0">{activeDrive.notes}</p>
            </div>
          )}
        </div>

        {isActive && (
          <div className="flex space-x-2">
            <Button
              label="Add Stop"
              icon="pi pi-plus"
              className="p-button-outlined"
              // TODO: Open stop form
            />
            <Button
              label="Stop Drive"
              icon="pi pi-stop"
              className="p-button-danger"
              onClick={stopDrive}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
