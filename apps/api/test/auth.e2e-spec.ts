import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth & Identity (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  
  const testEmail = `testuser-${Date.now()}@ecivres.local`;
  const testPassword = 'Password123!';
  let accessToken: string;
  let refreshToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    // Cleanup
    if (userId) {
      await prisma.refreshToken.deleteMany({ where: { userId } });
      await prisma.userRole.deleteMany({ where: { userId } });
      await prisma.customerProfile.deleteMany({ where: { userId } });
      await prisma.providerProfile.deleteMany({ where: { userId } });
      await prisma.user.delete({ where: { id: userId } });
    }
    await app.close();
    await prisma.$disconnect();
  });

  it('1. POST /api/v1/auth/register', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: testEmail, password: testPassword })
      .expect(201);
    
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testEmail);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    
    userId = res.body.data.user.id;
  });

  it('2. POST /api/v1/auth/login', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: testEmail, password: testPassword })
      .expect(200);
    
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    
    accessToken = res.body.data.accessToken;
    refreshToken = res.body.data.refreshToken;
  });

  it('3. GET /api/v1/users/me (using JWT)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
      
    expect(res.body.email).toBe(testEmail);
  });

  it('4. POST /api/v1/users/profiles/customer (create customer profile)', async () => {
    // Ensure CUSTOMER role exists
    await prisma.role.upsert({
      where: { name: 'CUSTOMER' },
      update: { description: 'Customer Role' },
      create: { name: 'CUSTOMER', description: 'Customer Role' }
    });

    const res = await request(app.getHttpServer())
      .post('/api/v1/users/profiles/customer')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ firstName: 'John', lastName: 'Doe', phone: '1234567890' })
      .expect(201);
      
    expect(res.body.firstName).toBe('John');
  });

  it('5. POST /api/v1/auth/refresh (rotate tokens)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refresh_token: refreshToken })
      .expect(201);
      
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.refreshToken).not.toBe(refreshToken);
    
    // Update tokens for logout
    accessToken = res.body.data.accessToken;
    refreshToken = res.body.data.refreshToken;
  });

  it('6. POST /api/v1/auth/logout', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/logout')
      .send({ refresh_token: refreshToken })
      .expect(201);
      
    // Verify refresh token is deleted
    const dbTokens = await prisma.refreshToken.findMany({ where: { userId } });
    expect(dbTokens.length).toBe(0);
  });
});
