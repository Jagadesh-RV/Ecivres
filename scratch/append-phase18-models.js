const fs = require('fs');
const schemaPath = 'apps/api/prisma/schema.prisma';
let schemaContent = fs.readFileSync(schemaPath, 'utf8');

const phase18Models = `

// ==========================================
// PHASE 18: AUTONOMOUS MARKETPLACE EVOLUTION
// ==========================================

model ClosedLoopExecution {
  id                  String    @id @default(uuid())
  decisionId          String
  actionType          String
  status              String    @default("SCHEDULED") // SCHEDULED, EXECUTING, EXECUTED, PARTIALLY_EXECUTED, FAILED, COMPENSATING, COMPENSATED
  idempotencyKey      String    @unique
  targetEntity        String
  payload             Json
  compensationPayload Json?
  executedAt          DateTime?
  completedAt         DateTime?
  errorMessage        String?
  retryCount          Int       @default(0)
  tenantId            String?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt

  @@index([decisionId])
  @@index([status])
  @@index([tenantId])
}

model ActionCatalogRecord {
  id                    String   @id @default(uuid())
  actionType            String   @unique
  name                  String
  description           String
  riskLevel             String   @default("LOW") // LOW, MEDIUM, HIGH, CRITICAL
  maxMonetaryLimit      Float    @default(0.0)
  requiredRole          String   @default("ADMIN")
  requiredPermission    String
  approvalLevelRequired Int      @default(1)
  isEnabled             Boolean  @default(true)
  compensationSupported Boolean  @default(false)
  parametersSchema      Json?
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  @@index([actionType])
  @@index([riskLevel])
}

model DecisionOutcomeRecord {
  id                String   @id @default(uuid())
  decisionId        String
  executionId       String
  metricName        String
  expectedValue     Float
  actualValue       Float
  deltaValue        Float
  deltaPercentage   Float
  measurementWindow String   @default("24h") // 1h, 24h, 7d
  measuredAt        DateTime @default(now())
  confidenceScore   Float    @default(0.95)

  @@index([decisionId])
  @@index([executionId])
  @@index([metricName])
}

model DecisionEffectivenessLog {
  id                    String   @id @default(uuid())
  decisionId            String
  executionId           String
  executionStatus       String   // SUCCESS, FAILED, PARTIAL
  businessEffectiveness String   // SUCCESSFUL, PARTIALLY_SUCCESSFUL, INEFFECTIVE, HARMFUL, INCONCLUSIVE
  overallRoi            Float    @default(0.0)
  attributionScore      Float    @default(1.0)
  evaluationSummary     String
  evaluatedAt           DateTime @default(now())

  @@index([decisionId])
  @@index([businessEffectiveness])
}

model ExperimentationRecord {
  id                      String    @id @default(uuid())
  name                    String
  description             String
  status                  String    @default("DRAFT") // DRAFT, EVALUATING, APPROVED, ACTIVE, MONITORED, PAUSED, CONCLUDED, RETIRED
  controlVariant          Json
  testVariants            Json
  trafficSplit            Json
  targetMetrics           Json
  errorGuardrailThreshold Float    @default(0.05)
  winningVariant          String?
  startedAt               DateTime?
  endedAt                 DateTime?
  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt

  @@index([status])
}

model OptimizationRunLog {
  id                    String   @id @default(uuid())
  objectiveName         String
  constraints           Json
  initialValue          Float
  optimizedValue        Float
  improvementPercentage Float
  parametersApplied     Json
  status                String   @default("COMPLETED")
  executedAt            DateTime @default(now())

  @@index([objectiveName])
}

model AgentLearningFeedback {
  id            String   @id @default(uuid())
  agentId       String
  decisionId    String
  feedbackType  String   // POSITIVE, NEGATIVE, CORRECTION
  accuracyScore Float
  falsePositive Boolean  @default(false)
  falseNegative Boolean  @default(false)
  impactScore   Float    @default(0.0)
  recordedAt    DateTime @default(now())

  @@index([agentId])
  @@index([decisionId])
}

model DriftDetectionRecord {
  id              String   @id @default(uuid())
  metricName      String
  featureName     String
  baselineValue   Float
  currentValue    Float
  driftScore      Float
  isDriftDetected Boolean  @default(false)
  detectedAt      DateTime @default(now())

  @@index([metricName])
  @@index([featureName])
}

model GovernanceLifecycleRecord {
  id            String   @id @default(uuid())
  entityType    String   // POLICY, DECISION, ACTION, EXPERIMENT, AGENT
  entityId      String
  previousState String
  currentState  String
  reason        String
  changedBy     String
  changedAt     DateTime @default(now())

  @@index([entityType, entityId])
}

model KillSwitchLog {
  id            String    @id @default(uuid())
  scope         String    // GLOBAL, TENANT, AGENT, ACTION, EXPERIMENT
  scopeId       String?
  triggerReason String
  triggeredBy   String
  isEmergency   Boolean   @default(true)
  activatedAt   DateTime  @default(now())
  deactivatedAt DateTime?

  @@index([scope])
  @@index([activatedAt])
}
`;

if (!schemaContent.includes('model ClosedLoopExecution')) {
  schemaContent += phase18Models;
  fs.readFileSync;
  fs.writeFileSync(schemaPath, schemaContent, 'utf8');
  console.log('Phase 18 models appended successfully.');
} else {
  console.log('Phase 18 models already exist.');
}
