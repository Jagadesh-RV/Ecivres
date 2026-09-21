import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { GoogleMapsService } from './services/google-maps.service';

describe('GoogleMapsService', () => {
  let service: GoogleMapsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleMapsService],
    }).compile();

    service = module.get<GoogleMapsService>(GoogleMapsService);
  });

  it('should recalculate ETA with traffic condition', async () => {
    const res = await service.recalculateEta('bk_100', 37.77, -122.41);
    expect(res.bookingId).toBe('bk_100');
    expect(res.updatedEtaMinutes).toBe(12);
  });
});
