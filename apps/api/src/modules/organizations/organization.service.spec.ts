import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from './organization.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('OrganizationService', () => {
  let service: OrganizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<OrganizationService>(OrganizationService);
  });

  it('should create corporate organization account with default departments', async () => {
    const org = await service.createOrganization({
      name: 'Acme Corp',
      taxId: 'TX-910283',
      domain: 'acme.com',
      ownerUserId: 'u_admin',
    });

    expect(org.name).toBe('Acme Corp');
    expect(org.departments.length).toBe(2);
    expect(org.branches.length).toBe(1);
  });

  it('should add secondary branch and invite employee', async () => {
    const org = await service.createOrganization({
      name: 'Globex Inc',
      taxId: 'TX-009281',
      domain: 'globex.com',
      ownerUserId: 'u_admin',
    });

    const updated = await service.addBranch(org.id, 'West Coast Branch', '500 Pacific Ave');
    expect(updated.branches.length).toBe(2);

    const invite = await service.inviteEmployee(org.id, 'emp@globex.com', 'EMPLOYEE');
    expect(invite.invited).toBe(true);
    expect(invite.inviteCode).toContain('ORG-INV-');
  });
});
