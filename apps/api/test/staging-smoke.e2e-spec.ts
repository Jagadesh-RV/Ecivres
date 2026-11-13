import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { SecurityHeadersMiddleware } from '../src/common/middleware/security-headers.middleware';
import helmet from 'helmet';

describe('Phase 28: Staging HTTP Smoke Tests & Security Headers (e2e)', () => {
  let app: INestApplication;

  const mockPrisma = {
    $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
    $queryRawUnsafe: jest.fn().mockResolvedValue([{ 1: 1 }]),
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
    user: {
      findUnique: jest.fn().mockResolvedValue(null),
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            frameAncestors: ["'none'"],
          },
        },
        frameguard: { action: 'deny' },
        noSniff: true,
      }),
    );
    app.use(new SecurityHeadersMiddleware().use);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('1. GET /health/live returns HTTP 200 with UP status and process metadata', async () => {
    const res = await request(app.getHttpServer())
      .get('/health/live')
      .expect(HttpStatus.OK);

    expect(res.body).toBeDefined();
    expect(res.body.status).toBe('UP');
    expect(res.body.uptimeSeconds).toBeGreaterThanOrEqual(0);
    expect(res.body.timestamp).toBeDefined();
  });

  it('2. GET /health/ready returns HTTP 200 with READY status for Kubernetes probe', async () => {
    const res = await request(app.getHttpServer())
      .get('/health/ready')
      .expect(HttpStatus.OK);

    expect(res.body).toBeDefined();
    expect(res.body.status).toBe('READY');
    expect(res.body.checks).toBeDefined();
    expect(res.body.checks.database.status).toBe('HEALTHY');
  });

  it('3. GET /health/connectivity returns HTTP 200 with verified database and redis metrics', async () => {
    const res = await request(app.getHttpServer())
      .get('/health/connectivity')
      .expect(HttpStatus.OK);

    expect(res.body).toBeDefined();
    expect(res.body.status).toBe('HEALTHY');
    expect(res.body.database.status).toBe('HEALTHY');
    expect(res.body.redis.status).toBe('CONNECTED');
  });

  it('4. Asserts presence of hardened DevSecOps security headers on HTTP responses', async () => {
    const res = await request(app.getHttpServer())
      .get('/health/live')
      .expect(HttpStatus.OK);

    expect(res.headers['x-frame-options']).toBe('DENY');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['permissions-policy']).toBe(
      'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(self)',
    );
    expect(res.headers['x-permitted-cross-domain-policies']).toBe('none');
  });

  it('5. GET /reliability/slos returns HTTP 200 with registered platform SLO workflows', async () => {
    const res = await request(app.getHttpServer())
      .get('/reliability/slos')
      .expect(HttpStatus.OK);

    expect(res.body).toBeDefined();
    expect(res.body.timestamp).toBeDefined();
    expect(Array.isArray(res.body.slos)).toBe(true);
    expect(res.body.slos.length).toBeGreaterThan(0);
  });
});
