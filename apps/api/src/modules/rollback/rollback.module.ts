import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { RollbackEngineService } from './services/rollback-engine.service';
import { RollbackController } from './rollback.controller';

@Module({
  imports: [PrismaModule],
  controllers: [RollbackController],
  providers: [RollbackEngineService],
  exports: [RollbackEngineService],
})
export class RollbackModule {}
