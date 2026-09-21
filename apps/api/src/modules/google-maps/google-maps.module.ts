import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { GoogleMapsService } from './services/google-maps.service';
import { GoogleMapsController } from './google-maps.controller';

@Module({
  imports: [PrismaModule],
  controllers: [GoogleMapsController],
  providers: [GoogleMapsService],
  exports: [GoogleMapsService],
})
export class GoogleMapsModule {}
