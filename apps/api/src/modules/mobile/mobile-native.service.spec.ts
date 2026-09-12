import { Test, TestingModule } from '@nestjs/testing';
import { MobileNativeService } from './mobile-native.service';

describe('MobileNativeService', () => {
  let service: MobileNativeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MobileNativeService],
    }).compile();

    service = module.get<MobileNativeService>(MobileNativeService);
  });

  it('should generate home screen widget data payload', async () => {
    const data = await service.getHomeScreenWidgetData('u100');
    expect(data.upcomingBooking?.serviceName).toBeDefined();
    expect(data.loyaltyPoints).toBeGreaterThan(0);
  });

  it('should parse voice command transcripts into actionable intents', async () => {
    const emergencyIntent = await service.parseVoiceCommand('Find an emergency plumber now for a burst pipe!');
    expect(emergencyIntent.intent).toBe('BOOK_EMERGENCY');
    expect(emergencyIntent.confidenceScore).toBeGreaterThan(0.9);

    const statusIntent = await service.parseVoiceCommand('When is my provider arriving?');
    expect(statusIntent.intent).toBe('CHECK_STATUS');
  });
});
