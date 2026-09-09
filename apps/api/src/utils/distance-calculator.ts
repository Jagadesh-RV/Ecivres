export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface DistanceCalculationResult {
  distanceKm: number;
  distanceMiles: number;
  estimatedTravelTimeMinutes: number;
  formattedEta: string;
}

export function haversineDistance(
  coord1: Coordinates,
  coord2: Coordinates,
  unit: 'km' | 'miles' = 'km',
): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = unit === 'km' ? 6371 : 3958.8; // Earth radius in km or miles

  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);
  const lat1 = toRad(coord1.latitude);
  const lat2 = toRad(coord2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Number((R * c).toFixed(2));
}

export function calculateProviderDistanceAndEta(
  providerCoords: Coordinates,
  customerCoords: Coordinates,
  averageSpeedKmH = 35,
): DistanceCalculationResult {
  const distanceKm = haversineDistance(providerCoords, customerCoords, 'km');
  const distanceMiles = Number((distanceKm * 0.621371).toFixed(2));

  // Estimate travel time in minutes with 1.25 urban traffic multiplier
  const rawHours = distanceKm / averageSpeedKmH;
  const estimatedTravelTimeMinutes = Math.max(1, Math.round(rawHours * 60 * 1.25));

  let formattedEta = `${estimatedTravelTimeMinutes} mins`;
  if (estimatedTravelTimeMinutes >= 60) {
    const hrs = Math.floor(estimatedTravelTimeMinutes / 60);
    const mins = estimatedTravelTimeMinutes % 60;
    formattedEta = `${hrs} hr ${mins} mins`;
  }

  return {
    distanceKm,
    distanceMiles,
    estimatedTravelTimeMinutes,
    formattedEta,
  };
}
