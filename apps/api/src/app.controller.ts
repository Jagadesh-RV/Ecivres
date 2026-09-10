import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    const memory = process.memoryUsage();
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'ecivres-api',
      uptimeSeconds: Math.floor(process.uptime()),
      database: 'connected',
      memory: {
        rssMb: Math.round(memory.rss / (1024 * 1024)),
        heapUsedMb: Math.round(memory.heapUsed / (1024 * 1024)),
      },
    };
  }

  @Get('healthz')
  getHealthz() {
    return { status: 'healthy' };
  }
}
