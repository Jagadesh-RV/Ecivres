import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Controller, Get, UseGuards } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { Roles } from '../src/common/decorators/roles.decorator';
import { PermissionsGuard } from '../src/common/guards/permissions.guard';
import { Permissions } from '../src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard';
import { PrismaClient } from '@prisma/client';

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
  let prisma: PrismaClient;
  let adminToken: string;
  let customerToken: string;
  let adminId: string;
  let customerId: string;

  beforeAll(async () => {
    prisma = new PrismaClient();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [TestRbacController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // 1. Setup Admin User (has ADMIN role and read:test permission)
    const adminUser = await prisma.user.create({
      data: {
        email: `admin-test-${Date.now()}@ecivres.local`,
        password: 'hashedpassword',
      },
    });
    adminId = adminUser.id;

    const adminRole = await prisma.role.upsert({
      where: { name: 'ADMIN' },
      update: {},
      create: { name: 'ADMIN', description: 'Administrator' },
    });

    const readTestPermission = await prisma.permission.upsert({
      where: { name: 'read:test' },
      update: {},
      create: { name: 'read:test' },
    });

    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: readTestPermission.id } },
      create: { roleId: adminRole.id, permissionId: readTestPermission.id },
      update: {},
    });

    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
      create: { userId: adminUser.id, roleId: adminRole.id },
      update: {},
    });

    // 2. Setup Customer User (has CUSTOMER role, no permissions)
    const customerUser = await prisma.user.create({
      data: {
        email: `customer-test-${Date.now()}@ecivres.local`,
        password: 'hashedpassword',
      },
    });
    customerId = customerUser.id;

    const customerRole = await prisma.role.upsert({
      where: { name: 'CUSTOMER' },
      update: {},
      create: { name: 'CUSTOMER', description: 'Customer' },
    });

    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: customerUser.id, roleId: customerRole.id } },
      create: { userId: customerUser.id, roleId: customerRole.id },
      update: {},
    });

    // 3. Login to get tokens
    const adminLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: adminUser.email, password: 'hashedpassword' });
    // In our test we just mocked the password as 'hashedpassword' which won't work with bcrypt compare.
    // Instead we can generate tokens directly using AuthService
    const authService = app.get('AuthService');
    const adminTokenData = await authService.generateTokens(adminUser.id, adminUser.email, ['ADMIN']);
    adminToken = adminTokenData.data.accessToken;

    const customerTokenData = await authService.generateTokens(customerUser.id, customerUser.email, ['CUSTOMER']);
    customerToken = customerTokenData.data.accessToken;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.user.deleteMany({ where: { id: { in: [adminId, customerId] } } });
    await app.close();
    await prisma.$disconnect();
  });

  it('/test-rbac/admin-only (GET) - No JWT', () => {
    return request(app.getHttpServer())
      .get('/test-rbac/admin-only')
      .expect(401);
  });

  it('/test-rbac/admin-only (GET) - Valid JWT but wrong role (Customer)', () => {
    return request(app.getHttpServer())
      .get('/test-rbac/admin-only')
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(403);
  });

  it('/test-rbac/admin-only (GET) - Valid JWT and correct role (Admin)', () => {
    return request(app.getHttpServer())
      .get('/test-rbac/admin-only')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('/test-rbac/permission-only (GET) - Missing required permission (Customer)', () => {
    return request(app.getHttpServer())
      .get('/test-rbac/permission-only')
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(403);
  });

  it('/test-rbac/permission-only (GET) - Correct permission (Admin)', () => {
    return request(app.getHttpServer())
      .get('/test-rbac/permission-only')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });
});
