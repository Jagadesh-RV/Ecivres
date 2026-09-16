import { SecurityHeadersMiddleware } from './security-headers.middleware';

describe('SecurityHeadersMiddleware', () => {
  let middleware: SecurityHeadersMiddleware;

  beforeEach(() => {
    middleware = new SecurityHeadersMiddleware();
  });

  it('should attach essential security headers to HTTP response', () => {
    const req: any = {};
    const res: any = { setHeader: jest.fn() };
    const next = jest.fn();

    middleware.use(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
    expect(res.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
    expect(next).toHaveBeenCalled();
  });
});
