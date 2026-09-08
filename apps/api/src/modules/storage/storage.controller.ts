import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { StorageService, PresignedUrlRequest } from './storage.service';

@ApiTags('storage')
@Controller('storage')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('presigned-url')
  @ApiOperation({ summary: 'Generate AWS S3 signed upload URL for profile/service images & documents' })
  async getPresignedUploadUrl(
    @CurrentUser() user: any,
    @Body() body: PresignedUrlRequest,
  ) {
    return this.storageService.generatePresignedUploadUrl(body, user.id);
  }
}
