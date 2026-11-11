import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Real HTTP Marketplace Lifecycle & Security Boundaries (e2e)', () => {
  let app: INestApplication;

  const mockPrisma = {
    category: {
      findMany: jest.fn().mockResolvedValue([
        { id: 'cat_electrical', name: 'Electrical Services', slug: 'electrical' },
        { id: 'cat_plumbing', name: 'Plumbing & Heating', slug: 'plumbing' },
      ]),
    },
    user: {
      findUnique: jest.fn().mockResolvedValue(null),
    },
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. HTTP Probe: GET /health/live returns HTTP 200 and process status', async () => {
    const res = await request(app.getHttpServer())
      .get('/health/live')
      .expect(200);

    expect(res.body.status).toBe('UP');
    expect(res.body.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });

  it('2. Service Discovery: GET /categories returns public marketplace categories', async () => {
    const res = await request(app.getHttpServer())
      .get('/categories')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0].slug).toBe('electrical');
  });

  it('3. Security Boundary: POST /categories without JWT returns HTTP 401 Unauthorized', async () => {
    await request(app.getHttpServer())
      .post('/categories')
      .send({ name: 'Hacking Category', slug: 'hacked' })
      .expect(401);
  });

  it('4. Multi-Tenant Boundary: POST /enterprise-b2b/org without JWT returns HTTP 401 Unauthorized', async () => {
    await request(app.getHttpServer())
      .post('/enterprise-b2b/org')
      .send({ name: 'Unauthorized Corp' })
      .expect(401);
  });

  it('5. Input Validation: POST /auth/login with missing password returns HTTP 400 Bad Request', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'bad-request@test.com' })
      .expect(400);

    expect(res.body.message).toBeDefined();
  });

  it('6. Authentication Guard: POST /auth/login with invalid credentials returns HTTP 401 Unauthorized', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'nonexistent-user-12345@ecivres.local', password: 'WrongPassword999!' })
      .expect(401);
  });
});
