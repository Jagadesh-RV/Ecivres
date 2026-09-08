import { LoggingInterceptor } from './logging.interceptor';
import { PerformanceInterceptor } from './performance.interceptor';
import { of } from 'rxjs';

describe('Monitoring Interceptors', () => {
  let loggingInterceptor: LoggingInterceptor;
  let performanceInterceptor: PerformanceInterceptor;

  beforeEach(() => {
    loggingInterceptor = new LoggingInterceptor();
    performanceInterceptor = new PerformanceInterceptor();
  });

  it('should instantiate interceptors correctly', () => {
    expect(loggingInterceptor).toBeDefined();
    expect(performanceInterceptor).toBeDefined();
  });

  it('should intercept execution context and call handler', (done) => {
    const mockContext: any = {
      switchToHttp: () => ({
        getRequest: () => ({ method: 'GET', url: '/api/v1/health', ip: '127.0.0.1', get: () => 'jest' }),
        getResponse: () => ({ statusCode: 200 }),
      }),
    };

    const mockNext: any = {
      handle: () => of({ status: 'ok' }),
    };

    performanceInterceptor.intercept(mockContext, mockNext).subscribe((res) => {
      expect(res).toEqual({ status: 'ok' });
      done();
    });
  });
});
