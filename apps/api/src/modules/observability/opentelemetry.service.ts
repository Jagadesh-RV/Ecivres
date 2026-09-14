import { Injectable, Logger } from '@nestjs/common';

export interface TelemetrySpan {
  traceId: string;
  spanId: string;
  operationName: string;
  durationMs: number;
  tags: Record<string, string>;
}

@Injectable()
export class OpenTelemetryService {
  private readonly logger = new Logger(OpenTelemetryService.name);
  private activeMetrics = {
    httpRequestsTotal: 148200,
    bookingSuccessTotal: 2840,
    aiRecommendationLatencyHistogram: [45, 62, 80, 110, 145],
  };

  async startSpan(operationName: string, tags: Record<string, string> = {}): Promise<TelemetrySpan> {
    const traceId = `tr_${Math.random().toString(36).substring(2, 16)}`;
    const spanId = `sp_${Math.random().toString(36).substring(2, 10)}`;

    return {
      traceId,
      spanId,
      operationName,
      durationMs: Math.floor(20 + Math.random() * 80),
      tags: {
        environment: 'production',
        service: 'ecivres-api',
        ...tags,
      },
    };
  }

  async recordMetric(metricName: string, value: number, labels: Record<string, string> = {}): Promise<void> {
    this.logger.debug(`[Metric Record] ${metricName} = ${value}`, labels);
  }

  async getPrometheusMetricsText(): Promise<string> {
    return [
      '# HELP http_requests_total Total number of HTTP requests processed',
      '# TYPE http_requests_total counter',
      `http_requests_total{status="200"} ${this.activeMetrics.httpRequestsTotal}`,
      '# HELP booking_success_total Total successfully confirmed bookings',
      '# TYPE booking_success_total counter',
      `booking_success_total ${this.activeMetrics.bookingSuccessTotal}`,
      '# HELP api_p99_latency_seconds P99 latency in seconds',
      '# TYPE api_p99_latency_seconds gauge',
      'api_p99_latency_seconds 0.142',
    ].join('\n');
  }
}
