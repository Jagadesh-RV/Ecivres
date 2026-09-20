import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { WebhookDispatcherService } from './services/webhook-dispatcher.service';
import { RegisterWebhookDto } from './dto/register-webhook.dto';

@ApiTags('developer-marketplace')
@Controller('developer-marketplace')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DeveloperMarketplaceController {
  constructor(private readonly webhookService: WebhookDispatcherService) {}

  @Post('webhooks')
  @ApiOperation({ summary: 'Register developer event webhook subscription' })
  async registerWebhook(@Body() dto: RegisterWebhookDto) {
    return this.webhookService.registerWebhook(dto.appId, dto.targetUrl, dto.eventsJson);
  }

  @Get('apps/:id/usage')
  @ApiOperation({ summary: 'Get developer API usage & billing dashboard' })
  async getUsageDashboard(@Param('id') id: string) {
    return this.webhookService.getUsageDashboard(id);
  }
}
