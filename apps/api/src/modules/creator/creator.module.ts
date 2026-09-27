import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CreatorProfileService } from './services/creator-profile.service';
import { CreatorController } from './creator.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CreatorController],
  providers: [CreatorProfileService],
  exports: [CreatorProfileService],
})
export class CreatorModule {}
