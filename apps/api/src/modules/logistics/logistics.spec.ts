import { RouteOptimizerService } from './route-optimizer.service';
import { TrafficEtaService } from './traffic-eta.service';

describe('Smart Logistics Engine Services', () => {
  describe('RouteOptimizerService', () => {
    let optimizer: RouteOptimizerService;

    beforeEach(() => {
      optimizer = new RouteOptimizerService();
    });

    it('should sort waypoints by spatial coordinates to optimize total route distance', () => {
      const res = optimizer.optimizeMultiStopRoute('prov_1', [
        { bookingId: 'b2', address: 'North St', latitude: 37.80, longitude: -122.40, scheduledTime: '10:00' },
        { bookingId: 'b1', address: 'South St', latitude: 37.75, longitude: -122.42, scheduledTime: '09:00' },
      ]);

      expect(res.routeId).toBeDefined();
      expect(res.optimizedWaypoints[0].bookingId).toBe('b1');
    });
  });

  describe('TrafficEtaService', () => {
    let eta: TrafficEtaService;

    beforeEach(() => {
      eta = new TrafficEtaService();
    });

    it('should recalculate ETA with traffic delay reason', () => {
      const res = eta.recalculateRealtimeEta('b1', 37.77, -122.41, 37.78, -122.42);
      expect(res.updatedEtaMinutes).toBeGreaterThan(0);
      expect(res.trafficCongestionLevel).toBeDefined();
    });
  });

  describe('FleetTelemetryService', () => {
    let telemetry: FleetTelemetryService;

    beforeEach(() => {
      const { FleetTelemetryService } = require('./fleet-telemetry.service');
      telemetry = new FleetTelemetryService();
    });

    it('should flag anomaly on high speed velocity telemetry', async () => {
      const res = await telemetry.processTelemetry({
        providerId: 'prov_100',
        latitude: 37.77,
        longitude: -122.41,
        speedKmh: 185,
        batteryLevel: 50,
      });

      expect(res.anomalyDetected).toBe(true);
      expect(res.anomalyReason).toContain('Speed exceeds');
    });
  });
});
