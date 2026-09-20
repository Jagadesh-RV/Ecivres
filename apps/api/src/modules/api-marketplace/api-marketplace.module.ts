import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { SdkGeneratorService } from './services/sdk-generator.service';
import { ApiMarketplaceController } from './api-marketplace.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ApiMarketplaceController],
  providers: [SdkGeneratorService],
  exports: [SdkGeneratorService],
})
export class ApiMarketplaceModule {}
