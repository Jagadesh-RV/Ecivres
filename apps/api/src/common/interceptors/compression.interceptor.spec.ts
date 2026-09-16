import { ResponseCompressionInterceptor } from './compression.interceptor';
import { of } from 'rxjs';

describe('ResponseCompressionInterceptor', () => {
  let interceptor: ResponseCompressionInterceptor;

  beforeEach(() => {
    interceptor = new ResponseCompressionInterceptor();
  });

  it('should append _meta header and compressed flag to object responses', (done) => {
    const context: any = {
      switchToHttp: () => ({
        getResponse: () => ({
          setHeader: jest.fn(),
        }),
      }),
    };

    const next: any = {
      handle: () => of({ success: true, data: [1, 2, 3] }),
    };

    interceptor.intercept(context, next).subscribe((res) => {
      expect(res._meta).toBeDefined();
      expect(res._meta.compressed).toBe(true);
      done();
    });
  });
});
