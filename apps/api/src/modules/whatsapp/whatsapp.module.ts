import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { WhatsAppMessagingService } from './services/whatsapp-messaging.service';
import { WhatsAppController } from './whatsapp.controller';

@Module({
  imports: [PrismaModule],
  controllers: [WhatsAppController],
  providers: [WhatsAppMessagingService],
  exports: [WhatsAppMessagingService],
})
export class WhatsAppModule {}
