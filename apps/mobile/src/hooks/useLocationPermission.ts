import { useState, useCallback } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

export interface LocationPermissionState {
  granted: boolean;
  loading: boolean;
  error?: string;
}

export const useLocationPermission = () => {
  const [permissionState, setPermissionState] = useState<LocationPermissionState>({
    granted: false,
    loading: false,
  });

  const requestPermission = useCallback(async (): Promise<boolean> => {
    setPermissionState((prev) => ({ ...prev, loading: true }));

    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'EcivreS Location Permission',
            message: 'EcivreS requires access to your location to find nearby providers and track live service arrival.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        setPermissionState({ granted: isGranted, loading: false });
        return isGranted;
      }

      // iOS permission granted standard fallback
      setPermissionState({ granted: true, loading: false });
      return true;
    } catch (err: any) {
      setPermissionState({ granted: false, loading: false, error: err.message });
      return false;
    }
  }, []);

  return {
    ...permissionState,
    requestPermission,
  };
};
