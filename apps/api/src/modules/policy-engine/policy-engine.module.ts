import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { GuardrailValidatorService } from './services/guardrail-validator.service';
import { PolicyExecutorService } from './services/policy-executor.service';
import { PolicyEngineService } from './services/policy-engine.service';

@Module({
  imports: [PrismaModule],
  providers: [
    GuardrailValidatorService,
    PolicyExecutorService,
    PolicyEngineService,
  ],
  exports: [
    GuardrailValidatorService,
    PolicyExecutorService,
    PolicyEngineService,
  ],
})
export class PolicyEngineModule {}
