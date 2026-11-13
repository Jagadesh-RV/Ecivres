import { Injectable, Logger, BadRequestException } from '@nestjs/common';

export interface StructuredLogContext {
  correlationId?: string;
  component: string;
  operation: string;
  durationMs?: number;
  outcome: 'SUCCESS' | 'FAILURE' | 'DEGRADED';
  severity?: 'INFO' | 'WARN' | 'ERROR';
  errorType?: string;
  sanitizedMessage?: string;
  metadata?: Record<string, any>;
}

export interface MetricSnapshot {
  timestamp: string;
  totalRequests: number;
  totalErrors: number;
  errorRatePercent: number;
  latencies: {
    p50Ms: number;
    p95Ms: number;
    p99Ms: number;
    sampleCount: number;
  };
  circuitTrips: number;
  retryAttempts: number;
  deadLetterEvents: number;
  workflowFailures: Record<string, number>;
}

@Injectable()
export class OperationalMetricsService {
  private readonly logger = new Logger(OperationalMetricsService.name);

  // Circular rolling buffer for latency tracking (max 1000 samples)
  private readonly latencySamples: number[] = [];
  private readonly MAX_SAMPLES = 1000;

  // Counter accumulators
  private totalRequests = 0;
  private totalErrors = 0;
  private circuitTrips = 0;
  private retryAttempts = 0;
  private deadLetterEvents = 0;
  private readonly workflowFailures = new Map<string, number>();

  // Allowed metric label dimensions (preventing cardinality explosion)
  private readonly ALLOWED_LABEL_KEYS = new Set([
    'method',
    'route',
    'status_code',
    'workflow',
    'service',
    'severity',
    'error_type',
  ]);

  /**
   * Validates metric labels to prevent unbounded high-cardinality label pollution.
   * Disallows user IDs, emails, UUIDs, and arbitrary request values.
   */
  validateMetricLabels(labels: Record<string, string>): void {
    for (const [key, value] of Object.entries(labels)) {
      if (!this.ALLOWED_LABEL_KEYS.has(key)) {
        throw new BadRequestException(
          `Unbounded metric label key '${key}' rejected. Allowed label keys: ${Array.from(
            this.ALLOWED_LABEL_KEYS,
          ).join(', ')}`,
        );
      }

      // Check if value looks like a UUID or email (unbounded data)
      if (
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value) ||
        value.includes('@') ||
        value.length > 64
      ) {
        throw new BadRequestException(
          `Unbounded metric label value for '${key}' rejected. High-cardinality identifiers cannot be used as metric labels.`,
        );
      }
    }
  }

  /**
   * Records a request duration and updates rolling latency percentiles.
   */
  recordRequestLatency(durationMs: number, isError: boolean = false): void {
    this.totalRequests++;
    if (isError) {
      this.totalErrors++;
    }

    if (this.latencySamples.length >= this.MAX_SAMPLES) {
      this.latencySamples.shift(); // Evict oldest
    }
    this.latencySamples.push(durationMs);
  }

  /**
   * Increments circuit breaker trip counter.
   */
  recordCircuitTrip(): void {
    this.circuitTrips++;
  }

  /**
   * Increments retry counter.
   */
  recordRetryAttempt(): void {
    this.retryAttempts++;
  }

  /**
   * Increments dead-letter queue routing counter.
   */
  recordDeadLetterEvent(): void {
    this.deadLetterEvents++;
  }

  /**
   * Increments specific workflow failure counter.
   */
  recordWorkflowFailure(workflow: string): void {
    const current = this.workflowFailures.get(workflow) || 0;
    this.workflowFailures.set(workflow, current + 1);
  }

  /**
   * Computes p50, p95, and p99 latency percentiles from rolling samples.
   */
  getLatencyPercentiles(): { p50: number; p95: number; p99: number; count: number } {
    if (this.latencySamples.length === 0) {
      return { p50: 0, p95: 0, p99: 0, count: 0 };
    }

    const sorted = [...this.latencySamples].sort((a, b) => a - b);
    const count = sorted.length;

    const p50 = sorted[Math.floor(count * 0.5)];
    const p95 = sorted[Math.floor(count * 0.95)];
    const p99 = sorted[Math.floor(count * 0.99)];

    return { p50, p95, p99, count };
  }

  /**
   * Emits structured JSON log entry, stripping credentials, PANs, and secret keys.
   */
  emitStructuredLog(ctx: StructuredLogContext): void {
    const sanitizedMetadata = this.sanitizeMetadata(ctx.metadata || {});

    const logEntry = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      service: 'ecivres-api',
      correlationId: ctx.correlationId || 'N/A',
      component: ctx.component,
      operation: ctx.operation,
      durationMs: ctx.durationMs ?? 0,
      outcome: ctx.outcome,
      severity: ctx.severity || 'INFO',
      errorType: ctx.errorType,
      message: ctx.sanitizedMessage,
      metadata: sanitizedMetadata,
    };

    if (ctx.severity === 'ERROR' || ctx.outcome === 'FAILURE') {
      this.logger.error(JSON.stringify(logEntry));
    } else if (ctx.severity === 'WARN') {
      this.logger.warn(JSON.stringify(logEntry));
    } else {
      this.logger.log(JSON.stringify(logEntry));
    }
  }

  /**
   * Returns current operational metrics snapshot.
   */
  getMetricsSnapshot(): MetricSnapshot {
    const { p50, p95, p99, count } = this.getLatencyPercentiles();
    const errorRatePercent =
      this.totalRequests > 0
        ? Math.round((this.totalErrors / this.totalRequests) * 10000) / 100
        : 0;

    const workflowFailuresObj: Record<string, number> = {};
    for (const [k, v] of this.workflowFailures.entries()) {
      workflowFailuresObj[k] = v;
    }

    return {
      timestamp: new Date().toISOString(),
      totalRequests: this.totalRequests,
      totalErrors: this.totalErrors,
      errorRatePercent,
      latencies: {
        p50Ms: p50,
        p95Ms: p95,
        p99Ms: p99,
        sampleCount: count,
      },
      circuitTrips: this.circuitTrips,
      retryAttempts: this.retryAttempts,
      deadLetterEvents: this.deadLetterEvents,
      workflowFailures: workflowFailuresObj,
    };
  }

  /**
   * Recursively redacts sensitive credentials and payment data.
   */
  private sanitizeMetadata(data: Record<string, any>): Record<string, any> {
    const sensitiveKeys = ['password', 'token', 'secret', 'apikey', 'card', 'cvv', 'authorization'];
    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      const lower = key.toLowerCase();
      if (sensitiveKeys.some((s) => lower.includes(s))) {
        result[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[key] = this.sanitizeMetadata(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  /**
   * Formats current operational metrics into standard Prometheus text exposition format.
   */
  toPrometheusFormat(): string {
    const snapshot = this.getMetricsSnapshot();
    const lines: string[] = [
      '# HELP ecivres_http_requests_total Total number of processed HTTP requests.',
      '# TYPE ecivres_http_requests_total counter',
      `ecivres_http_requests_total ${snapshot.totalRequests}`,
      '',
      '# HELP ecivres_http_errors_total Total number of HTTP 5xx errors.',
      '# TYPE ecivres_http_errors_total counter',
      `ecivres_http_errors_total ${snapshot.totalErrors}`,
      '',
      '# HELP ecivres_error_rate_percent Current rolling HTTP error rate percentage.',
      '# TYPE ecivres_error_rate_percent gauge',
      `ecivres_error_rate_percent ${snapshot.errorRatePercent}`,
      '',
      '# HELP ecivres_http_request_duration_ms HTTP request latency percentiles in milliseconds.',
      '# TYPE ecivres_http_request_duration_ms gauge',
      `ecivres_http_request_duration_ms{quantile="0.50"} ${snapshot.latencies.p50Ms}`,
      `ecivres_http_request_duration_ms{quantile="0.95"} ${snapshot.latencies.p95Ms}`,
      `ecivres_http_request_duration_ms{quantile="0.99"} ${snapshot.latencies.p99Ms}`,
      '',
      '# HELP ecivres_circuit_trips_total Total circuit breaker trip events.',
      '# TYPE ecivres_circuit_trips_total counter',
      `ecivres_circuit_trips_total ${snapshot.circuitTrips}`,
      '',
      '# HELP ecivres_retry_attempts_total Total resilience retry attempts.',
      '# TYPE ecivres_retry_attempts_total counter',
      `ecivres_retry_attempts_total ${snapshot.retryAttempts}`,
      '',
      '# HELP ecivres_dead_letter_events_total Dead letter queue dropped messages.',
      '# TYPE ecivres_dead_letter_events_total counter',
      `ecivres_dead_letter_events_total ${snapshot.deadLetterEvents}`,
      '',
    ];
    return lines.join('\n');
  }
}

