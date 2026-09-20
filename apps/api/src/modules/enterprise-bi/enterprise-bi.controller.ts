import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CohortAnalyzerService } from './services/cohort-analyzer.service';
import { GenerateBiReportDto } from './dto/generate-report.dto';

@ApiTags('enterprise-bi')
@Controller('enterprise-bi')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EnterpriseBiController {
  constructor(private readonly biService: CohortAnalyzerService) {}

  @Post('reports')
  @ApiOperation({ summary: 'Generate executive BI cohort & revenue report' })
  async generateReport(@Body() dto: GenerateBiReportDto) {
    return this.biService.generateReport(dto.title, dto.type);
  }
}
