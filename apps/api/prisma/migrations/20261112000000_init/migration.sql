-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('PENDING', 'COMPLETED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ViralReferralStatus" AS ENUM ('PENDING', 'QUALIFIED', 'REWARDED', 'REJECTED_FRAUD');

-- CreateEnum
CREATE TYPE "AnomalySeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AnomalyStatus" AS ENUM ('DETECTED', 'ACKNOWLEDGED', 'INVESTIGATING', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED', 'EXECUTED', 'FAILED');

-- CreateEnum
CREATE TYPE "EvaluationCategory" AS ENUM ('CORRECTNESS', 'SAFETY', 'HALLUCINATION', 'TOOL_USAGE', 'AUTHORIZATION', 'POLICY_COMPLIANCE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "CustomerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "description" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "referredUserId" TEXT,
    "code" TEXT NOT NULL,
    "status" "ReferralStatus" NOT NULL DEFAULT 'PENDING',
    "rewardAmount" DOUBLE PRECISION NOT NULL DEFAULT 15.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "redeemedAt" TIMESTAMP(3),

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "healthScore" DOUBLE PRECISION NOT NULL DEFAULT 100.0,
    "status" TEXT NOT NULL DEFAULT 'ONLINE',
    "lastHeartbeatAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceClaim" (
    "id" TEXT NOT NULL,
    "claimId" TEXT NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "estimatedCost" DOUBLE PRECISION NOT NULL,
    "approvedCost" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "filedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsuranceClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FranchiseBranch" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "franchiseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "territoryCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FranchiseBranch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierPO" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ISSUED',
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierPO_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LicenseVerification" (
    "id" TEXT NOT NULL,
    "verificationId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "licenseType" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LicenseVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerifiableCredential" (
    "id" TEXT NOT NULL,
    "credentialId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credentialType" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerifiableCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmartCityRequest" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "municipalityId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmartCityRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentReport" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'WARNING',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "remediatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncidentReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EdgeWorkerRoute" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "regionCode" TEXT NOT NULL,
    "originUrl" TEXT NOT NULL,
    "edgeUrl" TEXT NOT NULL,
    "latencyMs" INTEGER NOT NULL DEFAULT 15,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EdgeWorkerRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoyaltyAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'BRONZE',
    "points" INTEGER NOT NULL DEFAULT 0,
    "cashbackBalance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "referralCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoyaltyAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdCampaign" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bidCpc" DOUBLE PRECISION NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerCrmRecord" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "leadScore" INTEGER NOT NULL DEFAULT 50,
    "notes" TEXT,
    "nextFollowUpAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerCrmRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcurementContract" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "vendorName" TEXT NOT NULL,
    "totalBudget" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING_APPROVAL',
    "approvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcurementContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkforceShift" (
    "id" TEXT NOT NULL,
    "shiftId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "overtimeHours" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkforceShift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeGraphEdge" (
    "id" TEXT NOT NULL,
    "edgeId" TEXT NOT NULL,
    "sourceEntity" TEXT NOT NULL,
    "targetEntity" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KnowledgeGraphEdge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmartContractEscrow" (
    "id" TEXT NOT NULL,
    "escrowId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "milestone" TEXT NOT NULL,
    "isReleased" BOOLEAN NOT NULL DEFAULT false,
    "disputeStatus" TEXT NOT NULL DEFAULT 'NONE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmartContractEscrow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiMarketplaceApp" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "developerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "ratePlan" TEXT NOT NULL DEFAULT 'FREE',
    "monthlyRequests" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiMarketplaceApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiAnalyticsReport" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "metricsJson" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BiAnalyticsReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutonomousRecoveryAction" (
    "id" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "clusterName" TEXT NOT NULL,
    "targetDeployment" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUCCESS',
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutonomousRecoveryAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EdgeInferenceCache" (
    "id" TEXT NOT NULL,
    "cacheId" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "modelKey" TEXT NOT NULL,
    "latencyMs" INTEGER NOT NULL DEFAULT 8,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EdgeInferenceCache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FranchiseNetwork" (
    "id" TEXT NOT NULL,
    "networkId" TEXT NOT NULL,
    "regionCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "royaltyRate" DOUBLE PRECISION NOT NULL DEFAULT 0.08,
    "activeBranches" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FranchiseNetwork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergencySosBooking" (
    "id" TEXT NOT NULL,
    "sosId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "serviceCategory" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "priorityScore" INTEGER NOT NULL DEFAULT 100,
    "status" TEXT NOT NULL DEFAULT 'DISPATCHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmergencySosBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceDamageClaim" (
    "id" TEXT NOT NULL,
    "damageClaimId" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "assessedAmount" DOUBLE PRECISION NOT NULL,
    "coverageValid" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'UNDER_REVIEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsuranceDamageClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmartHomeDevice" (
    "id" TEXT NOT NULL,
    "smartDeviceId" TEXT NOT NULL,
    "homeId" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "telemetryTopic" TEXT NOT NULL,
    "lastStatus" TEXT NOT NULL DEFAULT 'HEALTHY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmartHomeDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkforceSchedule" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "aiOptimized" BOOLEAN NOT NULL DEFAULT true,
    "totalShiftHours" DOUBLE PRECISION NOT NULL DEFAULT 160.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkforceSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcurementPurchaseRequest" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "itemDescription" TEXT NOT NULL,
    "estimatedCost" DOUBLE PRECISION NOT NULL,
    "approvalLevel" TEXT NOT NULL DEFAULT 'MANAGER',
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcurementPurchaseRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommerceGraphNode" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "propertiesJson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommerceGraphNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutonomousSettlement" (
    "id" TEXT NOT NULL,
    "settlementId" TEXT NOT NULL,
    "escrowId" TEXT NOT NULL,
    "grossAmount" DOUBLE PRECISION NOT NULL,
    "platformFee" DOUBLE PRECISION NOT NULL,
    "netPayout" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SETTLED',
    "settledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutonomousSettlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeveloperWebhook" (
    "id" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "eventsJson" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeveloperWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpsScalingAction" (
    "id" TEXT NOT NULL,
    "scalingId" TEXT NOT NULL,
    "clusterId" TEXT NOT NULL,
    "targetReplicas" INTEGER NOT NULL,
    "triggerMetric" TEXT NOT NULL,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OpsScalingAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EdgeOfflineInference" (
    "id" TEXT NOT NULL,
    "inferenceId" TEXT NOT NULL,
    "edgeNodeId" TEXT NOT NULL,
    "inputHash" TEXT NOT NULL,
    "outputJson" TEXT NOT NULL,
    "latencyMs" INTEGER NOT NULL DEFAULT 5,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EdgeOfflineInference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeConnectAccount" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "stripeAccountId" TEXT NOT NULL,
    "onboardingUrl" TEXT,
    "payoutsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "detailsSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeConnectAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndianVerificationRecord" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "aadhaarHash" TEXT,
    "panNumber" TEXT,
    "gstin" TEXT,
    "businessLicenseNo" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndianVerificationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OcrExtractedDocument" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "extractedText" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.95,
    "status" TEXT NOT NULL DEFAULT 'PARSED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OcrExtractedDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FraudRiskScore" (
    "id" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "behavioralScore" INTEGER NOT NULL DEFAULT 0,
    "anomalyDetected" BOOLEAN NOT NULL DEFAULT false,
    "fakeReviewRisk" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FraudRiskScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceAnalyticsEvent" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "userId" TEXT,
    "payloadJson" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketplaceAnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperationsIncident" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "slaBreached" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OperationsIncident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralTreeRecord" (
    "id" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "refereeId" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,
    "qrCodeUrl" TEXT,
    "status" "ViralReferralStatus" NOT NULL DEFAULT 'PENDING',
    "rewardAmountUsd" DOUBLE PRECISION NOT NULL DEFAULT 15.0,
    "rewardEarnedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReferralTreeRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountryRecord" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "currencySymbol" TEXT NOT NULL,
    "defaultLanguage" TEXT NOT NULL DEFAULT 'en',
    "isRtl" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "taxType" TEXT NOT NULL DEFAULT 'VAT',
    "taxRatePercent" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CountryRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcquisitionRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmContent" TEXT,
    "referrerUrl" TEXT,
    "referralCode" TEXT,
    "firstSearchAt" TIMESTAMP(3),
    "firstBookingAt" TIMESTAMP(3),
    "firstPaymentAt" TIMESTAMP(3),
    "acquisitionCost" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcquisitionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketingCampaign" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "discountType" TEXT NOT NULL,
    "discountValue" DOUBLE PRECISION NOT NULL,
    "minOrderValue" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "maxDiscount" DOUBLE PRECISION,
    "totalBudget" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "spentBudget" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "maxRedemptions" INTEGER NOT NULL DEFAULT 1000,
    "redemptionCount" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "targetCategory" TEXT,
    "targetCountry" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignRedemption" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookingId" TEXT,
    "discounted" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampaignRedemption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbandonedEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "metadataJson" TEXT,
    "recovered" BOOLEAN NOT NULL DEFAULT false,
    "recoveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AbandonedEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefundPolicyRecord" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cancellationHours" INTEGER NOT NULL DEFAULT 24,
    "refundPercentage" DOUBLE PRECISION NOT NULL DEFAULT 100.0,
    "feeDeductionUsd" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefundPolicyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperimentRecord" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "variantsJson" TEXT NOT NULL,
    "trafficPct" DOUBLE PRECISION NOT NULL DEFAULT 100.0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperimentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreferenceRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookingAlerts" BOOLEAN NOT NULL DEFAULT true,
    "paymentAlerts" BOOLEAN NOT NULL DEFAULT true,
    "marketingPromotions" BOOLEAN NOT NULL DEFAULT true,
    "securityAlerts" BOOLEAN NOT NULL DEFAULT true,
    "supportUpdates" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationPreferenceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceEvent" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'system',
    "region" TEXT,
    "category" TEXT,
    "userId" TEXT,
    "providerId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketplaceEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anomaly" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" "AnomalySeverity" NOT NULL,
    "region" TEXT,
    "category" TEXT,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "evidence" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "recommendedAction" TEXT NOT NULL,
    "status" "AnomalyStatus" NOT NULL DEFAULT 'DETECTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Anomaly_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "supportingMetrics" JSONB NOT NULL,
    "affectedArea" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.85,
    "expectedImpactUsd" DOUBLE PRECISION,
    "risk" "AnomalySeverity" NOT NULL DEFAULT 'LOW',
    "recommendedAction" TEXT NOT NULL,
    "approvalRequired" BOOLEAN NOT NULL DEFAULT true,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationPolicy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "triggerEvent" TEXT NOT NULL,
    "conditionRules" JSONB NOT NULL,
    "actionType" TEXT NOT NULL,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT true,
    "maxExecutionFrequencyMs" INTEGER NOT NULL DEFAULT 60000,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AutomationPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationExecution" (
    "id" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "triggerContext" JSONB NOT NULL,
    "actionTaken" TEXT NOT NULL,
    "authorizationRole" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutomationExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalRequest" (
    "id" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "context" JSONB NOT NULL,
    "riskLevel" "AnomalySeverity" NOT NULL DEFAULT 'MEDIUM',
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "reviewReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApprovalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecisionAudit" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorType" TEXT NOT NULL,
    "inputContext" JSONB NOT NULL,
    "policyName" TEXT NOT NULL,
    "recommendationId" TEXT,
    "decision" TEXT NOT NULL,
    "actionTaken" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "rollbackInfo" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DecisionAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AISession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionType" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "promptVersion" TEXT NOT NULL,
    "context" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AISession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIEvaluation" (
    "id" TEXT NOT NULL,
    "inputContext" JSONB NOT NULL,
    "expectedResult" JSONB NOT NULL,
    "actualResult" JSONB NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "evaluatorId" TEXT NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "promptVersion" TEXT NOT NULL,
    "category" "EvaluationCategory" NOT NULL,
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskSignal" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "riskType" TEXT NOT NULL,
    "riskScore" DOUBLE PRECISION NOT NULL,
    "signals" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapacitySnapshot" (
    "id" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "availableSlots" INTEGER NOT NULL,
    "bookedSlots" INTEGER NOT NULL,
    "utilizationPct" DOUBLE PRECISION NOT NULL,
    "responseTimeAvgSec" DOUBLE PRECISION NOT NULL,
    "activeProvidersCount" INTEGER NOT NULL,
    "snapshotTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CapacitySnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecisionContextRecord" (
    "id" TEXT NOT NULL,
    "correlationId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "market" TEXT NOT NULL DEFAULT 'GLOBAL',
    "region" TEXT NOT NULL DEFAULT 'GLOBAL',
    "category" TEXT,
    "signals" JSONB NOT NULL,
    "features" JSONB NOT NULL,
    "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DecisionContextRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceDecision" (
    "id" TEXT NOT NULL,
    "decisionType" TEXT NOT NULL,
    "correlationId" TEXT NOT NULL,
    "contextId" TEXT,
    "candidateActions" JSONB NOT NULL,
    "selectedAction" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "expectedImpact" JSONB NOT NULL,
    "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
    "approvalRequired" BOOLEAN NOT NULL DEFAULT false,
    "approvalId" TEXT,
    "explanation" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'GENERATED',
    "executedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketplaceDecision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemandRevenueForecast" (
    "id" TEXT NOT NULL,
    "forecastType" TEXT NOT NULL,
    "targetHorizon" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'GLOBAL',
    "category" TEXT,
    "expectedValue" DOUBLE PRECISION NOT NULL,
    "lowerBound" DOUBLE PRECISION NOT NULL,
    "upperBound" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'EXPONENTIAL_SMOOTHING',
    "inputMetadata" JSONB NOT NULL,
    "explanation" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemandRevenueForecast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScenarioSimulation" (
    "id" TEXT NOT NULL,
    "scenarioName" TEXT NOT NULL,
    "baselineContext" JSONB NOT NULL,
    "adjustedParams" JSONB NOT NULL,
    "projectedMetrics" JSONB NOT NULL,
    "deltaPct" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
    "simulatedBy" TEXT NOT NULL DEFAULT 'SYSTEM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScenarioSimulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentDefinition" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "purpose" TEXT NOT NULL,
    "allowedTools" TEXT[],
    "allowedActions" TEXT[],
    "forbiddenActions" TEXT[],
    "requiredPermissions" TEXT[],
    "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentExecution" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "correlationId" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RUNNING',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "AgentExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentExecutionStep" (
    "id" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "toolName" TEXT NOT NULL,
    "inputPayload" JSONB NOT NULL,
    "outputResult" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentExecutionStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentToolPermission" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "toolName" TEXT NOT NULL,
    "permission" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
    "isAllowed" BOOLEAN NOT NULL DEFAULT true,
    "requiresReview" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AgentToolPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiEvaluationMetric" (
    "id" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "evalType" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "sampleCount" INTEGER NOT NULL,
    "evalContext" JSONB NOT NULL,
    "evaluatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiEvaluationMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecisionAuditRecord" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "inputSnapshot" JSONB NOT NULL,
    "outputResult" JSONB NOT NULL,
    "approvalState" TEXT NOT NULL DEFAULT 'APPROVED',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DecisionAuditRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutonomousDecisionLog" (
    "id" TEXT NOT NULL,
    "decisionType" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'GLOBAL',
    "recommendedAction" TEXT NOT NULL,
    "expectedImpact" TEXT NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,
    "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
    "status" TEXT NOT NULL DEFAULT 'GENERATED',
    "reasoning" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AutonomousDecisionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatIfSimulation" (
    "id" TEXT NOT NULL,
    "scenarioType" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'GLOBAL',
    "category" TEXT,
    "parameterChangePct" DOUBLE PRECISION NOT NULL,
    "gmvDeltaPct" DOUBLE PRECISION NOT NULL,
    "revenueDeltaPct" DOUBLE PRECISION NOT NULL,
    "conversionImpactPct" DOUBLE PRECISION NOT NULL,
    "providerEarningsDeltaPct" DOUBLE PRECISION NOT NULL,
    "riskAssessment" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhatIfSimulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeploymentSnapshot" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "releaseVersion" TEXT NOT NULL,
    "imageDigest" TEXT NOT NULL,
    "activeStatus" TEXT NOT NULL DEFAULT 'STABLE_BASELINE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeploymentSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClosedLoopExecution" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "idempotencyKey" TEXT NOT NULL,
    "targetEntity" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "compensationPayload" JSONB,
    "executedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "tenantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClosedLoopExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionCatalogRecord" (
    "id" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
    "maxMonetaryLimit" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "requiredRole" TEXT NOT NULL DEFAULT 'ADMIN',
    "requiredPermission" TEXT NOT NULL,
    "approvalLevelRequired" INTEGER NOT NULL DEFAULT 1,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "compensationSupported" BOOLEAN NOT NULL DEFAULT false,
    "parametersSchema" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActionCatalogRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecisionOutcomeRecord" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "metricName" TEXT NOT NULL,
    "expectedValue" DOUBLE PRECISION NOT NULL,
    "actualValue" DOUBLE PRECISION NOT NULL,
    "deltaValue" DOUBLE PRECISION NOT NULL,
    "deltaPercentage" DOUBLE PRECISION NOT NULL,
    "measurementWindow" TEXT NOT NULL DEFAULT '24h',
    "measuredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0.95,

    CONSTRAINT "DecisionOutcomeRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecisionEffectivenessLog" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "executionStatus" TEXT NOT NULL,
    "businessEffectiveness" TEXT NOT NULL,
    "overallRoi" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "attributionScore" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "evaluationSummary" TEXT NOT NULL,
    "evaluatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DecisionEffectivenessLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperimentationRecord" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "controlVariant" JSONB NOT NULL,
    "testVariants" JSONB NOT NULL,
    "trafficSplit" JSONB NOT NULL,
    "targetMetrics" JSONB NOT NULL,
    "errorGuardrailThreshold" DOUBLE PRECISION NOT NULL DEFAULT 0.05,
    "winningVariant" TEXT,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperimentationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptimizationRunLog" (
    "id" TEXT NOT NULL,
    "objectiveName" TEXT NOT NULL,
    "constraints" JSONB NOT NULL,
    "initialValue" DOUBLE PRECISION NOT NULL,
    "optimizedValue" DOUBLE PRECISION NOT NULL,
    "improvementPercentage" DOUBLE PRECISION NOT NULL,
    "parametersApplied" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OptimizationRunLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentLearningFeedback" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "feedbackType" TEXT NOT NULL,
    "accuracyScore" DOUBLE PRECISION NOT NULL,
    "falsePositive" BOOLEAN NOT NULL DEFAULT false,
    "falseNegative" BOOLEAN NOT NULL DEFAULT false,
    "impactScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentLearningFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriftDetectionRecord" (
    "id" TEXT NOT NULL,
    "metricName" TEXT NOT NULL,
    "featureName" TEXT NOT NULL,
    "baselineValue" DOUBLE PRECISION NOT NULL,
    "currentValue" DOUBLE PRECISION NOT NULL,
    "driftScore" DOUBLE PRECISION NOT NULL,
    "isDriftDetected" BOOLEAN NOT NULL DEFAULT false,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DriftDetectionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GovernanceLifecycleRecord" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "previousState" TEXT NOT NULL,
    "currentState" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GovernanceLifecycleRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KillSwitchLog" (
    "id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "scopeId" TEXT,
    "triggerReason" TEXT NOT NULL,
    "triggeredBy" TEXT NOT NULL,
    "isEmergency" BOOLEAN NOT NULL DEFAULT true,
    "activatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deactivatedAt" TIMESTAMP(3),

    CONSTRAINT "KillSwitchLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceTrustIncident" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'GLOBAL',
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "incidentType" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0.85,
    "evidenceSignals" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DETECTED',
    "reviewerId" TEXT,
    "reviewNotes" TEXT,
    "appealNotes" TEXT,
    "requiresHumanReview" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketplaceTrustIncident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecisionExplanationRecord" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'GLOBAL',
    "businessSummary" TEXT NOT NULL,
    "initiatingEvent" TEXT NOT NULL,
    "affectedResource" TEXT NOT NULL,
    "policyApplied" TEXT NOT NULL,
    "policyVersion" TEXT NOT NULL DEFAULT 'v1.0',
    "autonomyLevel" INTEGER NOT NULL DEFAULT 3,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0.9,
    "selectedAction" TEXT NOT NULL,
    "alternativesConsidered" JSONB NOT NULL,
    "keyEvidenceSignals" JSONB NOT NULL,
    "tradeoffAnalysis" TEXT NOT NULL,
    "humanApprovalObtained" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DecisionExplanationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CircuitBreakerStateRecord" (
    "id" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'CLOSED',
    "failureCount" INTEGER NOT NULL DEFAULT 0,
    "successCount" INTEGER NOT NULL DEFAULT 0,
    "failureThreshold" INTEGER NOT NULL DEFAULT 5,
    "recoveryTimeMs" INTEGER NOT NULL DEFAULT 30000,
    "lastFailureAt" TIMESTAMP(3),
    "lastSuccessAt" TIMESTAMP(3),
    "lastStateChangeAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CircuitBreakerStateRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelfHealingLoopBreakerRecord" (
    "id" TEXT NOT NULL,
    "remediationKey" TEXT NOT NULL,
    "incidentCount" INTEGER NOT NULL DEFAULT 1,
    "maxAllowedPerHour" INTEGER NOT NULL DEFAULT 5,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "lastRemediatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstRemediatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SelfHealingLoopBreakerRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplacePolicy" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'GLOBAL',
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "rulesConfig" JSONB NOT NULL,
    "authorId" TEXT NOT NULL,
    "approverId" TEXT,
    "effectiveFrom" TIMESTAMP(3),
    "effectiveUntil" TIMESTAMP(3),
    "rollbackVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketplacePolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImmutableAuditLog" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'GLOBAL',
    "actorId" TEXT NOT NULL,
    "actorRole" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetResource" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "previousHash" TEXT NOT NULL,
    "entryHash" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "ipAddress" TEXT,
    "correlationId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUCCESS',
    "failureReason" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImmutableAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnterpriseOrganization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'ENTERPRISE',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnterpriseOrganization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationMember" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "permissions" JSONB,
    "invitedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataPrivacyRequest" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'GLOBAL',
    "userId" TEXT NOT NULL,
    "requestType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "processedBy" TEXT,
    "exportUrl" TEXT,
    "exemptionReason" TEXT,
    "rejectionReason" TEXT,
    "metadata" JSONB,

    CONSTRAINT "DataPrivacyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataRetentionPolicy" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'GLOBAL',
    "category" TEXT NOT NULL,
    "retentionDays" INTEGER NOT NULL,
    "action" TEXT NOT NULL DEFAULT 'ARCHIVE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataRetentionPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerApiKey" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "keyName" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "keyPrefix" TEXT NOT NULL,
    "scopes" JSONB NOT NULL,
    "rateLimitPerMin" INTEGER NOT NULL DEFAULT 60,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "revokedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalIntegrationConfig" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'GLOBAL',
    "providerType" TEXT NOT NULL,
    "providerName" TEXT NOT NULL,
    "credentialsEncrypted" TEXT NOT NULL,
    "settings" JSONB,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "timeoutMs" INTEGER NOT NULL DEFAULT 5000,
    "retryLimit" INTEGER NOT NULL DEFAULT 3,
    "lastHealthCheckAt" TIMESTAMP(3),
    "healthStatus" TEXT NOT NULL DEFAULT 'HEALTHY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalIntegrationConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InboundWebhookEvent" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'GLOBAL',
    "provider" TEXT NOT NULL,
    "externalEventId" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 5,
    "lastError" TEXT,
    "processedAt" TIMESTAMP(3),
    "reconciledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InboundWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceRegion" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "currencySymbol" TEXT NOT NULL,
    "defaultLocale" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "taxType" TEXT NOT NULL,
    "defaultTaxRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "supportedGateways" JSONB NOT NULL,
    "cancellationWindowHours" INTEGER NOT NULL DEFAULT 24,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketplaceRegion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeRateRecord" (
    "id" TEXT NOT NULL,
    "fromCurrency" TEXT NOT NULL,
    "toCurrency" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "provider" TEXT NOT NULL,
    "effectiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExchangeRateRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EcosystemIntelligenceSignal" (
    "id" TEXT NOT NULL,
    "regionCode" TEXT NOT NULL,
    "metricType" TEXT NOT NULL,
    "signalType" TEXT NOT NULL,
    "observedValue" DOUBLE PRECISION NOT NULL,
    "baselineValue" DOUBLE PRECISION,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "evidenceJson" JSONB,
    "metadata" JSONB,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EcosystemIntelligenceSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceLevelObjectiveRecord" (
    "id" TEXT NOT NULL,
    "workflowName" TEXT NOT NULL,
    "targetAvailability" DOUBLE PRECISION NOT NULL DEFAULT 99.9,
    "currentAvailability" DOUBLE PRECISION NOT NULL DEFAULT 100.0,
    "latencyTargetMs" INTEGER NOT NULL DEFAULT 250,
    "p95LatencyMs" INTEGER NOT NULL DEFAULT 50,
    "errorBudgetRemainingPercent" DOUBLE PRECISION NOT NULL DEFAULT 100.0,
    "burnRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "budgetStatus" TEXT NOT NULL DEFAULT 'HEALTHY',
    "totalEvents" INTEGER NOT NULL DEFAULT 0,
    "failedEvents" INTEGER NOT NULL DEFAULT 0,
    "windowDays" INTEGER NOT NULL DEFAULT 30,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceLevelObjectiveRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelfHealingExecutionAudit" (
    "id" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "triggerReason" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "targetComponent" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'EXECUTED',
    "loopBreakerCount" INTEGER NOT NULL DEFAULT 1,
    "durationMs" INTEGER NOT NULL DEFAULT 0,
    "details" TEXT,
    "operatorAttribution" TEXT,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SelfHealingExecutionAudit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProfile_userId_key" ON "CustomerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderProfile_userId_key" ON "ProviderProfile"("userId");

-- CreateIndex
CREATE INDEX "ProviderProfile_isVerified_idx" ON "ProviderProfile"("isVerified");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Booking_customerId_status_idx" ON "Booking"("customerId", "status");

-- CreateIndex
CREATE INDEX "Booking_serviceId_status_idx" ON "Booking"("serviceId", "status");

-- CreateIndex
CREATE INDEX "Booking_scheduledAt_idx" ON "Booking"("scheduledAt");

-- CreateIndex
CREATE INDEX "Booking_status_scheduledAt_idx" ON "Booking"("status", "scheduledAt");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_bookingId_key" ON "Payment"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_bookingId_key" ON "Review"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_code_key" ON "Referral"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Device_deviceId_key" ON "Device"("deviceId");

-- CreateIndex
CREATE INDEX "Device_ownerId_idx" ON "Device"("ownerId");

-- CreateIndex
CREATE INDEX "Device_status_idx" ON "Device"("status");

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceClaim_claimId_key" ON "InsuranceClaim"("claimId");

-- CreateIndex
CREATE INDEX "InsuranceClaim_providerId_idx" ON "InsuranceClaim"("providerId");

-- CreateIndex
CREATE INDEX "InsuranceClaim_status_idx" ON "InsuranceClaim"("status");

-- CreateIndex
CREATE UNIQUE INDEX "FranchiseBranch_branchId_key" ON "FranchiseBranch"("branchId");

-- CreateIndex
CREATE INDEX "FranchiseBranch_franchiseId_idx" ON "FranchiseBranch"("franchiseId");

-- CreateIndex
CREATE INDEX "FranchiseBranch_territoryCode_idx" ON "FranchiseBranch"("territoryCode");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierPO_orderId_key" ON "SupplierPO"("orderId");

-- CreateIndex
CREATE INDEX "SupplierPO_supplierId_idx" ON "SupplierPO"("supplierId");

-- CreateIndex
CREATE INDEX "SupplierPO_status_idx" ON "SupplierPO"("status");

-- CreateIndex
CREATE UNIQUE INDEX "LicenseVerification_verificationId_key" ON "LicenseVerification"("verificationId");

-- CreateIndex
CREATE INDEX "LicenseVerification_providerId_idx" ON "LicenseVerification"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "VerifiableCredential_credentialId_key" ON "VerifiableCredential"("credentialId");

-- CreateIndex
CREATE INDEX "VerifiableCredential_userId_idx" ON "VerifiableCredential"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SmartCityRequest_requestId_key" ON "SmartCityRequest"("requestId");

-- CreateIndex
CREATE INDEX "SmartCityRequest_municipalityId_idx" ON "SmartCityRequest"("municipalityId");

-- CreateIndex
CREATE INDEX "SmartCityRequest_status_idx" ON "SmartCityRequest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "IncidentReport_incidentId_key" ON "IncidentReport"("incidentId");

-- CreateIndex
CREATE INDEX "IncidentReport_serviceName_idx" ON "IncidentReport"("serviceName");

-- CreateIndex
CREATE INDEX "IncidentReport_status_idx" ON "IncidentReport"("status");

-- CreateIndex
CREATE UNIQUE INDEX "EdgeWorkerRoute_routeId_key" ON "EdgeWorkerRoute"("routeId");

-- CreateIndex
CREATE INDEX "EdgeWorkerRoute_regionCode_idx" ON "EdgeWorkerRoute"("regionCode");

-- CreateIndex
CREATE UNIQUE INDEX "LoyaltyAccount_userId_key" ON "LoyaltyAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LoyaltyAccount_referralCode_key" ON "LoyaltyAccount"("referralCode");

-- CreateIndex
CREATE INDEX "LoyaltyAccount_tier_idx" ON "LoyaltyAccount"("tier");

-- CreateIndex
CREATE UNIQUE INDEX "AdCampaign_campaignId_key" ON "AdCampaign"("campaignId");

-- CreateIndex
CREATE INDEX "AdCampaign_providerId_idx" ON "AdCampaign"("providerId");

-- CreateIndex
CREATE INDEX "AdCampaign_status_idx" ON "AdCampaign"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerCrmRecord_recordId_key" ON "CustomerCrmRecord"("recordId");

-- CreateIndex
CREATE INDEX "CustomerCrmRecord_providerId_customerId_idx" ON "CustomerCrmRecord"("providerId", "customerId");

-- CreateIndex
CREATE UNIQUE INDEX "ProcurementContract_contractId_key" ON "ProcurementContract"("contractId");

-- CreateIndex
CREATE INDEX "ProcurementContract_organizationId_idx" ON "ProcurementContract"("organizationId");

-- CreateIndex
CREATE INDEX "ProcurementContract_status_idx" ON "ProcurementContract"("status");

-- CreateIndex
CREATE UNIQUE INDEX "WorkforceShift_shiftId_key" ON "WorkforceShift"("shiftId");

-- CreateIndex
CREATE INDEX "WorkforceShift_organizationId_staffId_idx" ON "WorkforceShift"("organizationId", "staffId");

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeGraphEdge_edgeId_key" ON "KnowledgeGraphEdge"("edgeId");

-- CreateIndex
CREATE INDEX "KnowledgeGraphEdge_sourceEntity_targetEntity_idx" ON "KnowledgeGraphEdge"("sourceEntity", "targetEntity");

-- CreateIndex
CREATE UNIQUE INDEX "SmartContractEscrow_escrowId_key" ON "SmartContractEscrow"("escrowId");

-- CreateIndex
CREATE UNIQUE INDEX "SmartContractEscrow_bookingId_key" ON "SmartContractEscrow"("bookingId");

-- CreateIndex
CREATE INDEX "SmartContractEscrow_isReleased_idx" ON "SmartContractEscrow"("isReleased");

-- CreateIndex
CREATE UNIQUE INDEX "ApiMarketplaceApp_appId_key" ON "ApiMarketplaceApp"("appId");

-- CreateIndex
CREATE UNIQUE INDEX "ApiMarketplaceApp_apiKey_key" ON "ApiMarketplaceApp"("apiKey");

-- CreateIndex
CREATE INDEX "ApiMarketplaceApp_developerId_idx" ON "ApiMarketplaceApp"("developerId");

-- CreateIndex
CREATE UNIQUE INDEX "BiAnalyticsReport_reportId_key" ON "BiAnalyticsReport"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "AutonomousRecoveryAction_actionId_key" ON "AutonomousRecoveryAction"("actionId");

-- CreateIndex
CREATE INDEX "AutonomousRecoveryAction_clusterName_idx" ON "AutonomousRecoveryAction"("clusterName");

-- CreateIndex
CREATE UNIQUE INDEX "EdgeInferenceCache_cacheId_key" ON "EdgeInferenceCache"("cacheId");

-- CreateIndex
CREATE INDEX "EdgeInferenceCache_region_modelKey_idx" ON "EdgeInferenceCache"("region", "modelKey");

-- CreateIndex
CREATE UNIQUE INDEX "FranchiseNetwork_networkId_key" ON "FranchiseNetwork"("networkId");

-- CreateIndex
CREATE INDEX "FranchiseNetwork_regionCode_idx" ON "FranchiseNetwork"("regionCode");

-- CreateIndex
CREATE UNIQUE INDEX "EmergencySosBooking_sosId_key" ON "EmergencySosBooking"("sosId");

-- CreateIndex
CREATE INDEX "EmergencySosBooking_customerId_idx" ON "EmergencySosBooking"("customerId");

-- CreateIndex
CREATE INDEX "EmergencySosBooking_status_idx" ON "EmergencySosBooking"("status");

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceDamageClaim_damageClaimId_key" ON "InsuranceDamageClaim"("damageClaimId");

-- CreateIndex
CREATE INDEX "InsuranceDamageClaim_policyId_idx" ON "InsuranceDamageClaim"("policyId");

-- CreateIndex
CREATE UNIQUE INDEX "SmartHomeDevice_smartDeviceId_key" ON "SmartHomeDevice"("smartDeviceId");

-- CreateIndex
CREATE INDEX "SmartHomeDevice_homeId_idx" ON "SmartHomeDevice"("homeId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkforceSchedule_scheduleId_key" ON "WorkforceSchedule"("scheduleId");

-- CreateIndex
CREATE INDEX "WorkforceSchedule_organizationId_idx" ON "WorkforceSchedule"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "ProcurementPurchaseRequest_requestId_key" ON "ProcurementPurchaseRequest"("requestId");

-- CreateIndex
CREATE INDEX "ProcurementPurchaseRequest_organizationId_idx" ON "ProcurementPurchaseRequest"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "CommerceGraphNode_nodeId_key" ON "CommerceGraphNode"("nodeId");

-- CreateIndex
CREATE INDEX "CommerceGraphNode_entityType_idx" ON "CommerceGraphNode"("entityType");

-- CreateIndex
CREATE UNIQUE INDEX "AutonomousSettlement_settlementId_key" ON "AutonomousSettlement"("settlementId");

-- CreateIndex
CREATE INDEX "AutonomousSettlement_escrowId_idx" ON "AutonomousSettlement"("escrowId");

-- CreateIndex
CREATE UNIQUE INDEX "DeveloperWebhook_webhookId_key" ON "DeveloperWebhook"("webhookId");

-- CreateIndex
CREATE INDEX "DeveloperWebhook_appId_idx" ON "DeveloperWebhook"("appId");

-- CreateIndex
CREATE UNIQUE INDEX "OpsScalingAction_scalingId_key" ON "OpsScalingAction"("scalingId");

-- CreateIndex
CREATE INDEX "OpsScalingAction_clusterId_idx" ON "OpsScalingAction"("clusterId");

-- CreateIndex
CREATE UNIQUE INDEX "EdgeOfflineInference_inferenceId_key" ON "EdgeOfflineInference"("inferenceId");

-- CreateIndex
CREATE INDEX "EdgeOfflineInference_edgeNodeId_idx" ON "EdgeOfflineInference"("edgeNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeConnectAccount_providerId_key" ON "StripeConnectAccount"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeConnectAccount_stripeAccountId_key" ON "StripeConnectAccount"("stripeAccountId");

-- CreateIndex
CREATE INDEX "StripeConnectAccount_providerId_idx" ON "StripeConnectAccount"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "IndianVerificationRecord_providerId_key" ON "IndianVerificationRecord"("providerId");

-- CreateIndex
CREATE INDEX "IndianVerificationRecord_providerId_idx" ON "IndianVerificationRecord"("providerId");

-- CreateIndex
CREATE INDEX "IndianVerificationRecord_verificationStatus_idx" ON "IndianVerificationRecord"("verificationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "OcrExtractedDocument_documentId_key" ON "OcrExtractedDocument"("documentId");

-- CreateIndex
CREATE INDEX "OcrExtractedDocument_userId_idx" ON "OcrExtractedDocument"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FraudRiskScore_targetId_key" ON "FraudRiskScore"("targetId");

-- CreateIndex
CREATE INDEX "FraudRiskScore_targetId_targetType_idx" ON "FraudRiskScore"("targetId", "targetType");

-- CreateIndex
CREATE UNIQUE INDEX "MarketplaceAnalyticsEvent_eventId_key" ON "MarketplaceAnalyticsEvent"("eventId");

-- CreateIndex
CREATE INDEX "MarketplaceAnalyticsEvent_eventType_idx" ON "MarketplaceAnalyticsEvent"("eventType");

-- CreateIndex
CREATE INDEX "MarketplaceAnalyticsEvent_timestamp_idx" ON "MarketplaceAnalyticsEvent"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "OperationsIncident_incidentId_key" ON "OperationsIncident"("incidentId");

-- CreateIndex
CREATE INDEX "OperationsIncident_severity_idx" ON "OperationsIncident"("severity");

-- CreateIndex
CREATE INDEX "OperationsIncident_status_idx" ON "OperationsIncident"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralTreeRecord_refereeId_key" ON "ReferralTreeRecord"("refereeId");

-- CreateIndex
CREATE INDEX "ReferralTreeRecord_referrerId_idx" ON "ReferralTreeRecord"("referrerId");

-- CreateIndex
CREATE INDEX "ReferralTreeRecord_referralCode_idx" ON "ReferralTreeRecord"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "CountryRecord_code_key" ON "CountryRecord"("code");

-- CreateIndex
CREATE INDEX "CountryRecord_code_idx" ON "CountryRecord"("code");

-- CreateIndex
CREATE UNIQUE INDEX "AcquisitionRecord_userId_key" ON "AcquisitionRecord"("userId");

-- CreateIndex
CREATE INDEX "AcquisitionRecord_utmSource_idx" ON "AcquisitionRecord"("utmSource");

-- CreateIndex
CREATE INDEX "AcquisitionRecord_utmCampaign_idx" ON "AcquisitionRecord"("utmCampaign");

-- CreateIndex
CREATE UNIQUE INDEX "MarketingCampaign_code_key" ON "MarketingCampaign"("code");

-- CreateIndex
CREATE INDEX "MarketingCampaign_code_idx" ON "MarketingCampaign"("code");

-- CreateIndex
CREATE INDEX "MarketingCampaign_isActive_idx" ON "MarketingCampaign"("isActive");

-- CreateIndex
CREATE INDEX "CampaignRedemption_campaignId_idx" ON "CampaignRedemption"("campaignId");

-- CreateIndex
CREATE INDEX "CampaignRedemption_userId_idx" ON "CampaignRedemption"("userId");

-- CreateIndex
CREATE INDEX "AbandonedEvent_userId_idx" ON "AbandonedEvent"("userId");

-- CreateIndex
CREATE INDEX "AbandonedEvent_eventType_idx" ON "AbandonedEvent"("eventType");

-- CreateIndex
CREATE UNIQUE INDEX "ExperimentRecord_key_key" ON "ExperimentRecord"("key");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreferenceRecord_userId_key" ON "NotificationPreferenceRecord"("userId");

-- CreateIndex
CREATE INDEX "MarketplaceEvent_eventName_idx" ON "MarketplaceEvent"("eventName");

-- CreateIndex
CREATE INDEX "MarketplaceEvent_timestamp_idx" ON "MarketplaceEvent"("timestamp");

-- CreateIndex
CREATE INDEX "MarketplaceEvent_region_idx" ON "MarketplaceEvent"("region");

-- CreateIndex
CREATE INDEX "Anomaly_type_idx" ON "Anomaly"("type");

-- CreateIndex
CREATE INDEX "Anomaly_status_idx" ON "Anomaly"("status");

-- CreateIndex
CREATE INDEX "Anomaly_severity_idx" ON "Anomaly"("severity");

-- CreateIndex
CREATE INDEX "Recommendation_status_idx" ON "Recommendation"("status");

-- CreateIndex
CREATE INDEX "Recommendation_affectedArea_idx" ON "Recommendation"("affectedArea");

-- CreateIndex
CREATE UNIQUE INDEX "AutomationPolicy_name_key" ON "AutomationPolicy"("name");

-- CreateIndex
CREATE INDEX "ApprovalRequest_status_idx" ON "ApprovalRequest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "DecisionAudit_decisionId_key" ON "DecisionAudit"("decisionId");

-- CreateIndex
CREATE INDEX "DecisionAudit_actorId_idx" ON "DecisionAudit"("actorId");

-- CreateIndex
CREATE INDEX "DecisionAudit_policyName_idx" ON "DecisionAudit"("policyName");

-- CreateIndex
CREATE INDEX "DecisionAudit_timestamp_idx" ON "DecisionAudit"("timestamp");

-- CreateIndex
CREATE INDEX "RiskSignal_entityType_entityId_idx" ON "RiskSignal"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "RiskSignal_status_idx" ON "RiskSignal"("status");

-- CreateIndex
CREATE INDEX "CapacitySnapshot_region_category_idx" ON "CapacitySnapshot"("region", "category");

-- CreateIndex
CREATE INDEX "CapacitySnapshot_snapshotTime_idx" ON "CapacitySnapshot"("snapshotTime");

-- CreateIndex
CREATE INDEX "DecisionContextRecord_correlationId_idx" ON "DecisionContextRecord"("correlationId");

-- CreateIndex
CREATE INDEX "DecisionContextRecord_region_category_idx" ON "DecisionContextRecord"("region", "category");

-- CreateIndex
CREATE INDEX "MarketplaceDecision_correlationId_idx" ON "MarketplaceDecision"("correlationId");

-- CreateIndex
CREATE INDEX "MarketplaceDecision_status_idx" ON "MarketplaceDecision"("status");

-- CreateIndex
CREATE INDEX "DemandRevenueForecast_forecastType_targetHorizon_idx" ON "DemandRevenueForecast"("forecastType", "targetHorizon");

-- CreateIndex
CREATE INDEX "DemandRevenueForecast_region_category_idx" ON "DemandRevenueForecast"("region", "category");

-- CreateIndex
CREATE INDEX "ScenarioSimulation_scenarioName_idx" ON "ScenarioSimulation"("scenarioName");

-- CreateIndex
CREATE UNIQUE INDEX "AgentDefinition_agentId_key" ON "AgentDefinition"("agentId");

-- CreateIndex
CREATE INDEX "AgentDefinition_agentId_idx" ON "AgentDefinition"("agentId");

-- CreateIndex
CREATE INDEX "AgentExecution_agentId_idx" ON "AgentExecution"("agentId");

-- CreateIndex
CREATE INDEX "AgentExecution_correlationId_idx" ON "AgentExecution"("correlationId");

-- CreateIndex
CREATE INDEX "AgentExecutionStep_executionId_idx" ON "AgentExecutionStep"("executionId");

-- CreateIndex
CREATE INDEX "AgentToolPermission_agentId_idx" ON "AgentToolPermission"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "AgentToolPermission_agentId_toolName_key" ON "AgentToolPermission"("agentId", "toolName");

-- CreateIndex
CREATE INDEX "AiEvaluationMetric_modelName_evalType_idx" ON "AiEvaluationMetric"("modelName", "evalType");

-- CreateIndex
CREATE INDEX "DecisionAuditRecord_decisionId_idx" ON "DecisionAuditRecord"("decisionId");

-- CreateIndex
CREATE INDEX "DecisionAuditRecord_actorId_idx" ON "DecisionAuditRecord"("actorId");

-- CreateIndex
CREATE INDEX "AutonomousDecisionLog_decisionType_idx" ON "AutonomousDecisionLog"("decisionType");

-- CreateIndex
CREATE INDEX "AutonomousDecisionLog_status_idx" ON "AutonomousDecisionLog"("status");

-- CreateIndex
CREATE INDEX "AutonomousDecisionLog_createdAt_idx" ON "AutonomousDecisionLog"("createdAt");

-- CreateIndex
CREATE INDEX "WhatIfSimulation_scenarioType_idx" ON "WhatIfSimulation"("scenarioType");

-- CreateIndex
CREATE INDEX "WhatIfSimulation_region_idx" ON "WhatIfSimulation"("region");

-- CreateIndex
CREATE UNIQUE INDEX "DeploymentSnapshot_snapshotId_key" ON "DeploymentSnapshot"("snapshotId");

-- CreateIndex
CREATE INDEX "DeploymentSnapshot_snapshotId_idx" ON "DeploymentSnapshot"("snapshotId");

-- CreateIndex
CREATE INDEX "DeploymentSnapshot_activeStatus_idx" ON "DeploymentSnapshot"("activeStatus");

-- CreateIndex
CREATE UNIQUE INDEX "ClosedLoopExecution_idempotencyKey_key" ON "ClosedLoopExecution"("idempotencyKey");

-- CreateIndex
CREATE INDEX "ClosedLoopExecution_decisionId_idx" ON "ClosedLoopExecution"("decisionId");

-- CreateIndex
CREATE INDEX "ClosedLoopExecution_status_idx" ON "ClosedLoopExecution"("status");

-- CreateIndex
CREATE INDEX "ClosedLoopExecution_tenantId_idx" ON "ClosedLoopExecution"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "ActionCatalogRecord_actionType_key" ON "ActionCatalogRecord"("actionType");

-- CreateIndex
CREATE INDEX "ActionCatalogRecord_actionType_idx" ON "ActionCatalogRecord"("actionType");

-- CreateIndex
CREATE INDEX "ActionCatalogRecord_riskLevel_idx" ON "ActionCatalogRecord"("riskLevel");

-- CreateIndex
CREATE INDEX "DecisionOutcomeRecord_decisionId_idx" ON "DecisionOutcomeRecord"("decisionId");

-- CreateIndex
CREATE INDEX "DecisionOutcomeRecord_executionId_idx" ON "DecisionOutcomeRecord"("executionId");

-- CreateIndex
CREATE INDEX "DecisionOutcomeRecord_metricName_idx" ON "DecisionOutcomeRecord"("metricName");

-- CreateIndex
CREATE INDEX "DecisionEffectivenessLog_decisionId_idx" ON "DecisionEffectivenessLog"("decisionId");

-- CreateIndex
CREATE INDEX "DecisionEffectivenessLog_businessEffectiveness_idx" ON "DecisionEffectivenessLog"("businessEffectiveness");

-- CreateIndex
CREATE INDEX "ExperimentationRecord_status_idx" ON "ExperimentationRecord"("status");

-- CreateIndex
CREATE INDEX "OptimizationRunLog_objectiveName_idx" ON "OptimizationRunLog"("objectiveName");

-- CreateIndex
CREATE INDEX "AgentLearningFeedback_agentId_idx" ON "AgentLearningFeedback"("agentId");

-- CreateIndex
CREATE INDEX "AgentLearningFeedback_decisionId_idx" ON "AgentLearningFeedback"("decisionId");

-- CreateIndex
CREATE INDEX "DriftDetectionRecord_metricName_idx" ON "DriftDetectionRecord"("metricName");

-- CreateIndex
CREATE INDEX "DriftDetectionRecord_featureName_idx" ON "DriftDetectionRecord"("featureName");

-- CreateIndex
CREATE INDEX "GovernanceLifecycleRecord_entityType_entityId_idx" ON "GovernanceLifecycleRecord"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "KillSwitchLog_scope_idx" ON "KillSwitchLog"("scope");

-- CreateIndex
CREATE INDEX "KillSwitchLog_activatedAt_idx" ON "KillSwitchLog"("activatedAt");

-- CreateIndex
CREATE INDEX "MarketplaceTrustIncident_tenantId_idx" ON "MarketplaceTrustIncident"("tenantId");

-- CreateIndex
CREATE INDEX "MarketplaceTrustIncident_targetType_targetId_idx" ON "MarketplaceTrustIncident"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "MarketplaceTrustIncident_status_idx" ON "MarketplaceTrustIncident"("status");

-- CreateIndex
CREATE INDEX "MarketplaceTrustIncident_incidentType_idx" ON "MarketplaceTrustIncident"("incidentType");

-- CreateIndex
CREATE UNIQUE INDEX "DecisionExplanationRecord_decisionId_key" ON "DecisionExplanationRecord"("decisionId");

-- CreateIndex
CREATE INDEX "DecisionExplanationRecord_decisionId_idx" ON "DecisionExplanationRecord"("decisionId");

-- CreateIndex
CREATE INDEX "DecisionExplanationRecord_tenantId_idx" ON "DecisionExplanationRecord"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "CircuitBreakerStateRecord_serviceName_key" ON "CircuitBreakerStateRecord"("serviceName");

-- CreateIndex
CREATE INDEX "CircuitBreakerStateRecord_serviceName_idx" ON "CircuitBreakerStateRecord"("serviceName");

-- CreateIndex
CREATE UNIQUE INDEX "SelfHealingLoopBreakerRecord_remediationKey_key" ON "SelfHealingLoopBreakerRecord"("remediationKey");

-- CreateIndex
CREATE INDEX "SelfHealingLoopBreakerRecord_remediationKey_idx" ON "SelfHealingLoopBreakerRecord"("remediationKey");

-- CreateIndex
CREATE INDEX "MarketplacePolicy_tenantId_idx" ON "MarketplacePolicy"("tenantId");

-- CreateIndex
CREATE INDEX "MarketplacePolicy_status_idx" ON "MarketplacePolicy"("status");

-- CreateIndex
CREATE INDEX "MarketplacePolicy_category_idx" ON "MarketplacePolicy"("category");

-- CreateIndex
CREATE UNIQUE INDEX "MarketplacePolicy_name_version_tenantId_key" ON "MarketplacePolicy"("name", "version", "tenantId");

-- CreateIndex
CREATE INDEX "ImmutableAuditLog_tenantId_idx" ON "ImmutableAuditLog"("tenantId");

-- CreateIndex
CREATE INDEX "ImmutableAuditLog_actorId_idx" ON "ImmutableAuditLog"("actorId");

-- CreateIndex
CREATE INDEX "ImmutableAuditLog_action_idx" ON "ImmutableAuditLog"("action");

-- CreateIndex
CREATE INDEX "ImmutableAuditLog_targetResource_idx" ON "ImmutableAuditLog"("targetResource");

-- CreateIndex
CREATE INDEX "ImmutableAuditLog_timestamp_idx" ON "ImmutableAuditLog"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "EnterpriseOrganization_slug_key" ON "EnterpriseOrganization"("slug");

-- CreateIndex
CREATE INDEX "EnterpriseOrganization_status_idx" ON "EnterpriseOrganization"("status");

-- CreateIndex
CREATE INDEX "OrganizationMember_orgId_idx" ON "OrganizationMember"("orgId");

-- CreateIndex
CREATE INDEX "OrganizationMember_userId_idx" ON "OrganizationMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMember_orgId_userId_key" ON "OrganizationMember"("orgId", "userId");

-- CreateIndex
CREATE INDEX "DataPrivacyRequest_tenantId_idx" ON "DataPrivacyRequest"("tenantId");

-- CreateIndex
CREATE INDEX "DataPrivacyRequest_userId_idx" ON "DataPrivacyRequest"("userId");

-- CreateIndex
CREATE INDEX "DataPrivacyRequest_status_idx" ON "DataPrivacyRequest"("status");

-- CreateIndex
CREATE INDEX "DataRetentionPolicy_tenantId_idx" ON "DataRetentionPolicy"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "DataRetentionPolicy_category_tenantId_key" ON "DataRetentionPolicy"("category", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerApiKey_keyHash_key" ON "PartnerApiKey"("keyHash");

-- CreateIndex
CREATE INDEX "PartnerApiKey_organizationId_idx" ON "PartnerApiKey"("organizationId");

-- CreateIndex
CREATE INDEX "PartnerApiKey_status_idx" ON "PartnerApiKey"("status");

-- CreateIndex
CREATE INDEX "PartnerApiKey_keyPrefix_idx" ON "PartnerApiKey"("keyPrefix");

-- CreateIndex
CREATE INDEX "ExternalIntegrationConfig_providerType_idx" ON "ExternalIntegrationConfig"("providerType");

-- CreateIndex
CREATE INDEX "ExternalIntegrationConfig_status_idx" ON "ExternalIntegrationConfig"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalIntegrationConfig_providerType_providerName_tenantI_key" ON "ExternalIntegrationConfig"("providerType", "providerName", "tenantId");

-- CreateIndex
CREATE INDEX "InboundWebhookEvent_status_idx" ON "InboundWebhookEvent"("status");

-- CreateIndex
CREATE INDEX "InboundWebhookEvent_provider_idx" ON "InboundWebhookEvent"("provider");

-- CreateIndex
CREATE INDEX "InboundWebhookEvent_createdAt_idx" ON "InboundWebhookEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "InboundWebhookEvent_provider_externalEventId_key" ON "InboundWebhookEvent"("provider", "externalEventId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketplaceRegion_code_key" ON "MarketplaceRegion"("code");

-- CreateIndex
CREATE INDEX "MarketplaceRegion_status_idx" ON "MarketplaceRegion"("status");

-- CreateIndex
CREATE INDEX "MarketplaceRegion_currency_idx" ON "MarketplaceRegion"("currency");

-- CreateIndex
CREATE INDEX "ExchangeRateRecord_fromCurrency_toCurrency_idx" ON "ExchangeRateRecord"("fromCurrency", "toCurrency");

-- CreateIndex
CREATE INDEX "ExchangeRateRecord_validUntil_idx" ON "ExchangeRateRecord"("validUntil");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeRateRecord_fromCurrency_toCurrency_effectiveAt_key" ON "ExchangeRateRecord"("fromCurrency", "toCurrency", "effectiveAt");

-- CreateIndex
CREATE INDEX "EcosystemIntelligenceSignal_regionCode_idx" ON "EcosystemIntelligenceSignal"("regionCode");

-- CreateIndex
CREATE INDEX "EcosystemIntelligenceSignal_metricType_idx" ON "EcosystemIntelligenceSignal"("metricType");

-- CreateIndex
CREATE INDEX "EcosystemIntelligenceSignal_recordedAt_idx" ON "EcosystemIntelligenceSignal"("recordedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceLevelObjectiveRecord_workflowName_key" ON "ServiceLevelObjectiveRecord"("workflowName");

-- CreateIndex
CREATE INDEX "ServiceLevelObjectiveRecord_workflowName_idx" ON "ServiceLevelObjectiveRecord"("workflowName");

-- CreateIndex
CREATE INDEX "ServiceLevelObjectiveRecord_budgetStatus_idx" ON "ServiceLevelObjectiveRecord"("budgetStatus");

-- CreateIndex
CREATE UNIQUE INDEX "SelfHealingExecutionAudit_executionId_key" ON "SelfHealingExecutionAudit"("executionId");

-- CreateIndex
CREATE INDEX "SelfHealingExecutionAudit_actionType_idx" ON "SelfHealingExecutionAudit"("actionType");

-- CreateIndex
CREATE INDEX "SelfHealingExecutionAudit_status_idx" ON "SelfHealingExecutionAudit"("status");

-- CreateIndex
CREATE INDEX "SelfHealingExecutionAudit_executedAt_idx" ON "SelfHealingExecutionAudit"("executedAt");

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerProfile" ADD CONSTRAINT "CustomerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderProfile" ADD CONSTRAINT "ProviderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignRedemption" ADD CONSTRAINT "CampaignRedemption_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "MarketingCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentExecutionStep" ADD CONSTRAINT "AgentExecutionStep_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "AgentExecution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "EnterpriseOrganization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
