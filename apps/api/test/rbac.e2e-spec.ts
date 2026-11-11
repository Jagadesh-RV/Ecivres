import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Controller, Get, UseGuards } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { Roles } from '../src/common/decorators/roles.decorator';
import { PermissionsGuard } from '../src/common/guards/permissions.guard';
import { Permissions } from '../src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Controller('test-rbac')
class TestRbacController {
  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  adminOnly() {
    return { success: true };
  }

  @Get('permission-only')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('read:test')
  permissionOnly() {
    return { success: true };
  }
}

describe('RBAC & Permissions (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let customerToken: string;
  const adminId = 'usr_admin_mock_1';
  const customerId = 'usr_customer_mock_2';

  const mockPrisma = {
    user: {
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.id === adminId) {
          return Promise.resolve({
            id: adminId,
            email: 'admin@ecivres.local',
            userRoles: [
              {
                role: {
                  name: 'ADMIN',
                  rolePermissions: [
                    { permission: { name: 'read:test' } },
                  ],
                },
              },
            ],
          });
        }
        if (where.id === customerId) {
          return Promise.resolve({
            id: customerId,
            email: 'customer@ecivres.local',
            userRoles: [
              {
                role: {
                  name: 'CUSTOMER',
                  rolePermissions: [],
                },
              },
            ],
          });
        }
        return Promise.resolve(null);
      }),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [TestRbacController],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const jwtService = app.get(JwtService);
    adminToken = jwtService.sign({ email: 'admin@ecivres.local', sub: adminId });
    customerToken = jwtService.sign({ email: 'customer@ecivres.local', sub: customerId });
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. /test-rbac/admin-only (GET) - No JWT returns 401', () => {
    return request(app.getHttpServer())
      .get('/test-rbac/admin-only')
      .expect(401);
  });

  it('2. /test-rbac/admin-only (GET) - Valid JWT but wrong role (Customer) returns 403', () => {
    return request(app.getHttpServer())
      .get('/test-rbac/admin-only')
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(403);
  });

  it('3. /test-rbac/admin-only (GET) - Valid JWT and correct role (Admin) returns 200', () => {
    return request(app.getHttpServer())
      .get('/test-rbac/admin-only')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('4. /test-rbac/permission-only (GET) - Missing required permission (Customer) returns 403', () => {
    return request(app.getHttpServer())
      .get('/test-rbac/permission-only')
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(403);
  });

  it('5. /test-rbac/permission-only (GET) - Has required permission (Admin) returns 200', () => {
    return request(app.getHttpServer())
      .get('/test-rbac/permission-only')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });
});
