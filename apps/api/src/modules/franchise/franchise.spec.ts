import { Test, TestingModule } from '@nestjs/testing';
import { FranchiseService } from './franchise.service';
import { TerritoryService } from './territory.service';
import { RoyaltyCalculatorService } from './royalty-calculator.service';

describe('Franchise Module Services', () => {
  let franchiseService: FranchiseService;
  let territoryService: TerritoryService;
  let royaltyCalculator: RoyaltyCalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FranchiseService, TerritoryService, RoyaltyCalculatorService],
    }).compile();

    franchiseService = module.get<FranchiseService>(FranchiseService);
    territoryService = module.get<TerritoryService>(TerritoryService);
    royaltyCalculator = module.get<RoyaltyCalculatorService>(RoyaltyCalculatorService);
  });

  it('should onboard new franchise brand', async () => {
    const res = await franchiseService.onboardFranchise({
      brandName: 'CleanPro National',
      ownerEmail: 'ceo@cleanpro.com',
      primaryRegion: 'US-WEST',
      royaltyPercentage: 8,
    });
    expect(res.franchiseId).toBeDefined();
    expect(res.brandName).toBe('CleanPro National');
    expect(res.status).toBe('ACTIVE');
  });

  it('should allocate territory zip codes and compute population coverage', async () => {
    const res = await territoryService.allocateTerritory({
      franchiseId: 'fran_101',
      branchName: 'CleanPro Seattle North',
      assignedZipCodes: ['98101', '98102', '98103'],
    });
    expect(res.territoryId).toBeDefined();
    expect(res.totalPopulationCoverage).toBe(135000); // 3 * 45000
  });

  it('should calculate 8% royalty split on gross branch revenue', () => {
    const res = royaltyCalculator.calculateRoyaltySplit('fran_101', 50000, 8);
    expect(res.royaltyFeeUsd).toBe(4000);
    expect(res.netBranchRevenueUsd).toBe(46000);
  });
});
