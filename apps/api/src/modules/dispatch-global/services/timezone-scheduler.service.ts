import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TimezoneSchedulerService {
  private readonly logger = new Logger(TimezoneSchedulerService.name);

  private readonly timezonesByCountry: Record<string, string> = {
    US: 'America/New_York',
    IN: 'Asia/Kolkata',
    GB: 'Europe/London',
    AE: 'Asia/Dubai',
    DE: 'Europe/Berlin',
  };

  getCountryTimezone(countryCode: string): string {
    const tz = this.timezonesByCountry[countryCode.toUpperCase()] || 'UTC';
    this.logger.log(`Resolved timezone for ${countryCode}: ${tz}`);
    return tz;
  }

  isWithinWorkingHours(localHour: number, countryCode: string): boolean {
    const isWorkingHour = localHour >= 8 && localHour < 20;
    this.logger.log(`Working hour check for ${countryCode} at hour ${localHour}: ${isWorkingHour}`);
    return isWorkingHour;
  }
}
