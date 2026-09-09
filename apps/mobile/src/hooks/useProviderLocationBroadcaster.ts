import { useState, useEffect, useRef } from 'react';

export interface ProviderLocationUpdate {
  bookingId: string;
  providerId: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
}

export const useProviderLocationBroadcaster = (
  bookingId: string | null,
  providerId: string | null,
  isEnRoute: boolean = false,
  onLocationUpdate?: (data: ProviderLocationUpdate) => void,
) => {
  const [currentLocation, setCurrentLocation] = useState<ProviderLocationUpdate | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!bookingId || !providerId || !isEnRoute) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Simulate provider moving toward customer destination
    let step = 0;
    const baseLat = 37.7749;
    const baseLon = -122.4194;

    intervalRef.current = setInterval(() => {
      step += 1;
      const updated: ProviderLocationUpdate = {
        bookingId,
        providerId,
        latitude: baseLat + step * 0.0005,
        longitude: baseLon + step * 0.0005,
        heading: 45,
        speed: 35,
      };

      setCurrentLocation(updated);
      onLocationUpdate?.(updated);
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [bookingId, providerId, isEnRoute, onLocationUpdate]);

  return { currentLocation };
};
