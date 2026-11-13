import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Phase 28: Infrastructure Runtime & Connectivity Probes (e2e)', () => {
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
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('1. GET /health/connectivity returns HTTP 200 with database and redis statuses', async () => {
    const res = await request(app.getHttpServer())
      .get('/health/connectivity')
      .expect(HttpStatus.OK);

    expect(res.body).toBeDefined();
    expect(res.body.status).toBe('HEALTHY');
    expect(res.body.database).toBeDefined();
    expect(res.body.database.status).toBe('HEALTHY');
    expect(typeof res.body.database.latencyMs).toBe('number');
    expect(res.body.redis).toBeDefined();
    expect(res.body.redis.status).toBe('CONNECTED');
    expect(res.body.timestamp).toBeDefined();
  });

  it('2. GET /health/live returns fast UP liveness probe', async () => {
    const res = await request(app.getHttpServer())
      .get('/health/live')
      .expect(HttpStatus.OK);

    expect(res.body.status).toBe('UP');
    expect(res.body.processId).toBeDefined();
    expect(typeof res.body.uptimeSeconds).toBe('number');
  });

  it('3. GET /health/ready returns HTTP 200 when database probe succeeds', async () => {
    const res = await request(app.getHttpServer())
      .get('/health/ready')
      .expect(HttpStatus.OK);

    expect(res.body.status).toBe('READY');
    expect(res.body.checks.database.status).toBe('HEALTHY');
  });
});
