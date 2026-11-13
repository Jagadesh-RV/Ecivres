import { Test, TestingModule } from '@nestjs/testing';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  HttpStatus,
  INestApplication,
} from '@nestjs/common';
import request from 'supertest';
import { TenantBoundaryGuard } from '../src/common/guards/tenant-boundary.guard';
import { TenantSanitizationInterceptor } from '../src/common/interceptors/tenant-sanitization.interceptor';
import { PrismaService } from '../src/prisma/prisma.service';

@Controller('test-orgs/:orgId')
@UseGuards(TenantBoundaryGuard)
@UseInterceptors(TenantSanitizationInterceptor)
class TestTenantProtectedController {
  @Get('resources')
  getResources(@Param('orgId') orgId: string) {
    return { status: 'SUCCESS', orgId, data: ['res_1', 'res_2'] };
  }

  @Post('resources')
  createResource(@Param('orgId') orgId: string, @Body() body: any) {
    return { status: 'CREATED', orgId, resource: body };
  }
}

describe('Phase 28: Multi-Tenant IDOR Attack Simulation & Boundary Enforcement (e2e)', () => {
  let app: INestApplication;

  const mockPrisma = {
    organizationMember: {
      findFirst: jest.fn().mockImplementation(({ where }) => {
        // user_alpha only belongs to org_alpha_corp
        if (where.userId === 'user_alpha' && where.orgId === 'org_alpha_corp') {
          return Promise.resolve({ id: 'mem_alpha', userId: 'user_alpha', orgId: 'org_alpha_corp' });
        }
        // user_beta only belongs to org_beta_industries
        if (where.userId === 'user_beta' && where.orgId === 'org_beta_industries') {
          return Promise.resolve({ id: 'mem_beta', userId: 'user_beta', orgId: 'org_beta_industries' });
        }
        return Promise.resolve(null);
      }),
    },
  };

  let currentUser: any = null;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TestTenantProtectedController],
      providers: [
        TenantBoundaryGuard,
        TenantSanitizationInterceptor,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Simulate auth middleware attaching user
    app.use((req: any, _res: any, next: any) => {
      req.user = currentUser;
      next();
    });
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('1. Rejects unauthenticated request without user context with HTTP 403', async () => {
    currentUser = null;
    await request(app.getHttpServer())
      .get('/test-orgs/org_alpha_corp/resources')
      .expect(HttpStatus.FORBIDDEN);
  });

  it('2. Permits legitimate tenant member to access their own organization resources', async () => {
    currentUser = { id: 'user_alpha', orgId: 'org_alpha_corp', roles: ['MEMBER'] };
    const res = await request(app.getHttpServer())
      .get('/test-orgs/org_alpha_corp/resources')
      .expect(HttpStatus.OK);

    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.orgId).toBe('org_alpha_corp');
  });

  it('3. BLOCKS cross-tenant IDOR attack: user_alpha attempting to read org_beta_industries', async () => {
    currentUser = { id: 'user_alpha', orgId: 'org_alpha_corp', roles: ['MEMBER'] };
    const res = await request(app.getHttpServer())
      .get('/test-orgs/org_beta_industries/resources')
      .expect(HttpStatus.FORBIDDEN);

    expect(res.body.message).toContain('Cross-tenant boundary breach blocked');
  });

  it('4. BLOCKS payload tenant spoofing attack: user_alpha injecting org_beta_industries in POST body', async () => {
    currentUser = { id: 'user_alpha', orgId: 'org_alpha_corp', roles: ['MEMBER'] };
    const res = await request(app.getHttpServer())
      .post('/test-orgs/org_alpha_corp/resources')
      .send({ title: 'Fraudulent Purchase Order', organizationId: 'org_beta_industries' })
      .expect(HttpStatus.FORBIDDEN);

    expect(res.body.message).toContain('Tenant spoofing rejected');
  });

  it('5. Permits platform SUPER_ADMIN to audit any organization across tenant boundaries', async () => {
    currentUser = { id: 'admin_root', role: 'SUPER_ADMIN', roles: ['SUPER_ADMIN'] };
    const res = await request(app.getHttpServer())
      .get('/test-orgs/org_beta_industries/resources')
      .expect(HttpStatus.OK);

    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.orgId).toBe('org_beta_industries');
  });
});
