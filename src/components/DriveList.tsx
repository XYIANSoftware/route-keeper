'use client';

import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Drive, DriveWithStops } from '@/types';
import { useDrive } from '@/hooks';
import { supabase } from '@/lib/supabase-config';

export function DriveList() {
  const { drives, loading } = useDrive();
  const [selectedDrive, setSelectedDrive] = useState<DriveWithStops | null>(null);
  const [modalVisible, setModalVisible] = useState(false);


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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Calculate distance between two GPS coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const getDriveDistance = (drive: Drive): number | null => {
    if (drive.start_latitude && drive.start_longitude && drive.end_latitude && drive.end_longitude) {
      return calculateDistance(
        drive.start_latitude,
        drive.start_longitude,
        drive.end_latitude,
        drive.end_longitude
      );
    }
    return null;
  };

  // Replace stopsTemplate with a React component
  function StopsTemplate({ drive }: { drive: Drive }) {
    const [stopCount, setStopCount] = useState<number>(0);
    const [loadingCount, setLoadingCount] = useState(true);

    useEffect(() => {
      const loadStopCount = async () => {
        try {
          const { count, error } = await supabase
            .from('stops')
            .select('*', { count: 'exact', head: true })
            .eq('drive_id', drive.id);
          if (error) {
            console.error(`Error loading stop count for drive ${drive.id}:`, error);
            setStopCount(0);
          } else {
            setStopCount(count || 0);
          }
        } catch (error) {
          console.error(`Error loading stop count for drive ${drive.id}:`, error);
          setStopCount(0);
        } finally {
          setLoadingCount(false);
        }
      };
      loadStopCount();
    }, [drive.id]);

    return (
      <div className="flex items-center space-x-1">
        <i className="pi pi-map-marker text-primary"></i>
        <span>{loadingCount ? '...' : stopCount}</span>
      </div>
    );
  }

  const actionsTemplate = (drive: Drive) => {
    return (
      <Button 
        icon="pi pi-eye" 
        className="p-button-text p-button-sm" 
        aria-label="View details"
        onClick={async () => {
          console.log('Loading stops for drive:', drive.id);
          
          // Load stops for this drive
          const { data: stops, error } = await supabase
            .from('stops')
            .select('*')
            .eq('drive_id', drive.id)
            .order('created_at', { ascending: true });
          
          console.log('Stops query result:', { stops, error });
          
          if (error) {
            console.error('Error loading stops:', error);
          }
          
          const driveWithStops: DriveWithStops = {
            ...drive,
            stops: stops || []
          };
          
          console.log('Drive with stops:', driveWithStops);
          setSelectedDrive(driveWithStops);
          setModalVisible(true);
        }}
      />
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

  const renderDriveDetails = () => {
    if (!selectedDrive) return null;

    console.log('Rendering drive details for:', selectedDrive);
    console.log('Stops in selectedDrive:', selectedDrive.stops);

    const distance = getDriveDistance(selectedDrive);
    const isActive = !selectedDrive.end_time;

    return (
      <div className="space-y-6">
        {/* Drive Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-surface-600 dark:text-surface-400">Start Time</p>
            <p className="text-surface-900 dark:text-surface-0 font-semibold">
              {formatDateTime(selectedDrive.start_time)}
            </p>
          </div>
          {selectedDrive.end_time && (
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">End Time</p>
              <p className="text-surface-900 dark:text-surface-0 font-semibold">
                {formatDateTime(selectedDrive.end_time)}
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-surface-600 dark:text-surface-400">Duration</p>
            <p className="text-surface-900 dark:text-surface-0 font-semibold">
              {formatDuration(selectedDrive.start_time, selectedDrive.end_time)}
            </p>
          </div>
          {distance && (
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">Distance</p>
              <p className="text-surface-900 dark:text-surface-0 font-semibold">
                {distance.toFixed(2)} miles
              </p>
            </div>
          )}
        </div>

        {/* GPS Locations */}
        {selectedDrive.start_latitude && selectedDrive.start_longitude && (
          <div>
            <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">Start Location</p>
            <p className="text-surface-900 dark:text-surface-0">
              Lat: {selectedDrive.start_latitude.toFixed(6)}, Lng: {selectedDrive.start_longitude.toFixed(6)}
            </p>
          </div>
        )}

        {selectedDrive.end_latitude && selectedDrive.end_longitude && (
          <div>
            <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">End Location</p>
            <p className="text-surface-900 dark:text-surface-0">
              Lat: {selectedDrive.end_latitude.toFixed(6)}, Lng: {selectedDrive.end_longitude.toFixed(6)}
            </p>
          </div>
        )}

        {/* Notes */}
        {selectedDrive.notes && (
          <div>
            <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">Notes</p>
            <p className="text-surface-900 dark:text-surface-0">{selectedDrive.notes}</p>
          </div>
        )}

        {/* Status */}
        <div>
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">Status</p>
          <p className={`font-semibold ${isActive ? 'text-green-600' : 'text-surface-600 dark:text-surface-400'}`}>
            {isActive ? 'In Progress' : 'Completed'}
          </p>
        </div>

        {/* Stops */}
        <div>
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">
            Stops ({selectedDrive.stops ? selectedDrive.stops.length : 0})
          </p>
          {selectedDrive.stops && selectedDrive.stops.length > 0 ? (
            <div className="space-y-2">
              {selectedDrive.stops.map((stop) => (
                <div key={stop.id} className="p-3 border border-surface-200 dark:border-surface-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <i className={`${getStopIcon(stop.category)} text-primary`}></i>
                      <span className="font-semibold capitalize">{stop.category}</span>
                    </div>
                    <span className="text-sm text-surface-600 dark:text-surface-400">
                      {new Date(stop.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  {stop.notes && (
                    <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">{stop.notes}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 border border-surface-200 dark:border-surface-700 rounded-lg text-center">
              <i className="pi pi-map-marker text-surface-400 text-xl mb-2"></i>
              <p className="text-surface-600 dark:text-surface-400">No stops recorded for this drive</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const getStopIcon = (category: string) => {
    const icons = {
      gas: 'pi pi-car',
      food: 'pi pi-utensils',
      rest: 'pi pi-home',
      maintenance: 'pi pi-wrench',
      other: 'pi pi-ellipsis-h'
    };
    return icons[category as keyof typeof icons] || 'pi pi-ellipsis-h';
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
          scrollable
          scrollHeight="500px"
          style={{ maxHeight: '500px' }}
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
          body={drive => <StopsTemplate drive={drive} />}
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

      {/* Drive Details Modal */}
      <Dialog
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
        header="Drive Details"
        className="w-8"
        modal
        style={{ maxHeight: '70vh' }}
      >
        {renderDriveDetails()}
      </Dialog>
    </div>
  );
}
