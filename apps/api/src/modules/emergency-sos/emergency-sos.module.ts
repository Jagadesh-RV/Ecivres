import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PriorityDispatchService } from './services/priority-dispatch.service';
import { EmergencySosController } from './emergency-sos.controller';

@Module({
  imports: [PrismaModule],
  controllers: [EmergencySosController],
  providers: [PriorityDispatchService],
  exports: [PriorityDispatchService],
})
export class EmergencySosModule {}
