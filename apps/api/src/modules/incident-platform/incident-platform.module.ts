import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { IncidentGovernanceService } from './services/incident-governance.service';
import { IncidentPlatformController } from './incident-platform.controller';

@Module({
  imports: [PrismaModule],
  controllers: [IncidentPlatformController],
  providers: [IncidentGovernanceService],
  exports: [IncidentGovernanceService],
})
export class IncidentPlatformModule {}
