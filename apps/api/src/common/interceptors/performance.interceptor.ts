import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger('PerformanceMetrics');
  private readonly SLOW_API_THRESHOLD_MS = 500;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const startTime = performance.now();

    return next.handle().pipe(
      tap(() => {
        const executionTimeMs = performance.now() - startTime;
        if (executionTimeMs > this.SLOW_API_THRESHOLD_MS) {
          this.logger.warn(
            `[Slow Query Warning] ${method} ${url} took ${executionTimeMs.toFixed(2)}ms (threshold: ${this.SLOW_API_THRESHOLD_MS}ms)`,
          );
        }
      }),
    );
  }
}
