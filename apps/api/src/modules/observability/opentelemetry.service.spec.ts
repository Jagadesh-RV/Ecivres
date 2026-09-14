import { Test, TestingModule } from '@nestjs/testing';
import { OpenTelemetryService } from './opentelemetry.service';

describe('OpenTelemetryService', () => {
  let service: OpenTelemetryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenTelemetryService],
    }).compile();

    service = module.get<OpenTelemetryService>(OpenTelemetryService);
  });

  it('should create distributed telemetry spans with correlation traceId', async () => {
    const span = await service.startSpan('CreateBookingProcess', { customerId: 'c_100' });
    expect(span.traceId).toContain('tr_');
    expect(span.spanId).toContain('sp_');
    expect(span.tags.service).toBe('ecivres-api');
  });

  it('should export Prometheus format metric text', async () => {
    const text = await service.getPrometheusMetricsText();
    expect(text).toContain('http_requests_total');
    expect(text).toContain('booking_success_total');
    expect(text).toContain('api_p99_latency_seconds');
  });
});
