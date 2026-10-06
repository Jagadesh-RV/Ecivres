import { Injectable, Logger } from '@nestjs/common';

export interface RegionZone {
  id: string;
  countryCode: string;
  metroName: string;
  cityName: string;
  zoneName: string;
  postalCodes: string[];
  isActive: boolean;
}

@Injectable()
export class GeographicExpansionService {
  private readonly logger = new Logger(GeographicExpansionService.name);
  private readonly zonesMap = new Map<string, RegionZone>();

  constructor() {
    // Seed initial active expansion zones
    const defaultZone: RegionZone = {
      id: 'zone_nyc_manhattan',
      countryCode: 'US',
      metroName: 'Greater New York',
      cityName: 'New York City',
      zoneName: 'Manhattan Core',
      postalCodes: ['10001', '10002', '10003', '10004'],
      isActive: true,
    };
    this.zonesMap.set(defaultZone.id, defaultZone);
  }

  async getActiveZones() {
    return Array.from(this.zonesMap.values()).filter((z) => z.isActive);
  }

  async getZoneByPostalCode(postalCode: string): Promise<RegionZone | null> {
    const zones = Array.from(this.zonesMap.values());
    return zones.find((z) => z.postalCodes.includes(postalCode)) || null;
  }
}
