import { Module } from '@nestjs/common';
import { SuperAppService } from './superapp.service';
import { SuperAppController } from './superapp.controller';

@Module({
  controllers: [SuperAppController],
  providers: [SuperAppService],
  exports: [SuperAppService],
})
export class SuperAppModule {}
