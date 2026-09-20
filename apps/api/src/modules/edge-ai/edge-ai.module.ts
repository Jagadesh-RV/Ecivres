import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { EdgeInferenceService } from './services/edge-inference.service';
import { EdgeAiController } from './edge-ai.controller';

@Module({
  imports: [PrismaModule],
  controllers: [EdgeAiController],
  providers: [EdgeInferenceService],
  exports: [EdgeInferenceService],
})
export class EdgeAiModule {}
