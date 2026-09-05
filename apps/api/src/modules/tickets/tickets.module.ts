import { Module } from '@nestjs/common';
import { SupportTicketsService } from './tickets.service';
import { SupportTicketsController } from './tickets.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SupportTicketsController],
  providers: [SupportTicketsService],
  exports: [SupportTicketsService],
})
export class SupportTicketsModule {}
