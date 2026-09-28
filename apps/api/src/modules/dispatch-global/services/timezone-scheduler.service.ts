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

  isRegionalHoliday(countryCode: string, isoDate: string): boolean {
    const holidays: Record<string, string[]> = {
      IN: ['2026-01-26', '2026-08-15', '2026-10-02', '2026-11-08'],
      US: ['2026-01-01', '2026-07-04', '2026-11-26', '2026-12-25'],
      AE: ['2026-12-02', '2026-12-03'],
    };
    const list = holidays[countryCode.toUpperCase()] || [];
    const isHoliday = list.includes(isoDate);
    this.logger.log(`Holiday check for ${countryCode} on ${isoDate}: ${isHoliday}`);
    return isHoliday;
  }
}
