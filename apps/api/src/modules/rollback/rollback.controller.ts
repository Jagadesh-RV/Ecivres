import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { RollbackEngineService } from './services/rollback-engine.service';

@ApiTags('rollback')
@Controller('rollback')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RollbackController {
  constructor(private readonly rollbackService: RollbackEngineService) {}

  @Post('snapshot')
  @ApiOperation({ summary: 'Create pre-deployment baseline snapshot' })
  async createSnapshot(@Body() body: { releaseVersion: string; imageDigest: string }) {
    return this.rollbackService.createDeploymentSnapshot(body.releaseVersion, body.imageDigest);
  }

  @Post('execute')
  @ApiOperation({ summary: 'Execute emergency rollback procedure' })
  async executeRollback(@Body() body: { failedReleaseVersion: string; reason: string }) {
    await this.rollbackService.freezeRollout(body.failedReleaseVersion, body.reason);
    const restoreRes = await this.rollbackService.restorePreviousRelease(body.failedReleaseVersion);
    await this.rollbackService.shiftTrafficToStable(restoreRes.targetVersion);
    await this.rollbackService.logAutomatedRollbackIncident(body.failedReleaseVersion, body.reason);
    await this.rollbackService.notifyRollbackSlack(body.failedReleaseVersion, restoreRes.targetVersion);
    return this.rollbackService.verifyPostRollbackHealth(restoreRes.targetVersion);
  }
}
