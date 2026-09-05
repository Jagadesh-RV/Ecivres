import { haversineDistance } from './distance-calculator';

describe('DistanceCalculator', () => {
  it('should return 0 distance for identical coordinates', () => {
    const loc = { latitude: 37.7749, longitude: -122.4194 }; // San Francisco
    const distance = haversineDistance(loc, loc);
    expect(distance).toBe(0);
  });

  it('should calculate accurate distance between two cities', () => {
    const sf = { latitude: 37.7749, longitude: -122.4194 }; // San Francisco
    const la = { latitude: 34.0522, longitude: -118.2437 }; // Los Angeles

    const distKm = haversineDistance(sf, la, 'km');
    const distMiles = haversineDistance(sf, la, 'miles');

    expect(distKm).toBeGreaterThan(550);
    expect(distKm).toBeLessThan(600);
    expect(distMiles).toBeGreaterThan(340);
    expect(distMiles).toBeLessThan(380);
  });
});
