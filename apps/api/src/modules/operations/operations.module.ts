import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MarketplaceOperationsService } from './services/marketplace-operations.service';
import { OperationsController } from './operations.controller';

@Module({
  imports: [PrismaModule],
  controllers: [OperationsController],
  providers: [MarketplaceOperationsService],
  exports: [MarketplaceOperationsService],
})
export class OperationsModule {}
