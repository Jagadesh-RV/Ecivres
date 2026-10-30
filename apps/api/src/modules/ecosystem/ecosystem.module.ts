import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TrustResilienceModule } from '../trust-resilience/trust-resilience.module';

// Adapters
import { PaymentIntegrationAdapter } from './adapters/payment-integration.adapter';
import { NotificationIntegrationAdapter } from './adapters/notification-integration.adapter';
import { MappingIntegrationAdapter } from './adapters/mapping-integration.adapter';
import { AccountingIntegrationAdapter } from './adapters/accounting-integration.adapter';

// Services
import { IntegrationRegistryService } from './services/integration-registry.service';
import { WebhookVerifierService } from './services/webhook-verifier.service';
import { WebhookIdempotencyService } from './services/webhook-idempotency.service';
import { WebhookIngestionService } from './services/webhook-ingestion.service';
import { WebhookReconciliationService } from './services/webhook-reconciliation.service';
import { CurrencyMathService } from './services/currency-math.service';
import { CurrencyConversionService } from './services/currency-conversion.service';
import { RegionalMarketService } from './services/regional-market.service';
import { RegionalTaxService } from './services/regional-tax.service';
import { RegionalPolicyGuardService } from './services/regional-policy-guard.service';
import { EcosystemIntelligenceService } from './services/ecosystem-intelligence.service';
import { DecisionProvenanceService } from './services/decision-provenance.service';
import { PartnerApiService } from './services/partner-api.service';
import { PartnerRateLimiterService } from './services/partner-rate-limiter.service';
import { PartnerEventSubscriptionService } from './services/partner-event-subscription.service';

// Guards
import { PartnerAuthGuard } from './guards/partner-auth.guard';

// Controller
import { EcosystemController } from './ecosystem.controller';

@Module({
  imports: [PrismaModule, TrustResilienceModule],
  controllers: [EcosystemController],
  providers: [
    PaymentIntegrationAdapter,
    NotificationIntegrationAdapter,
    MappingIntegrationAdapter,
    AccountingIntegrationAdapter,
    IntegrationRegistryService,
    WebhookVerifierService,
    WebhookIdempotencyService,
    WebhookIngestionService,
    WebhookReconciliationService,
    CurrencyMathService,
    CurrencyConversionService,
    RegionalMarketService,
    RegionalTaxService,
    RegionalPolicyGuardService,
    EcosystemIntelligenceService,
    DecisionProvenanceService,
    PartnerApiService,
    PartnerRateLimiterService,
    PartnerEventSubscriptionService,
    PartnerAuthGuard,
  ],
  exports: [
    IntegrationRegistryService,
    WebhookIngestionService,
    WebhookReconciliationService,
    CurrencyMathService,
    CurrencyConversionService,
    RegionalMarketService,
    RegionalTaxService,
    RegionalPolicyGuardService,
    EcosystemIntelligenceService,
    DecisionProvenanceService,
    PartnerApiService,
    PartnerRateLimiterService,
    PartnerEventSubscriptionService,
  ],
})
export class EcosystemModule {}
