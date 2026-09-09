import { useState, useEffect } from 'react';
import { useLocationPermission } from './useLocationPermission';

export interface CustomerCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export const useCustomerLocation = () => {
  const { granted, requestPermission } = useLocationPermission();
  const [location, setLocation] = useState<CustomerCoordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLocation = async () => {
      const isGranted = granted || (await requestPermission());
      if (!isGranted) {
        if (isMounted) setError('Location permission denied');
        return;
      }

      // Default mock coordinates centered around city grid for dev/simulators
      if (isMounted) {
        setLocation({
          latitude: 37.7749,
          longitude: -122.4194,
          accuracy: 5,
        });
      }
    };

    fetchLocation();

    return () => {
      isMounted = false;
    };
  }, [granted, requestPermission]);

  return { location, error };
};
