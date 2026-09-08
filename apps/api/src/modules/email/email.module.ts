import { Module, Global } from '@nestjs/common';
import { EmailConfigService } from './email.config';
import { EmailService } from './email.service';

@Global()
@Module({
  providers: [EmailConfigService, EmailService],
  exports: [EmailConfigService, EmailService],
})
export class EmailModule {}
