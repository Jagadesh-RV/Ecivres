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
}
