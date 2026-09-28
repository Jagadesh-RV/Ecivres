import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { TimezoneSchedulerService } from './services/timezone-scheduler.service';

describe('TimezoneSchedulerService', () => {
  let service: TimezoneSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimezoneSchedulerService],
    }).compile();

    service = module.get<TimezoneSchedulerService>(TimezoneSchedulerService);
  });

  it('should resolve Asia/Kolkata for India (IN)', () => {
    const tz = service.getCountryTimezone('IN');
    expect(tz).toBe('Asia/Kolkata');
  });

  it('should validate working hours between 8 AM and 8 PM', () => {
    expect(service.isWithinWorkingHours(10, 'US')).toBe(true);
    expect(service.isWithinWorkingHours(22, 'US')).toBe(false);
  });

  it('should detect Indian Independence Day as a holiday', () => {
    expect(service.isRegionalHoliday('IN', '2026-08-15')).toBe(true);
  });
});
