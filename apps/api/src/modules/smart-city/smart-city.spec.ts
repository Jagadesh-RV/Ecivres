import { Test, TestingModule } from '@nestjs/testing';
import { MunicipalDispatchService } from './municipal-dispatch.service';
import { InfrastructureMonitorService } from './infrastructure-monitor.service';
import { MunicipalCategory } from './dto/municipal-request.dto';

describe('Smart City Module Services', () => {
  let municipalDispatch: MunicipalDispatchService;
  let infrastructureMonitor: InfrastructureMonitorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MunicipalDispatchService, InfrastructureMonitorService],
    }).compile();

    municipalDispatch = module.get<MunicipalDispatchService>(MunicipalDispatchService);
    infrastructureMonitor = module.get<InfrastructureMonitorService>(InfrastructureMonitorService);
  });

  it('should triage water main break as EMERGENCY priority', async () => {
    const res = await municipalDispatch.triageAndDispatch({
      cityId: 'city_seattle',
      category: MunicipalCategory.WATER_MAIN_BREAK,
      latitude: 47.6062,
      longitude: -122.3321,
      reportedByCitizenId: 'cit_101',
    });
    expect(res.requestId).toBeDefined();
    expect(res.priority).toBe('EMERGENCY');
    expect(res.assignedDepartment).toContain('Emergency Crew');
  });

  it('should audit city infrastructure health index', async () => {
    const health = await infrastructureMonitor.getCityInfrastructureHealth('city_seattle');
    expect(health.healthIndexPercentage).toBeGreaterThan(90);
    expect(health.emergencyAlertsCount).toBeDefined();
  });
});
