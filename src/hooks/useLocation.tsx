import { useState, useCallback } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface UseLocationReturn {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<LocationData | null>;
  getGoogleMapsLink: () => string | null;
  hasAskedPermission: boolean;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAskedPermission, setHasAskedPermission] = useState(false);

  const requestLocation = useCallback(async (): Promise<LocationData | null> => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return null;
    }

    setIsLoading(true);
    setError(null);
    setHasAskedPermission(true);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setLocation(locationData);
          setIsLoading(false);
          resolve(locationData);
        },
        (err) => {
          setIsLoading(false);
          switch (err.code) {
            case err.PERMISSION_DENIED:
              setError('Location permission denied');
              break;
            case err.POSITION_UNAVAILABLE:
              setError('Location information unavailable');
              break;
            case err.TIMEOUT:
              setError('Location request timed out');
              break;
            default:
              setError('An unknown error occurred');
          }
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  const getGoogleMapsLink = useCallback((): string | null => {
    if (!location) return null;
    return `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
  }, [location]);

  return {
    location,
    isLoading,
    error,
    requestLocation,
    getGoogleMapsLink,
    hasAskedPermission,
  };
}
