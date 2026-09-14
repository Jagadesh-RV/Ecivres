import { DnsFailoverService } from './dns-failover.service';
import { ReplicationMonitorService } from './replication-monitor.service';

describe('Disaster Recovery Services', () => {
  describe('DnsFailoverService', () => {
    let service: DnsFailoverService;

    beforeEach(() => {
      service = new DnsFailoverService();
    });

    it('should stay on primary region when healthy', () => {
      const res = service.evaluateRoute53Failover(true);
      expect(res.failoverTriggered).toBe(false);
      expect(res.activeEndpoint).toContain('us-east-1');
    });

    it('should trigger automated failover to secondary region when primary fails', () => {
      const res = service.evaluateRoute53Failover(false);
      expect(res.failoverTriggered).toBe(true);
      expect(res.activeEndpoint).toContain('us-west-2');
    });
  });

  describe('ReplicationMonitorService', () => {
    let monitor: ReplicationMonitorService;

    beforeEach(() => {
      monitor = new ReplicationMonitorService();
    });

    it('should flag RPO breach when lag exceeds 15s threshold', () => {
      const report = monitor.checkCrossRegionReplicationLag(25, 5000000);
      expect(report.rpoBreached).toBe(true);
    });
  });
});
