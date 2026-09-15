import { DemandForecasterService } from './demand-forecaster.service';
import { CustomerSegmentationService } from './customer-segmentation.service';

describe('Data Intelligence Platform Services', () => {
  describe('DemandForecasterService', () => {
    let forecaster: DemandForecasterService;

    beforeEach(() => {
      forecaster = new DemandForecasterService();
    });

    it('should predict category booking demand with confidence score > 0.9', () => {
      const res = forecaster.predictDemandForCategory('cat_hvac', '2026-10');
      expect(res.predictedBookingCount).toBeGreaterThan(1000);
      expect(res.confidenceScore).toBeGreaterThanOrEqual(0.9);
    });
  });

  describe('CustomerSegmentationService', () => {
    let segmenter: CustomerSegmentationService;

    beforeEach(() => {
      segmenter = new CustomerSegmentationService();
    });

    it('should assign HIGH_VALUE_VIP tier for customers with spend >= $1000', () => {
      const seg = segmenter.segmentCustomer('cust_vip', 1500, 12);
      expect(seg.segmentTier).toBe('HIGH_VALUE_VIP');
      expect(seg.predictedLtv).toBe(3500);
    });
  });
});
