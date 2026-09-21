import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GoogleMapsService {
  private readonly logger = new Logger(GoogleMapsService.name);

  async autocompletePlaces(query: string) {
    this.logger.log(`Fetching Places autocomplete suggestions for: ${query}`);
    return [
      { placeId: 'place_101', description: `${query}, Downtown, City Center` },
      { placeId: 'place_102', description: `${query} Avenue, Westside Tech Park` },
    ];
  }

  async geocodeAddress(address: string) {
    this.logger.log(`Geocoding address: ${address}`);
    return {
      address,
      latitude: 37.7749,
      longitude: -122.4194,
      formattedAddress: `${address}, San Francisco, CA 94103, USA`,
    };
  }

  async reverseGeocode(latitude: number, longitude: number) {
    this.logger.log(`Reverse geocoding coordinates: (${latitude}, ${longitude})`);
    return {
      latitude,
      longitude,
      formattedAddress: `742 Evergreen Terrace, Springfield (${latitude}, ${longitude})`,
    };
  }

  async calculateRoute(originLat: number, originLng: number, destLat: number, destLng: number) {
    this.logger.log(`Calculating Routes API navigation from (${originLat}, ${originLng}) to (${destLat}, ${destLng})`);
    return {
      origin: { latitude: originLat, longitude: originLng },
      destination: { latitude: destLat, longitude: destLng },
      distanceKm: 12.4,
      durationMinutes: 18,
      polylineEncoded: 'a~4gF_u~xV~B?v@wB',
    };
  }

  async getDistanceMatrix(origins: string[], destinations: string[]) {
    this.logger.log(`Calculating Distance Matrix for ${origins.length} origins and ${destinations.length} destinations`);
    return {
      origins,
      destinations,
      rows: origins.map(o => ({
        elements: destinations.map(d => ({
          distanceMeters: 8500,
          durationSeconds: 900,
          status: 'OK',
        })),
      })),
    };
  }
}
