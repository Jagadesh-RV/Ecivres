import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OpenTelemetryService } from './opentelemetry.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly openTelemetryService: OpenTelemetryService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest();
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const res = http.getResponse();
          const durationMs = Date.now() - startTime;
          this.openTelemetryService.recordMetric('http_request_duration_ms', durationMs, {
            method: req.method,
            path: req.route?.path || req.url,
            statusCode: res.statusCode.toString(),
          });
        },
        error: (err) => {
          const durationMs = Date.now() - startTime;
          this.openTelemetryService.recordMetric('http_request_duration_ms', durationMs, {
            method: req.method,
            path: req.route?.path || req.url,
            statusCode: err.status ? err.status.toString() : '500',
          });
        },
      }),
    );
  }
}
