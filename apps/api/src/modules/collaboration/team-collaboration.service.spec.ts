import { Test, TestingModule } from '@nestjs/testing';
import { TeamCollaborationService } from './team-collaboration.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('TeamCollaborationService', () => {
  let service: TeamCollaborationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamCollaborationService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<TeamCollaborationService>(TeamCollaborationService);
  });

  it('should split payout correctly between lead and team members', async () => {
    const job = await service.createTeamAssignment('b_large', 'prov_lead', ['prov_m1', 'prov_m2'], 1000);
    expect(job.revenueShare.length).toBe(3);

    const leadShare = job.revenueShare.find((s) => s.providerId === 'prov_lead');
    expect(leadShare?.amount).toBe(400);

    const memberShare = job.revenueShare.find((s) => s.providerId === 'prov_m1');
    expect(memberShare?.amount).toBe(300);
  });

  it('should add task assignments and internal notes', async () => {
    await service.createTeamAssignment('b_job2', 'prov_lead', ['prov_m1'], 500);

    const updatedWithTask = await service.addTask('b_job2', 'Main Circuit Wiring', 'prov_m1');
    expect(updatedWithTask.tasks.length).toBe(1);

    const updatedWithNote = await service.addInternalNote('b_job2', 'prov_lead', 'Check transformer voltage before power-on');
    expect(updatedWithNote.internalNotes.length).toBe(1);
  });
});
