import { RollbackModule } from './modules/rollback/rollback.module';
import { CanaryModule } from './modules/canary/canary.module';
import { OperationsModule } from './modules/operations/operations.module';
import { AnalyticsEventsModule } from './modules/analytics-events/analytics-events.module';
import { FraudEngineModule } from './modules/fraud-engine/fraud-engine.module';
import { OcrModule } from './modules/ocr/ocr.module';
import { IndianVerificationModule } from './modules/indian-verification/indian-verification.module';
import { WhatsAppModule } from './modules/whatsapp/whatsapp.module';
import { GoogleMapsModule } from './modules/google-maps/google-maps.module';
import { StripeConnectModule } from './modules/stripe-connect/stripe-connect.module';
import { EdgeAiModule as EdgeAiModuleV2 } from './modules/edge-ai-v2/edge-ai.module';
import { AutonomousOpsModule } from './modules/autonomous-ops-v2/autonomous-ops.module';
import { DeveloperMarketplaceModule } from './modules/developer-marketplace/developer-marketplace.module';
import { AutonomousFinanceModule } from './modules/autonomous-finance/autonomous-finance.module';
import { CommerceGraphModule } from './modules/commerce-graph-v2/commerce-graph.module';
import { ProcurementHubModule } from './modules/procurement-hub/procurement-hub.module';
import { WorkforceAiModule } from './modules/workforce-ai-v2/workforce-ai.module';
import { SmartHomeIotModule } from './modules/smart-home-iot/smart-home-iot.module';
import { ClaimsAutomationModule } from './modules/claims-automation/claims-automation.module';
import { EmergencySosModule } from './modules/emergency-sos/emergency-sos.module';
import { FranchiseNetworkModule } from './modules/franchise-v2/franchise-network.module';
import { EdgeAiModule } from './modules/edge-ai/edge-ai.module';
import { AutonomousRecoveryModule } from './modules/autonomous-recovery/autonomous-recovery.module';
import { EnterpriseBiModule } from './modules/enterprise-bi/enterprise-bi.module';
import { ApiMarketplaceModule } from './modules/api-marketplace/api-marketplace.module';
import { SmartContractsModule } from './modules/smart-contracts/smart-contracts.module';
import { KnowledgeGraphModule } from './modules/knowledge-graph/knowledge-graph.module';
import { WorkforceModule } from './modules/workforce/workforce.module';
import { ProcurementModule } from './modules/procurement/procurement.module';
import { ProviderCrmModule } from './modules/provider-crm/provider-crm.module';
import { AdvertisingModule } from './modules/advertising/advertising.module';
import { LoyaltyModule } from './modules/loyalty/loyalty.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CustomersModule } from './modules/customers/customers.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { UsersModule } from './modules/users/users.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { RolesModule } from './modules/roles/roles.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { ServicesModule } from './modules/services/services.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { PayoutsModule } from './modules/payouts/payouts.module';
import { SupportTicketsModule } from './modules/tickets/tickets.module';
import { PlatformSettingsModule } from './modules/settings/settings.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { PrismaModule } from './prisma/prisma.module';
import { ThrottlerModule } from '@nestjs/throttler';

import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { EventsModule } from './modules/events/events.module';
import { PushModule } from './modules/push/push.module';
import { StorageModule } from './modules/storage/storage.module';
import { QueueModule } from './modules/queue/queue.module';
import { EmailModule } from './modules/email/email.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AiModule } from './modules/ai/ai.module';
import { ChatModule } from './modules/chat/chat.module';
import { ReferralModule } from './modules/referral/referral.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { GrowthModule } from './modules/growth/growth.module';
import { SuperAppModule } from './modules/superapp/superapp.module';
import { BusinessOsModule } from './modules/business-os/business-os.module';
import { DataIntelligenceModule } from './modules/data-intelligence/data-intelligence.module';
import { ObservabilityModule } from './modules/observability/observability.module';
import { IotModule } from './modules/iot/iot.module';
import { InsuranceModule } from './modules/insurance/insurance.module';
import { FranchiseModule } from './modules/franchise/franchise.module';
import { SupplyChainModule } from './modules/supply-chain/supply-chain.module';
import { GovernmentModule } from './modules/government/government.module';
import { AiAgentsModule } from './modules/ai-agents/ai-agents.module';
import { IdentityModule } from './modules/identity/identity.module';
import { SmartCityModule } from './modules/smart-city/smart-city.module';
import { CommerceIntelModule } from './modules/commerce-intel/commerce-intel.module';
import { AutoOpsModule } from './modules/auto-ops/auto-ops.module';
import { EdgeModule } from './modules/edge/edge.module';

@Module({
  imports: [
    RollbackModule,
    CanaryModule,
    OperationsModule,
    AnalyticsEventsModule,
    FraudEngineModule,
    OcrModule,
    IndianVerificationModule,
    WhatsAppModule,
    GoogleMapsModule,
    StripeConnectModule,
    EdgeAiModuleV2,
    AutonomousOpsModule,
    DeveloperMarketplaceModule,
    AutonomousFinanceModule,
    CommerceGraphModule,
    ProcurementHubModule,
    WorkforceAiModule,
    SmartHomeIotModule,
    ClaimsAutomationModule,
    EmergencySosModule,
    FranchiseNetworkModule,
    EdgeAiModule,
    AutonomousRecoveryModule,
    EnterpriseBiModule,
    ApiMarketplaceModule,
    SmartContractsModule,
    KnowledgeGraphModule,
    WorkforceModule,
    ProcurementModule,
    ProviderCrmModule,
    AdvertisingModule,
    LoyaltyModule,
    ConfigModule.forRoot({ isGlobal: true }),
    IotModule,
    InsuranceModule,
    FranchiseModule,
    SupplyChainModule,
    GovernmentModule,
    AiAgentsModule,
    IdentityModule,
    SmartCityModule,
    CommerceIntelModule,
    AutoOpsModule,
    EdgeModule,
    SuperAppModule,
    BusinessOsModule,
    DataIntelligenceModule,
    ObservabilityModule,
    AiModule,
    ChatModule,
    ReferralModule,
    WishlistModule,
    GrowthModule,
    EventsModule,
    PushModule,
    StorageModule,
    QueueModule,
    EmailModule,
    AnalyticsModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 50,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    CustomersModule,
    BookingsModule,
    UsersModule,
    ProvidersModule,
    PaymentsModule,
    RolesModule,
    CategoriesModule,
    ReviewsModule,
    PermissionsModule,
    ServicesModule,
    NotificationsModule,
    AdminModule,
    CouponsModule,
    PayoutsModule,
    SupportTicketsModule,
    PlatformSettingsModule,
    FavoritesModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
