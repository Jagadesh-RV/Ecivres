import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, BadRequestException, ConflictException, ForbiddenException, HttpException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CircuitBreakerService } from '../trust-resilience/circuit-breaker.service';

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

describe('Phase 21: Autonomous Marketplace Ecosystem Master Test Suite', () => {
  let integrationRegistry: IntegrationRegistryService;
  let paymentAdapter: PaymentIntegrationAdapter;
  let notificationAdapter: NotificationIntegrationAdapter;
  let mappingAdapter: MappingIntegrationAdapter;
  let accountingAdapter: AccountingIntegrationAdapter;
  let webhookVerifier: WebhookVerifierService;
  let webhookIdempotency: WebhookIdempotencyService;
  let webhookIngestion: WebhookIngestionService;
  let webhookReconciliation: WebhookReconciliationService;
  let currencyMath: CurrencyMathService;
  let currencyConversion: CurrencyConversionService;
  let regionalMarket: RegionalMarketService;
  let regionalTax: RegionalTaxService;
  let regionalPolicyGuard: RegionalPolicyGuardService;
  let intelligence: EcosystemIntelligenceService;
  let provenance: DecisionProvenanceService;
  let partnerApi: PartnerApiService;
  let partnerRateLimiter: PartnerRateLimiterService;
  let partnerEventSubscription: PartnerEventSubscriptionService;

  const mockPrismaService = {
    partnerApiKey: {
      create: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
      findUnique: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
    },
    inboundWebhookEvent: {
      create: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
      findUnique: jest.fn().mockResolvedValue(null),
      findMany: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    marketplaceRegion: {
      findUnique: jest.fn().mockResolvedValue(null),
      upsert: jest.fn().mockImplementation((args) => Promise.resolve(args.create)),
    },
    exchangeRateRecord: {
      create: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
      findFirst: jest.fn().mockResolvedValue(null),
    },
    ecosystemIntelligenceSignal: {
      create: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
      findMany: jest.fn().mockResolvedValue([]),
    },
    externalIntegrationConfig: {
      findFirst: jest.fn().mockResolvedValue(null),
    },
  };

  const mockCircuitBreaker = {
    canExecute: jest.fn().mockReturnValue(true),
    recordSuccess: jest.fn(),
    recordFailure: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CircuitBreakerService, useValue: mockCircuitBreaker },
      ],
    }).compile();

    integrationRegistry = module.get<IntegrationRegistryService>(IntegrationRegistryService);
    paymentAdapter = module.get<PaymentIntegrationAdapter>(PaymentIntegrationAdapter);
    notificationAdapter = module.get<NotificationIntegrationAdapter>(NotificationIntegrationAdapter);
    mappingAdapter = module.get<MappingIntegrationAdapter>(MappingIntegrationAdapter);
    accountingAdapter = module.get<AccountingIntegrationAdapter>(AccountingIntegrationAdapter);
    webhookVerifier = module.get<WebhookVerifierService>(WebhookVerifierService);
    webhookIdempotency = module.get<WebhookIdempotencyService>(WebhookIdempotencyService);
    webhookIngestion = module.get<WebhookIngestionService>(WebhookIngestionService);
    webhookReconciliation = module.get<WebhookReconciliationService>(WebhookReconciliationService);
    currencyMath = module.get<CurrencyMathService>(CurrencyMathService);
    currencyConversion = module.get<CurrencyConversionService>(CurrencyConversionService);
    regionalMarket = module.get<RegionalMarketService>(RegionalMarketService);
    regionalTax = module.get<RegionalTaxService>(RegionalTaxService);
    regionalPolicyGuard = module.get<RegionalPolicyGuardService>(RegionalPolicyGuardService);
    intelligence = module.get<EcosystemIntelligenceService>(EcosystemIntelligenceService);
    provenance = module.get<DecisionProvenanceService>(DecisionProvenanceService);
    partnerApi = module.get<PartnerApiService>(PartnerApiService);
    partnerRateLimiter = module.get<PartnerRateLimiterService>(PartnerRateLimiterService);
    partnerEventSubscription = module.get<PartnerEventSubscriptionService>(PartnerEventSubscriptionService);
  });

  describe('1. Extensible Integration Framework & Adapters', () => {
    it('should execute payment intent creation, capture, and refund through payment adapter', async () => {
      const intent = await paymentAdapter.execute('create_intent', {
        amountCents: 5000,
        currency: 'USD',
        customerId: 'cus_123',
      });
      expect(intent.success).toBe(true);
      expect(intent.data.intentId).toBeDefined();
      expect(intent.data.status).toBe('REQUIRES_CAPTURE');

      const capture = await paymentAdapter.execute('capture_payment', {
        transactionId: intent.data.intentId,
      });
      expect(capture.success).toBe(true);
      expect(capture.data.status).toBe('SETTLED');

      const refund = await paymentAdapter.execute('refund_payment', {
        transactionId: intent.data.intentId,
        amountCents: 2000,
        reason: 'Customer requested partial refund',
      });
      expect(refund.success).toBe(true);
      expect(refund.data.amountRefundedCents).toBe(2000);
    });

    it('should execute communications relay for email and SMS through notification adapter', async () => {
      const email = await notificationAdapter.execute('send_email', {
        to: 'user@example.com',
        subject: 'Booking Confirmed',
        body: 'Your service appointment is scheduled.',
      });
      expect(email.success).toBe(true);
      expect(email.data.delivered).toBe(true);

      const sms = await notificationAdapter.execute('send_sms', {
        phoneNumber: '+15551234567',
        message: 'Your provider is on the way!',
      });
      expect(sms.success).toBe(true);
      expect(sms.data.recipient).toBe('+15551234567');
    });

    it('should geocode address and compute road distance through mapping adapter', async () => {
      const geo = await mappingAdapter.execute('geocode', { address: '123 Market St, San Francisco, CA' });
      expect(geo.success).toBe(true);
      expect(geo.data.coordinates.lat).toBeDefined();

      const dist = await mappingAdapter.execute('calculate_distance', {
        origin: { lat: 37.7749, lng: -122.4194 },
        destination: { lat: 37.8044, lng: -122.2712 },
      });
      expect(dist.success).toBe(true);
      expect(dist.data.distanceKm).toBeGreaterThan(0);
      expect(dist.data.estimatedDurationMins).toBeGreaterThan(0);
    });

    it('should synchronize invoices and ledger entries through accounting adapter', async () => {
      const invoice = await accountingAdapter.execute('sync_invoice', {
        bookingId: 'bkg_991',
        invoiceNumber: 'INV-2026-0042',
        totalAmountCents: 15000,
        taxAmountCents: 1275,
        currency: 'USD',
        customerName: 'Enterprise Client',
      });
      expect(invoice.success).toBe(true);
      expect(invoice.data.syncStatus).toBe('SYNCED');

      const ledger = await accountingAdapter.execute('sync_ledger', {
        referenceId: 'bkg_991',
        entryType: 'CREDIT',
        accountCode: 'REV-SERVICES',
        amountCents: 13725,
        currency: 'USD',
        description: 'Completed cleaning service revenue',
      });
      expect(ledger.success).toBe(true);
      expect(ledger.data.reconciled).toBe(true);
    });

    it('should monitor health across all registered adapters in registry', async () => {
      const healthList = await integrationRegistry.checkAllHealth();
      expect(healthList.length).toBeGreaterThanOrEqual(4);
      for (const h of healthList) {
        expect(h.status).toBe('HEALTHY');
        expect(h.latencyMs).toBeGreaterThan(0);
      }
    });
  });

  describe('2. Durable Webhook Ingestion & Reliability Engine', () => {
    it('should verify valid HMAC-SHA256 signature and reject tampered or expired signatures', () => {
      const secret = 'whsec_test_secret_12345';
      const payload = JSON.stringify({ event: 'payment.succeeded', id: 'evt_1' });
      const now = Math.floor(Date.now() / 1000);

      const validSig = webhookVerifier.computeSignature(payload, secret, now);
      const isOk = webhookVerifier.verifySignature(payload, validSig, secret, now);
      expect(isOk).toBe(true);

      const isBadSig = webhookVerifier.verifySignature(payload, 'deadbeef1234', secret, now);
      expect(isBadSig).toBe(false);

      // Replay outside 5-minute clock skew window
      const ancientTime = now - 600;
      expect(() => webhookVerifier.verifySignature(payload, validSig, secret, ancientTime)).toThrow(
        UnauthorizedException,
      );
    });

    it('should prevent replay attacks by detecting duplicate event deliveries', async () => {
      const provider = 'STRIPE';
      const eventId = 'evt_unique_1001';

      expect(await webhookIdempotency.isDuplicate(provider, eventId)).toBe(false);

      webhookIdempotency.recordProcessed(provider, eventId);
      expect(await webhookIdempotency.isDuplicate(provider, eventId)).toBe(true);
    });

    it('should acquire and release concurrency lock on webhook event processing', () => {
      const provider = 'RAZORPAY';
      const eventId = 'evt_race_2002';

      expect(webhookIdempotency.acquireLock(provider, eventId)).toBe(true);
      expect(() => webhookIdempotency.acquireLock(provider, eventId)).toThrow(ConflictException);

      webhookIdempotency.releaseLock(provider, eventId);
      expect(webhookIdempotency.acquireLock(provider, eventId)).toBe(true);
      webhookIdempotency.releaseLock(provider, eventId);
    });

    it('should ingest valid webhook, dispatch handler, and transition state to PROCESSED', async () => {
      const secret = 'whsec_platform_secret';
      const payload = { type: 'BOOKING_PAID', bookingId: 'bkg_123', amountCents: 8500 };
      const rawPayload = JSON.stringify(payload);
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = webhookVerifier.computeSignature(rawPayload, secret, timestamp);

      let handlerCalled = false;
      webhookIngestion.registerHandler('BOOKING_PAID', async (p) => {
        handlerCalled = true;
        expect(p.bookingId).toBe('bkg_123');
      });

      const res = await webhookIngestion.ingestWebhook(
        {
          provider: 'STRIPE',
          externalEventId: 'evt_stripe_live_55',
          signature,
          timestamp,
          payload,
        },
        secret,
      );

      expect(res.status).toBe('PROCESSED');
      expect(res.isDuplicate).toBe(false);
      expect(handlerCalled).toBe(true);

      // Subsequent identical delivery is caught as duplicate
      const dup = await webhookIngestion.ingestWebhook(
        {
          provider: 'STRIPE',
          externalEventId: 'evt_stripe_live_55',
          signature,
          timestamp,
          payload,
        },
        secret,
      );
      expect(dup.isDuplicate).toBe(true);
    });

    it('should calculate exponential retry delay with jitter and route to DEAD_LETTER after max retries', async () => {
      const delay1 = webhookIngestion.calculateRetryDelayMs(1, 1000, 60000);
      const delay3 = webhookIngestion.calculateRetryDelayMs(3, 1000, 60000);
      expect(delay3).toBeGreaterThan(delay1);

      // Simulate failing event ingestion
      const secret = 'whsec_secret';
      const payload = { type: 'FAILING_EVENT' };
      const signature = webhookVerifier.computeSignature(JSON.stringify(payload), secret, Math.floor(Date.now() / 1000));

      webhookIngestion.registerHandler('FAILING_EVENT', async () => {
        throw new Error('Downstream DB lock failure');
      });

      const failedIngest = await webhookIngestion.ingestWebhook(
        {
          provider: 'TWILIO',
          externalEventId: 'evt_twilio_fail_1',
          signature,
          timestamp: Math.floor(Date.now() / 1000),
          payload,
        },
        secret,
      );

      expect(failedIngest.status).toBe('FAILED');

      // Retry until DEAD_LETTER
      for (let i = 0; i < 4; i++) {
        await webhookIngestion.retryEvent(failedIngest.eventId);
      }
      const terminalStatus = await webhookIngestion.retryEvent(failedIngest.eventId);
      expect(terminalStatus).toBe('DEAD_LETTER');

      const deadLetters = webhookIngestion.getDeadLetterEvents();
      expect(deadLetters.some((e) => e.id === failedIngest.eventId)).toBe(true);
    });

    it('should reconcile pending webhooks against authoritative upstream provider state', async () => {
      const report = await webhookReconciliation.reconcilePendingEvents('STRIPE', 10);
      expect(report.timestamp).toBeDefined();
      expect(report.totalScanned).toBeDefined();
    });
  });

  describe('3. Regional Readiness, Currency Arithmetic & Taxation', () => {
    it('should perform exact minor-unit integer arithmetic and prevent floating-point inaccuracies', () => {
      const price1 = currencyMath.fromMajorUnits(19.99, 'USD'); // 1999 cents
      const price2 = currencyMath.fromMajorUnits(0.01, 'USD');   // 1 cent

      const sum = currencyMath.add(price1, price2);
      expect(sum.minorUnits).toBe(2000);
      expect(currencyMath.toMajorUnits(sum)).toBe(20.0);

      const diff = currencyMath.subtract(sum, price2);
      expect(diff.minorUnits).toBe(1999);
    });

    it('should respect currency decimal precision (USD=2, JPY=0, KWD=3)', () => {
      expect(currencyMath.getDecimals('USD')).toBe(2);
      expect(currencyMath.getDecimals('EUR')).toBe(2);
      expect(currencyMath.getDecimals('JPY')).toBe(0);
      expect(currencyMath.getDecimals('KWD')).toBe(3);

      const jpy = currencyMath.fromMajorUnits(5000, 'JPY');
      expect(jpy.minorUnits).toBe(5000);
      expect(currencyMath.toMajorUnits(jpy)).toBe(5000);
    });

    it('should proportionally distribute amounts without losing rounding remainders', () => {
      const tenDollars = currencyMath.fromMajorUnits(10.0, 'USD'); // 1000 cents
      // Split 3 ways equally: 333 + 333 + 333 = 999 (+1 cent remainder)
      const splits = currencyMath.distributeProportions(tenDollars, [1, 1, 1]);

      expect(splits.length).toBe(3);
      const totalMinor = splits.reduce((sum, s) => sum + s.minorUnits, 0);
      expect(totalMinor).toBe(1000); // 0 lost cents!
      expect(splits[0].minorUnits).toBe(334); // remainder went to first
      expect(splits[1].minorUnits).toBe(333);
      expect(splits[2].minorUnits).toBe(333);
    });

    it('should format money with localized symbols and currency conventions', () => {
      const usd = currencyMath.fromMajorUnits(1250.5, 'USD');
      expect(currencyMath.formatDisplay(usd, 'en-US')).toContain('$1,250.50');

      const inr = currencyMath.fromMajorUnits(25000, 'INR');
      expect(currencyMath.formatDisplay(inr, 'en-IN')).toContain('₹25,000.00');
    });

    it('should convert currencies using rate resolution and minor unit arithmetic', async () => {
      await currencyConversion.setExchangeRate('USD', 'EUR', 0.92, 24);

      const usdMoney = currencyMath.fromMajorUnits(100, 'USD'); // $100.00 = 10000 cents
      const converted = await currencyConversion.convert(usdMoney, 'EUR');

      expect(converted.converted.currency).toBe('EUR');
      expect(converted.exchangeRate).toBe(0.92);
      expect(converted.converted.minorUnits).toBe(9200); // €92.00
    });

    it('should retrieve regional marketplace configurations, format addresses, and validate postal codes', async () => {
      const regionUS = await regionalMarket.getRegion('US');
      expect(regionUS.currency).toBe('USD');
      expect(regionUS.taxType).toBe('SALES_TAX');

      const regionIN = await regionalMarket.getRegion('IN');
      expect(regionIN.currency).toBe('INR');
      expect(regionIN.taxType).toBe('GST');

      const formatted = regionalMarket.formatAddress('GB', {
        line1: '10 Downing St',
        city: 'London',
        postalCode: 'SW1A 2AA',
      });
      expect(formatted).toContain('United Kingdom');

      expect(regionalMarket.isValidPostalCode('US', '94103')).toBe(true);
      expect(regionalMarket.isValidPostalCode('US', 'INVALID')).toBe(false);
      expect(regionalMarket.isValidPostalCode('IN', '560001')).toBe(true);
      expect(regionalMarket.isValidPostalCode('IN', '123')).toBe(false);
    });

    it('should compute regional statutory taxes accurately (Sales Tax, GST, VAT)', async () => {
      // Germany VAT (19%) on €100.00 (10000 cents)
      const deTax = await regionalTax.calculateTax({
        regionCode: 'DE',
        subtotalMinorUnits: 10000,
        currency: 'EUR',
      });
      expect(deTax.taxType).toBe('VAT');
      expect(deTax.taxRatePercent).toBe(19.0);
      expect(deTax.taxMinorUnits).toBe(1900);
      expect(deTax.totalMinorUnits).toBe(11900);

      // India GST (18%) on ₹1000.00 (100000 paise)
      const inTax = await regionalTax.calculateTax({
        regionCode: 'IN',
        subtotalMinorUnits: 100000,
        currency: 'INR',
      });
      expect(inTax.taxType).toBe('GST');
      expect(inTax.taxMinorUnits).toBe(18000);
      expect(inTax.totalMinorUnits).toBe(118000);
    });

    it('should evaluate cancellation refunds according to regional consumer protection rules', async () => {
      // DE / GB strict statutory refund: 30 hours notice >= 24h window -> 100% refund
      const deRes = await regionalPolicyGuard.evaluateCancellation('DE', 10000, 'EUR', 30);
      expect(deRes.isEligibleForRefund).toBe(true);
      expect(deRes.refundPercentage).toBe(100);
      expect(deRes.refundAmountMinorUnits).toBe(10000);
      expect(deRes.feeMinorUnits).toBe(0);

      // Short notice (5h) -> 0% refund
      const lateRes = await regionalPolicyGuard.evaluateCancellation('DE', 10000, 'EUR', 5);
      expect(lateRes.isEligibleForRefund).toBe(false);
      expect(lateRes.refundPercentage).toBe(0);
      expect(lateRes.feeMinorUnits).toBe(10000);
    });
  });

  describe('4. Marketplace Intelligence, Decision Provenance & Quality', () => {
    it('should detect supply-demand imbalance and issue liquidity recommendations', async () => {
      // High demand deficit: 5 providers for 30 requests -> liquidity 0.17
      const deficit = await intelligence.detectSupplyDemandImbalance('US', 5, 30);
      expect(deficit.marketState).toBe('SEVERE_DEFICIT');
      expect(deficit.recommendation).toContain('provider incentive boost');

      // Healthy: 20 providers for 15 requests -> liquidity 1.33
      const healthy = await intelligence.detectSupplyDemandImbalance('US', 20, 15);
      expect(healthy.marketState).toBe('HEALTHY');
    });

    it('should detect pricing surge anomalies and enforce safety ceilings', async () => {
      // Exceeding 2.0x ceiling
      const gouge = await intelligence.detectPricingSurgeAnomaly('US', 2.8, 1.0, 2.0);
      expect(gouge.isAnomaly).toBe(true);
      expect(gouge.recommendation).toBe('CAP_TO_SAFE_CEILING');
      expect(gouge.cappedMultiplier).toBe(2.0);

      // Safe surge: 1.3x
      const safe = await intelligence.detectPricingSurgeAnomaly('US', 1.3, 1.0, 2.0);
      expect(safe.isAnomaly).toBe(false);
      expect(safe.recommendation).toBe('APPROVE');
      expect(safe.cappedMultiplier).toBe(1.3);
    });

    it('should classify evidence sufficiency and suppress autonomous mutation on small sample sizes', () => {
      // Small sample size (4) -> Insufficient
      const lowData = provenance.classifyEvidence('sig_test_1', 'PREDICTION', 4, 120, 'Pricing test');
      expect(lowData.isSufficientData).toBe(false);
      expect(lowData.businessRationale).toContain('INSUFFICIENT_DATA');

      // Large fresh sample size (50, 60s) -> Sufficient
      const validData = provenance.classifyEvidence('sig_test_2', 'STATISTICAL_ESTIMATE', 50, 60, 'High confidence');
      expect(validData.isSufficientData).toBe(true);
      expect(validData.sourceType).toBe('STATISTICAL_AGGREGATION');
    });

    it('should sanitize metadata to prevent leakage of internal prompts or weights', () => {
      const raw = {
        marketSegment: 'HOME_CLEANING',
        prompt: 'You are an internal pricing LLM...',
        systemInstruction: 'Do not disclose secrets',
        modelWeights: [0.12, 0.44],
        safeMetric: 42,
      };

      const clean = provenance.sanitizeEvidencePayload(raw);
      expect(clean.safeMetric).toBe(42);
      expect(clean.marketSegment).toBe('HOME_CLEANING');
      expect(clean.prompt).toBeUndefined();
      expect(clean.systemInstruction).toBeUndefined();
      expect(clean.modelWeights).toBeUndefined();
    });

    it('should track recommendation conversion rates and detect negative conversion drift', async () => {
      // 10 converted out of 100 = 10% vs baseline 22% -> > -50% drift
      const drift = await intelligence.evaluateRecommendationConversion('US', 100, 10, 0.22);
      expect(drift.isDrifting).toBe(true);
      expect(drift.driftPercentage).toBeLessThan(-20.0);
    });
  });

  describe('5. Partner Ecosystem APIs & Security Controls', () => {
    it('should create a hashed partner API key and return plaintext key exactly once', async () => {
      const created = await partnerApi.createApiKey({
        organizationId: 'org_acme_corp',
        keyName: 'Logistics Partner API',
        scopes: ['bookings:read', 'dispatch:write'],
        rateLimitPerMin: 60,
      });

      expect(created.keyId).toBeDefined();
      expect(created.keyPrefix).toMatch(/^ecv_live_/);
      expect(created.plaintextKey).toContain(created.keyPrefix);

      // Authenticate with generated key
      const auth = await partnerApi.authenticateKey(created.plaintextKey, 'bookings:read');
      expect(auth.organizationId).toBe('org_acme_corp');
      expect(auth.scopes).toContain('bookings:read');
    });

    it('should enforce scope authorization and reject keys lacking required scope', async () => {
      const created = await partnerApi.createApiKey({
        organizationId: 'org_beta_corp',
        keyName: 'Read-Only Partner',
        scopes: ['catalog:read'],
      });

      await expect(partnerApi.authenticateKey(created.plaintextKey, 'financials:payout')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should support credential rotation and immediate revocation', async () => {
      const key = await partnerApi.createApiKey({
        organizationId: 'org_gamma',
        keyName: 'Service Desk Key',
        scopes: ['support:write'],
      });

      const rotated = await partnerApi.rotateApiKey({
        keyId: key.keyId,
        reason: 'Quarterly rotation',
      });

      expect(rotated.keyId).not.toBe(key.keyId);

      // Old key must now be rejected
      await expect(partnerApi.authenticateKey(key.plaintextKey)).rejects.toThrow(UnauthorizedException);

      // New key must work
      const valid = await partnerApi.authenticateKey(rotated.plaintextKey, 'support:write');
      expect(valid.organizationId).toBe('org_gamma');
    });

    it('should enforce sliding-window rate limit and reject excessive traffic with HTTP 429', () => {
      const keyId = 'key_rate_test_99';
      partnerRateLimiter.resetLimit(keyId);

      // Allow 5 requests
      for (let i = 0; i < 5; i++) {
        const check = partnerRateLimiter.checkRateLimit(keyId, 5);
        expect(check.allowed).toBe(true);
      }

      // 6th request must throw 429
      expect(() => partnerRateLimiter.checkRateLimit(keyId, 5)).toThrow(HttpException);
    });

    it('should manage partner outbound webhook event subscriptions and dispatch signed payloads', async () => {
      partnerEventSubscription.subscribe('partner_fedex', 'https://webhook.fedex.com/events', 'sub_secret_998', [
        'booking.completed',
      ]);

      const dispatched = await partnerEventSubscription.dispatchEvent('booking.completed', {
        bookingId: 'bkg_dispatch_1',
        status: 'COMPLETED',
      });

      expect(dispatched.length).toBe(1);
      expect(dispatched[0].delivered).toBe(true);
      expect(dispatched[0].signature).toHaveLength(64); // SHA-256 hex
    });
  });
});
