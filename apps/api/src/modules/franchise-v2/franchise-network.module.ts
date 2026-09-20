import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { FranchiseNetworkService } from './services/franchise-network.service';
import { FranchiseNetworkController } from './franchise-network.controller';

@Module({
  imports: [PrismaModule],
  controllers: [FranchiseNetworkController],
  providers: [FranchiseNetworkService],
  exports: [FranchiseNetworkService],
})
export class FranchiseNetworkModule {}
