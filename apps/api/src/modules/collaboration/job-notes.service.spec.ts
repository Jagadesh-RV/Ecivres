import { Test, TestingModule } from '@nestjs/testing';
import { JobNotesService } from './job-notes.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('JobNotesService', () => {
  let service: JobNotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobNotesService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<JobNotesService>(JobNotesService);
  });

  it('should add internal site notes with photo URLs and retrieve list', async () => {
    const note = await service.addSiteNote(
      'b_100',
      'prov_lead',
      'Subpanel breaker requires 50A dual-pole replacement',
      ['https://example.com/site1.jpg'],
    );

    expect(note.content).toContain('Subpanel breaker');
    expect(note.photoUrls.length).toBe(1);

    const list = await service.getNotes('b_100');
    expect(list.length).toBe(1);
  });
});
