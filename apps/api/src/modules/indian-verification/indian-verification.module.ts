import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { IndianVerificationService } from './services/indian-verification.service';
import { IndianVerificationController } from './indian-verification.controller';

@Module({
  imports: [PrismaModule],
  controllers: [IndianVerificationController],
  providers: [IndianVerificationService],
  exports: [IndianVerificationService],
})
export class IndianVerificationModule {}
