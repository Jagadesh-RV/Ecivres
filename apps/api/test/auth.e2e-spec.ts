import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth & Identity (e2e)', () => {
  let app: INestApplication;
  
  const testEmail = `testuser-${Date.now()}@ecivres.local`;
  const testPassword = 'Password123!';
  let accessToken: string;
  let refreshToken: string;
  let userId: string;

  // In-memory mock store for isolated E2E execution
  const inMemoryStore = {
    users: new Map<string, any>(),
    refreshTokens: new Map<string, any>(),
    roles: new Map<string, any>(),
    customerProfiles: new Map<string, any>(),
  };

  const mockPrisma = {
    user: {
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.email) {
          for (const u of inMemoryStore.users.values()) {
            if (u.email === where.email) return Promise.resolve(u);
          }
        }
        if (where.id) {
          return Promise.resolve(inMemoryStore.users.get(where.id) || null);
        }
        return Promise.resolve(null);
      }),
      create: jest.fn().mockImplementation(({ data }) => {
        const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const user = {
          id,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
          userRoles: [],
          customerProfile: null,
          providerProfile: null,
        };
        inMemoryStore.users.set(id, user);
        return Promise.resolve(user);
      }),
      delete: jest.fn().mockImplementation(({ where }) => {
        inMemoryStore.users.delete(where.id);
        return Promise.resolve({ id: where.id });
      }),
    },
    role: {
      upsert: jest.fn().mockImplementation(({ where, create }) => {
        const role = { id: `role_${where.name}`, ...create };
        inMemoryStore.roles.set(where.name, role);
        return Promise.resolve(role);
      }),
    },
    refreshToken: {
      create: jest.fn().mockImplementation(({ data }) => {
        const id = `rt_${Date.now()}`;
        const rt = {
          id,
          ...data,
          user: inMemoryStore.users.get(data.userId) || { id: data.userId, email: testEmail },
        };
        inMemoryStore.refreshTokens.set(id, rt);
        return Promise.resolve(rt);
      }),
      findMany: jest.fn().mockImplementation(() => {
        return Promise.resolve(Array.from(inMemoryStore.refreshTokens.values()));
      }),
      delete: jest.fn().mockImplementation(({ where }) => {
        inMemoryStore.refreshTokens.delete(where.id);
        return Promise.resolve({ id: where.id });
      }),
      deleteMany: jest.fn().mockImplementation(() => {
        const count = inMemoryStore.refreshTokens.size;
        inMemoryStore.refreshTokens.clear();
        return Promise.resolve({ count });
      }),
    },
    userRole: {
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    customerProfile: {
      create: jest.fn().mockImplementation(({ data }) => {
        const profile = { id: `prof_${Date.now()}`, ...data };
        inMemoryStore.customerProfiles.set(data.userId, profile);
        return Promise.resolve(profile);
      }),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    providerProfile: {
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
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. POST /api/v1/auth/register', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ name: 'Test User', email: testEmail, password: testPassword })
      .expect(201);
    
    expect(res.body.user.email).toBe(testEmail);
    expect(res.body.access_token).toBeDefined();
    expect(res.body.refresh_token).toBeDefined();
    
    userId = res.body.user.id;
  });

  it('2. POST /api/v1/auth/login', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: testEmail, password: testPassword })
      .expect(200);
    
    expect(res.body.access_token).toBeDefined();
    expect(res.body.refresh_token).toBeDefined();
    
    accessToken = res.body.access_token;
    refreshToken = res.body.refresh_token;
  });

  it('3. GET /api/v1/users/me (using JWT)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
      
    expect(res.body.email).toBe(testEmail);
  });

  it('4. POST /api/v1/auth/logout', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/logout')
      .send({ refresh_token: refreshToken })
      .expect(200);
      
    expect(res.body.success).toBe(true);
  });
});
