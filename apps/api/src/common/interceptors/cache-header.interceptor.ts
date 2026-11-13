import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response, Request } from 'express';

@Injectable()
export class CacheHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        // Only apply public caching on GET requests
        if (req.method === 'GET') {
          const url = req.url.toLowerCase();

          // Static catalog, categories, regions, and public metadata routes
          if (
            url.includes('/categories') ||
            url.includes('/regions') ||
            url.includes('/catalog')
          ) {
            res.setHeader(
              'Cache-Control',
              'public, max-age=60, s-maxage=300, stale-while-revalidate=120',
            );
          } else if (
            url.includes('/auth') ||
            url.includes('/billing') ||
            url.includes('/orders') ||
            url.includes('/bookings')
          ) {
            res.setHeader(
              'Cache-Control',
              'no-store, no-cache, must-revalidate, proxy-revalidate',
            );
          }
        }
      }),
    );
  }
}
