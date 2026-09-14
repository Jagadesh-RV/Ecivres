import { Injectable, Logger } from '@nestjs/common';

export interface QueryMetric {
  query: string;
  durationMs: number;
  thresholdMs: number;
  isSlow: boolean;
}

@Injectable()
export class QueryAnalyzerService {
  private readonly logger = new Logger(QueryAnalyzerService.name);
  private readonly slowQueryThresholdMs = 200;

  recordQueryTiming(query: string, durationMs: number): QueryMetric {
    const isSlow = durationMs > this.slowQueryThresholdMs;

    if (isSlow) {
      this.logger.warn(`SLOW QUERY DETECTED (${durationMs}ms > ${this.slowQueryThresholdMs}ms): ${query}`);
    }

    return {
      query,
      durationMs,
      thresholdMs: this.slowQueryThresholdMs,
      isSlow,
    };
  }
}
