import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });

    it('should return status ok on health check probe', () => {
      const health = appController.getHealth();
      expect(health.status).toEqual('ok');
      expect(health.service).toEqual('ecivres-api');
    });

    it('should return healthy on healthz probe', () => {
      expect(appController.getHealthz()).toEqual({ status: 'healthy' });
    });
  });
});
