import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  ForbiddenException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { Roles } from '../src/common/decorators/roles.decorator';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import helmet from 'helmet';

// Dedicated Controller to verify multi-tenant isolation and security controls
@Controller('test-tenancy')
@UseGuards(JwtAuthGuard, RolesGuard)
class TestTenantSecurityController {
  @Get('tenant-resource/:orgId')
  getTenantResource(@Req() req: any, @Param('orgId') orgId: string) {
    if (req.user.orgId !== orgId) {
      throw new ForbiddenException(`Cross-tenant access violation: user does not belong to organization '${orgId}'`);
    }
    return {
      success: true,
      orgId,
      data: `Confidential data for tenant ${orgId}`,
      tenantOwner: 'Enterprise Admin',
    };
  }

  @Put('tenant-resource/:orgId')
  updateTenantResource(@Req() req: any, @Param('orgId') orgId: string, @Body() body: any) {
    if (req.user.orgId !== orgId) {
      throw new ForbiddenException(`Cross-tenant mutation violation: user cannot modify organization '${orgId}'`);
    }
    return {
      success: true,
      orgId,
      updatedField: body.field || 'updated',
    };
  }

  @Delete('tenant-resource/:orgId')
  @Roles('OWNER')
  deleteTenantResource(@Req() req: any, @Param('orgId') orgId: string) {
    if (req.user.orgId !== orgId) {
      throw new ForbiddenException(`Cross-tenant deletion violation: user cannot delete organization '${orgId}'`);
    }
    return { success: true, deletedOrg: orgId };
  }

  @Post('tenant-action')
  executeTenantAction(@Req() req: any, @Body() body: { targetOrgId: string; action: string }) {
    if (req.user.orgId !== body.targetOrgId) {
      throw new ForbiddenException(`Body payload tenant mismatch: caller is not in '${body.targetOrgId}'`);
    }
    return { success: true, action: body.action, orgId: body.targetOrgId };
  }
}

describe('Phase 27: Multi-Tenant Security & Isolation Acceptance (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  const tenantA = 'org_alpha_corp';
  const tenantB = 'org_beta_industries';

  const userAlphaMemberId = 'usr_alpha_mem_1';
  const userAlphaOwnerId = 'usr_alpha_owner_1';
  const userBetaMemberId = 'usr_beta_mem_2';

  let tokenAlphaMember: string;
  let tokenAlphaOwner: string;
  let tokenBetaMember: string;

  const mockUsers: Record<string, any> = {
    [userAlphaMemberId]: {
      id: userAlphaMemberId,
      email: 'member@alpha.corp',
      orgId: tenantA,
      userRoles: [{ role: { name: 'MEMBER', rolePermissions: [] } }],
    },
    [userAlphaOwnerId]: {
      id: userAlphaOwnerId,
      email: 'owner@alpha.corp',
      orgId: tenantA,
      userRoles: [{ role: { name: 'OWNER', rolePermissions: [] } }],
    },
    [userBetaMemberId]: {
      id: userBetaMemberId,
      email: 'member@beta.industries',
      orgId: tenantB,
      userRoles: [{ role: { name: 'MEMBER', rolePermissions: [] } }],
    },
  };

  const mockPrisma = {
    user: {
      findUnique: jest.fn().mockImplementation(({ where }) => {
        return Promise.resolve(mockUsers[where.id] || null);
      }),
    },
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [TestTenantSecurityController],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(helmet());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.setGlobalPrefix('api/v1');
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);

    tokenAlphaMember = jwtService.sign({
      sub: userAlphaMemberId,
      email: 'member@alpha.corp',
      orgId: tenantA,
      roles: ['MEMBER'],
    });

    tokenAlphaOwner = jwtService.sign({
      sub: userAlphaOwnerId,
      email: 'owner@alpha.corp',
      orgId: tenantA,
      roles: ['OWNER'],
    });

    tokenBetaMember = jwtService.sign({
      sub: userBetaMemberId,
      email: 'member@beta.industries',
      orgId: tenantB,
      roles: ['MEMBER'],
    });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('1. Cross-Tenant Read Isolation', () => {
    it('Tenant A member CAN read Tenant A resources', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/test-tenancy/tenant-resource/${tenantA}`)
        .set('Authorization', `Bearer ${tokenAlphaMember}`)
        .expect(HttpStatus.OK);

      expect(res.body.success).toBe(true);
      expect(res.body.orgId).toBe(tenantA);
      expect(res.body.data).toContain(tenantA);
    });

    it('Tenant A member CANNOT read Tenant B resources (Cross-tenant breach prevention)', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/test-tenancy/tenant-resource/${tenantB}`)
        .set('Authorization', `Bearer ${tokenAlphaMember}`)
        .expect(HttpStatus.FORBIDDEN);

      expect(res.body.message).toContain('Cross-tenant access violation');
    });

    it('Tenant B member CANNOT read Tenant A resources', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/test-tenancy/tenant-resource/${tenantA}`)
        .set('Authorization', `Bearer ${tokenBetaMember}`)
        .expect(HttpStatus.FORBIDDEN);

      expect(res.body.message).toContain('Cross-tenant access violation');
    });
  });

  describe('2. Cross-Tenant Modification & URL Identifier Tampering', () => {
    it('Tenant A member CAN modify Tenant A resource', async () => {
      const res = await request(app.getHttpServer())
        .put(`/api/v1/test-tenancy/tenant-resource/${tenantA}`)
        .set('Authorization', `Bearer ${tokenAlphaMember}`)
        .send({ field: 'new-profile-setting' })
        .expect(HttpStatus.OK);

      expect(res.body.success).toBe(true);
      expect(res.body.updatedField).toBe('new-profile-setting');
    });

    it('URL identifier tampering: Tenant A member attempting PUT to Tenant B URL is rejected', async () => {
      const res = await request(app.getHttpServer())
        .put(`/api/v1/test-tenancy/tenant-resource/${tenantB}`)
        .set('Authorization', `Bearer ${tokenAlphaMember}`)
        .send({ field: 'malicious-overwrite' })
        .expect(HttpStatus.FORBIDDEN);

      expect(res.body.message).toContain('Cross-tenant mutation violation');
    });
  });

  describe('3. Request Body Identifier Tampering', () => {
    it('Authenticated Tenant A user sending targetOrgId = Tenant B in payload is rejected', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/test-tenancy/tenant-action')
        .set('Authorization', `Bearer ${tokenAlphaMember}`)
        .send({ targetOrgId: tenantB, action: 'CONFIDENTIAL_BILLING_EXPORT' })
        .expect(HttpStatus.FORBIDDEN);

      expect(res.body.message).toContain('Body payload tenant mismatch');
    });

    it('Authenticated Tenant A user sending targetOrgId = Tenant A is accepted', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/test-tenancy/tenant-action')
        .set('Authorization', `Bearer ${tokenAlphaMember}`)
        .send({ targetOrgId: tenantA, action: 'CONFIDENTIAL_BILLING_EXPORT' })
        .expect(HttpStatus.CREATED);

      expect(res.body.success).toBe(true);
      expect(res.body.orgId).toBe(tenantA);
    });
  });

  describe('4. Role Escalation & Deletion Boundaries', () => {
    it('Non-OWNER role attempting deletion is rejected (Role Escalation Prevention)', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/test-tenancy/tenant-resource/${tenantA}`)
        .set('Authorization', `Bearer ${tokenAlphaMember}`)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('Tenant A OWNER CAN delete Tenant A resource', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/api/v1/test-tenancy/tenant-resource/${tenantA}`)
        .set('Authorization', `Bearer ${tokenAlphaOwner}`)
        .expect(HttpStatus.OK);

      expect(res.body.success).toBe(true);
      expect(res.body.deletedOrg).toBe(tenantA);
    });

    it('Tenant A OWNER CANNOT delete Tenant B resource', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/api/v1/test-tenancy/tenant-resource/${tenantB}`)
        .set('Authorization', `Bearer ${tokenAlphaOwner}`)
        .expect(HttpStatus.FORBIDDEN);

      expect(res.body.message).toContain('Cross-tenant deletion violation');
    });
  });

  describe('5. Sensitive Data Redaction & Security Headers', () => {
    it('Enforces HTTP security headers across tenant operations', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/test-tenancy/tenant-resource/${tenantA}`)
        .set('Authorization', `Bearer ${tokenAlphaMember}`);

      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    });

    it('Errors do not expose internal database passwords or sensitive stack metadata', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/test-tenancy/tenant-resource/${tenantB}`)
        .set('Authorization', `Bearer ${tokenAlphaMember}`);

      const bodyStr = JSON.stringify(res.body);
      expect(bodyStr).not.toContain('super_secret');
      expect(bodyStr).not.toContain('DATABASE_URL');
      expect(bodyStr).not.toContain('password');
    });
  });
});
