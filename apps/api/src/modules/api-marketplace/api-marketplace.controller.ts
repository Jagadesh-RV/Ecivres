import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { SdkGeneratorService } from './services/sdk-generator.service';
import { RegisterApiAppDto } from './dto/register-api-app.dto';

@ApiTags('api-marketplace')
@Controller('api-marketplace')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ApiMarketplaceController {
  constructor(private readonly sdkService: SdkGeneratorService) {}

  @Post('apps')
  @ApiOperation({ summary: 'Register public API application & generate API Key' })
  async registerApp(@Body() dto: RegisterApiAppDto) {
    return this.sdkService.registerApp(dto.developerId, dto.name, dto.ratePlan);
  }

  @Get('apps/:id/sdk')
  @ApiOperation({ summary: 'Generate public TypeScript SDK bundle' })
  async getSdk(@Param('id') id: string) {
    return this.sdkService.generateSdkClient(id);
  }
}
