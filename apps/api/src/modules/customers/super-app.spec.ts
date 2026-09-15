import { MaintenanceTimelineService } from './maintenance-timeline.service';
import { EmergencyDispatchService } from './emergency-dispatch.service';

describe('Customer Super App Services', () => {
  describe('MaintenanceTimelineService', () => {
    let timeline: MaintenanceTimelineService;

    beforeEach(() => {
      timeline = new MaintenanceTimelineService();
    });

    it('should return annual home maintenance schedule', () => {
      const items = timeline.getCustomerTimeline('cust_1');
      expect(items.length).toBeGreaterThan(0);
      expect(items[0].title).toBeDefined();
    });
  });

  describe('EmergencyDispatchService', () => {
    let dispatch: EmergencyDispatchService;

    beforeEach(() => {
      dispatch = new EmergencyDispatchService();
    });

    it('should assign priority emergency provider within 20 mins ETA', async () => {
      const res = await dispatch.triggerPriorityDispatch({
        customerId: 'cust_1',
        emergencyType: 'PLUMBING_LEAK',
        addressId: 'addr_1',
        latitude: 37.7749,
        longitude: -122.4194,
      });

      expect(res.dispatchId).toBeDefined();
      expect(res.estimatedArrivalMinutes).toBeLessThanOrEqual(20);
      expect(res.priorityLevel).toBe('CRITICAL');
    });
  });
});
