'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { Drive, Stop } from '@/types';
import { useDrive } from '@/providers/app-context';
import { StopForm } from '@/components/forms/StopForm';
import { supabase } from '@/lib/supabase-config';

interface DriveCardProps {
  drive?: Drive;
}

export function DriveCard({ drive }: DriveCardProps) {
  const { currentDrive, startDrive, stopDrive } = useDrive();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [location, setLocation] = useState<{ latitude: number | null; longitude: number | null }>({ latitude: null, longitude: null });
  const [locationError, setLocationError] = useState<string | null>(null);
  const [startLocation, setStartLocation] = useState<{ latitude: number | null; longitude: number | null }>({ latitude: null, longitude: null });
  const [endLocation, setEndLocation] = useState<{ latitude: number | null; longitude: number | null }>({ latitude: null, longitude: null });
  const [stopFormVisible, setStopFormVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [stops, setStops] = useState<Stop[]>([]);
  const [loadingStops, setLoadingStops] = useState(false);
  const [totalDistance, setTotalDistance] = useState(0);
  const previousLocationRef = useRef<{ latitude: number | null; longitude: number | null }>({ latitude: null, longitude: null });

  // Timer for drive duration
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

  // GPS integration: update every 10 seconds while drive is active
  useEffect(() => {
    let gpsInterval: NodeJS.Timeout;
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const newLocation = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            };
            setLocation(newLocation);
            setLocationError(null);
            
            // Set start location if this is the first location or if start location is not set
            if (!startLocation.latitude || !startLocation.longitude) {
              setStartLocation(newLocation);
              previousLocationRef.current = newLocation;
            }
          },
          () => {
            setLocation({ latitude: null, longitude: null });
            setLocationError('Unable to retrieve location.');
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        setLocationError('Geolocation is not supported by this browser.');
      }
    };
    
    if (currentDrive && !currentDrive.end_time) {
      fetchLocation();
      gpsInterval = setInterval(fetchLocation, 10000);
    } else if (currentDrive && currentDrive.end_time) {
      // Drive has ended, set end location to current location
      if (location.latitude && location.longitude) {
        setEndLocation(location);
      }
    }
    
    return () => {
      if (gpsInterval) clearInterval(gpsInterval);
    };
  }, [currentDrive, startLocation.latitude, startLocation.longitude, location]);

  // Track distance traveled in real-time
  useEffect(() => {
    if (currentDrive && !currentDrive.end_time && location.latitude && location.longitude && previousLocationRef.current.latitude && previousLocationRef.current.longitude) {
      const distance = calculateDistance(
        previousLocationRef.current.latitude,
        previousLocationRef.current.longitude,
        location.latitude,
        location.longitude
      );
      
      // Only add distance if it's reasonable (less than 1 mile per 10 seconds to avoid GPS jumps)
      if (distance < 1) {
        setTotalDistance(prev => prev + distance);
      }
    }
    
    // Update previous location for next calculation
    if (location.latitude && location.longitude) {
      previousLocationRef.current = location;
    }
  }, [location, currentDrive]);

  // Reset total distance when starting a new drive
  useEffect(() => {
    if (currentDrive && !currentDrive.end_time) {
      setTotalDistance(0);
    }
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

  const handleStopDrive = async () => {
    // Capture end location before stopping
    if (location.latitude && location.longitude) {
      setEndLocation(location);
    }
    await stopDrive();
  };

  const loadStops = async () => {
    if (!currentDrive) {
      console.log('No current drive found');
      return;
    }
    
    console.log('Loading stops for drive ID:', currentDrive.id);
    setLoadingStops(true);
    try {
      const { data, error } = await supabase
        .from('stops')
        .select('*')
        .eq('drive_id', currentDrive.id)
        .order('created_at', { ascending: true });
      
      console.log('Supabase response:', { data, error });
      
      if (error) {
        console.error('Error loading stops:', error);
      } else {
        console.log('Stops loaded successfully:', data);
        setStops(data || []);
      }
    } catch (error) {
      console.error('Error loading stops:', error);
    } finally {
      setLoadingStops(false);
    }
  };

  const handleViewDetails = async () => {
    console.log('View Details clicked, currentDrive:', currentDrive);
    await loadStops();
    setDetailsModalVisible(true);
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

  // Get total distance for the drive
  const getDriveDistance = (): number | null => {
    if (startLocation.latitude && startLocation.longitude && endLocation.latitude && endLocation.longitude) {
      return calculateDistance(
        startLocation.latitude,
        startLocation.longitude,
        endLocation.latitude,
        endLocation.longitude
      );
    }
    return null;
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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">Duration</p>
              <div className="text-xl font-mono font-bold text-surface-900 dark:text-surface-0">
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
              </div>
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
            {isActive && (
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Miles Driven</p>
                <div className="text-xl font-mono font-bold text-surface-900 dark:text-surface-0">
                  {totalDistance.toFixed(2)} mi
                </div>
              </div>
            )}
          </div>

          {/* Distance Display */}
          {getDriveDistance() !== null && (
            <div className="mb-4">
              <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">Total Distance</p>
              <p className="text-xl font-mono font-bold text-surface-900 dark:text-surface-0">
                {getDriveDistance()?.toFixed(2)} miles
              </p>
            </div>
          )}

          {/* Start Location */}
          {startLocation.latitude && startLocation.longitude && (
            <div className="mb-4">
              <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">Start Location</p>
              <p className="text-surface-900 dark:text-surface-0">
                Lat: {startLocation.latitude.toFixed(6)}, Lng: {startLocation.longitude.toFixed(6)}
              </p>
            </div>
          )}

          {/* End Location */}
          {endLocation.latitude && endLocation.longitude && (
            <div className="mb-4">
              <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">End Location</p>
              <p className="text-surface-900 dark:text-surface-0">
                Lat: {endLocation.latitude.toFixed(6)}, Lng: {endLocation.longitude.toFixed(6)}
              </p>
            </div>
          )}

          {/* Current Location (only for active drives) */}
          {isActive && (
            <div className="mb-4">
              <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">Current GPS Location</p>
              {locationError ? (
                <p className="text-surface-400 italic">{locationError}</p>
              ) : location.latitude && location.longitude ? (
                <p className="text-surface-900 dark:text-surface-0">
                  Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
                </p>
              ) : (
                <p className="text-surface-400 italic">Fetching location...</p>
              )}
            </div>
          )}

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
              label="View Details"
              icon="pi pi-eye"
              className="p-button-text"
              onClick={handleViewDetails}
            />
            <Button
              label="Add Stop"
              icon="pi pi-plus"
              className="p-button-outlined"
              onClick={() => setStopFormVisible(true)}
            />
            <Button
              label="Stop Drive"
              icon="pi pi-stop"
              className="p-button-danger"
              onClick={handleStopDrive}
            />
          </div>
        )}
      </div>

      <StopForm
        visible={stopFormVisible}
        onHide={() => setStopFormVisible(false)}
      />

      {/* Drive Details Modal */}
      <Dialog
        visible={detailsModalVisible}
        onHide={() => setDetailsModalVisible(false)}
        header="Drive Details"
        className="w-8"
        modal
      >
        {currentDrive && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border-round border-1 border-300">
                <h3 className="text-lg font-semibold mb-2">Drive Information</h3>
                <p><strong>Started:</strong> {new Date(currentDrive.start_time).toLocaleString()}</p>
                <p><strong>Status:</strong> {currentDrive.end_time ? 'Completed' : 'Active'}</p>
                {currentDrive.end_time && (
                  <p><strong>Ended:</strong> {new Date(currentDrive.end_time).toLocaleString()}</p>
                )}
              </div>
              
              <div className="p-4 border-round border-1 border-300">
                <h3 className="text-lg font-semibold mb-2">Location Data</h3>
                {startLocation.latitude && startLocation.longitude && (
                  <p><strong>Start:</strong> {startLocation.latitude.toFixed(6)}, {startLocation.longitude.toFixed(6)}</p>
                )}
                {endLocation.latitude && endLocation.longitude && (
                  <p><strong>End:</strong> {endLocation.latitude.toFixed(6)}, {endLocation.longitude.toFixed(6)}</p>
                )}
                {getDriveDistance() !== null && (
                  <p><strong>Total Distance:</strong> {getDriveDistance()?.toFixed(2)} miles</p>
                )}
                {isActive && totalDistance > 0 && (
                  <p><strong>Miles Driven:</strong> {totalDistance.toFixed(2)} miles</p>
                )}
              </div>
            </div>

            <div className="p-4 border-round border-1 border-300">
              <h3 className="text-lg font-semibold mb-3">Stops ({stops.length})</h3>
              <div className="mb-2 text-sm text-gray-600">
              </div>
              {loadingStops ? (
                <div className="flex justify-content-center">
                  <ProgressSpinner />
                </div>
              ) : stops.length > 0 ? (
                <div className="space-y-3 max-h-20rem overflow-y-auto">
                  {stops.map((stop) => (
                    <div key={stop.id} className="flex items-center gap-3 p-3 border-round border-1 border-200">
                      <i className={`${getStopIcon(stop.category)} text-xl`}></i>
                      <div className="flex-1">
                        <p className="font-semibold capitalize">{stop.category}</p>
                        {stop.notes && <p className="text-sm text-gray-600">{stop.notes}</p>}
                        <p className="text-xs text-gray-500">
                          {new Date(stop.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">No stops recorded for this drive.</p>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </Card>
  );
}
