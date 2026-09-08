import { Module, Global } from '@nestjs/common';
import { PushConfigService } from './push.config';
import { PushService } from './push.service';
import { PushDispatcherService } from './push-dispatcher.service';
import { PushController } from './push.controller';

@Global()
@Module({
  controllers: [PushController],
  providers: [PushConfigService, PushService, PushDispatcherService],
  exports: [PushConfigService, PushService, PushDispatcherService],
})
export class PushModule {}
