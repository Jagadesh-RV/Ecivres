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
}
