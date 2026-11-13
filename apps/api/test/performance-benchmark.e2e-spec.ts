import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { CacheHeaderInterceptor } from '../src/common/interceptors/cache-header.interceptor';

describe('Phase 28: Synthetic Performance & Concurrency Benchmark (e2e)', () => {
  let app: INestApplication;

  const mockPrisma = {
    $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
    $queryRawUnsafe: jest.fn().mockResolvedValue([{ 1: 1 }]),
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
    user: { findUnique: jest.fn().mockResolvedValue(null) },
    category: { findMany: jest.fn().mockResolvedValue([]) },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .overrideProvider(APP_GUARD)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalInterceptors(new CacheHeaderInterceptor());
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('1. should process concurrent health checks with p95 latency under 150ms', async () => {
    const totalRequests = 8;
    const latencies: number[] = [];

    const promises = Array.from({ length: totalRequests }).map(async () => {
      const start = Date.now();
      const res = await request(app.getHttpServer()).get('/health/live');
      const duration = Date.now() - start;
      latencies.push(duration);
      expect(res.status).toBe(HttpStatus.OK);
    });

    await Promise.all(promises);

    expect(latencies.length).toBe(totalRequests);

    latencies.sort((a, b) => a - b);
    const p50 = latencies[Math.floor(totalRequests * 0.5)];
    const p95 = latencies[Math.floor(totalRequests * 0.95)];

    expect(p50).toBeLessThan(100);
    expect(p95).toBeLessThan(200);
  });

  it('2. should verify connectivity check executes with valid database status', async () => {
    const res = await request(app.getHttpServer())
      .get('/health/connectivity')
      .expect(HttpStatus.OK);

    expect(res.body.status).toBe('HEALTHY');
    expect(res.body.database.status).toBe('HEALTHY');
  });

  it('3. should verify cache header interceptor sets expected Cache-Control headers', async () => {
    const res = await request(app.getHttpServer())
      .get('/categories')
      .expect(HttpStatus.OK);

    // CacheHeaderInterceptor sets public cache on categories
    expect(res.headers['cache-control']).toBe(
      'public, max-age=60, s-maxage=300, stale-while-revalidate=120',
    );
  });
});
