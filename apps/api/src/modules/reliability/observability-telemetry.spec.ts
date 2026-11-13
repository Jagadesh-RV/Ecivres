import { OperationalMetricsService } from './operational-metrics.service';
import { CorrelationIdMiddleware } from '../../common/middleware/correlation-id.middleware';

describe('Observability, Prometheus Metrics & Telemetry Specification', () => {
  let metricsService: OperationalMetricsService;
  let correlationMiddleware: CorrelationIdMiddleware;

  beforeEach(() => {
    metricsService = new OperationalMetricsService();
    correlationMiddleware = new CorrelationIdMiddleware();
  });

  describe('Prometheus Metrics Exposition', () => {
    it('should record nominal requests and format valid Prometheus line metrics', () => {
      metricsService.recordRequestLatency(25, false);
      metricsService.recordRequestLatency(45, false);
      metricsService.recordRequestLatency(150, true);

      const prometheusOutput = metricsService.toPrometheusFormat();

      expect(prometheusOutput).toContain('# HELP ecivres_http_requests_total Total number of processed HTTP requests.');
      expect(prometheusOutput).toContain('# TYPE ecivres_http_requests_total counter');
      expect(prometheusOutput).toContain('ecivres_http_requests_total 3');

      expect(prometheusOutput).toContain('# HELP ecivres_http_errors_total Total number of HTTP 5xx errors.');
      expect(prometheusOutput).toContain('# TYPE ecivres_http_errors_total counter');
      expect(prometheusOutput).toContain('ecivres_http_errors_total 1');

      expect(prometheusOutput).toContain('ecivres_http_request_duration_ms{quantile="0.50"}');
      expect(prometheusOutput).toContain('ecivres_http_request_duration_ms{quantile="0.95"}');
      expect(prometheusOutput).toContain('ecivres_http_request_duration_ms{quantile="0.99"}');
      expect(prometheusOutput).toContain('ecivres_circuit_trips_total 0');
    });

    it('should reflect circuit breaker trip events in metrics snapshot and prometheus output', () => {
      metricsService.recordCircuitTrip('payment-gateway');
      metricsService.recordCircuitTrip('notification-worker');

      const snapshot = metricsService.getMetricsSnapshot();
      expect(snapshot.circuitTrips).toBe(2);

      const prometheusOutput = metricsService.toPrometheusFormat();
      expect(prometheusOutput).toContain('ecivres_circuit_trips_total 2');
    });
  });

  describe('Correlation ID Middleware', () => {
    it('should preserve and propagate incoming X-Correlation-Id header', () => {
      const mockReq: any = {
        headers: { 'x-correlation-id': 'client-custom-trace-uuid-12345' },
      };
      const mockRes: any = {
        setHeader: jest.fn(),
      };
      const nextFn = jest.fn();

      correlationMiddleware.use(mockReq, mockRes, nextFn);

      expect(mockReq.correlationId).toBe('client-custom-trace-uuid-12345');
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-Correlation-Id', 'client-custom-trace-uuid-12345');
      expect(nextFn).toHaveBeenCalled();
    });

    it('should generate a new req-UUID correlation ID when no header is provided', () => {
      const mockReq: any = { headers: {} };
      const mockRes: any = { setHeader: jest.fn() };
      const nextFn = jest.fn();

      correlationMiddleware.use(mockReq, mockRes, nextFn);

      expect(mockReq.correlationId).toBeDefined();
      expect(mockReq.correlationId).toMatch(/^req-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-Correlation-Id', mockReq.correlationId);
      expect(nextFn).toHaveBeenCalled();
    });
  });
});
