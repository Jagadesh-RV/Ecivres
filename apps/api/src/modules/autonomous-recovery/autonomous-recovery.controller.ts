import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { K8sSelfHealingService } from './services/k8s-self-healing.service';
import { TriggerRecoveryDto } from './dto/trigger-recovery.dto';

@ApiTags('autonomous-recovery')
@Controller('autonomous-recovery')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AutonomousRecoveryController {
  constructor(private readonly recoveryService: K8sSelfHealingService) {}

  @Post('trigger')
  @ApiOperation({ summary: 'Trigger autonomous Kubernetes self-healing recovery' })
  async triggerRecovery(@Body() dto: TriggerRecoveryDto) {
    return this.recoveryService.triggerRecovery(dto.clusterName, dto.targetDeployment, dto.reason);
  }
}
