import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Refresh Token Rotation & Session Revocation (e2e)', () => {
  let app: INestApplication;

  const mockPrisma = {
    refreshToken: {
      findMany: jest.fn().mockResolvedValue([]),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
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

  it('1. POST /auth/refresh with unmapped token returns HTTP 401 Unauthorized', async () => {
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refresh_token: 'invalid_malformed_token_string' })
      .expect(401);
  });

  it('2. POST /auth/logout with unmapped token returns HTTP 200 OK (idempotent)', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/logout')
      .send({ refresh_token: 'invalid_malformed_token_string' })
      .expect(200);

    expect(res.body.success).toBe(true);
  });

  it('3. POST /auth/revoke-all without Bearer JWT returns HTTP 401 Unauthorized', async () => {
    await request(app.getHttpServer())
      .post('/auth/revoke-all')
      .expect(401);
  });
});
