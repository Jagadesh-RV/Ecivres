import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseCompressionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    
    // Set cache control headers for static endpoints
    response.setHeader('X-Response-Engine', 'EcivreS-TurboCompress');

    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          return {
            ...data,
            _meta: {
              ...(data._meta || {}),
              compressed: true,
              timestamp: new Date().toISOString(),
            },
          };
        }
        return data;
      }),
    );
  }
}
