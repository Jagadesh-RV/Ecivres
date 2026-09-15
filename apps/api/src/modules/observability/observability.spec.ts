import { CorrelationIdMiddleware, CORRELATION_HEADER } from './correlation-id.middleware';

describe('CorrelationIdMiddleware', () => {
  let middleware: CorrelationIdMiddleware;

  beforeEach(() => {
    middleware = new CorrelationIdMiddleware();
  });

  it('should generate a correlation ID header if not present in request', () => {
    const req: any = { headers: {} };
    const res: any = { setHeader: jest.fn() };
    const next = jest.fn();

    middleware.use(req, res, next);

    expect(req.headers[CORRELATION_HEADER]).toBeDefined();
    expect(res.setHeader).toHaveBeenCalledWith(CORRELATION_HEADER, req.headers[CORRELATION_HEADER]);
    expect(next).toHaveBeenCalled();
  });

  it('should preserve incoming correlation ID header', () => {
    const existingId = 'custom-trace-id-12345';
    const req: any = { headers: { [CORRELATION_HEADER]: existingId } };
    const res: any = { setHeader: jest.fn() };
    const next = jest.fn();

    middleware.use(req, res, next);

    expect(req.headers[CORRELATION_HEADER]).toBe(existingId);
    expect(res.setHeader).toHaveBeenCalledWith(CORRELATION_HEADER, existingId);
    expect(next).toHaveBeenCalled();
  });
});

describe('SyntheticBenchmarkService', () => {
  it('should run benchmark and evaluate SLA latency threshold', async () => {
    const { SyntheticBenchmarkService } = require('./synthetic-benchmark.service');
    const service = new SyntheticBenchmarkService();

    const report = await service.runSyntheticBenchmark({
      testSuiteName: 'checkout_stress_test',
      simulatedRps: 500,
      durationSeconds: 30,
    });

    expect(report.totalRequestsProcessed).toBe(15000);
    expect(report.slaStatus).toBe('PASS');
  });
});
