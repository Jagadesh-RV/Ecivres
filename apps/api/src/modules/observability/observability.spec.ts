import { CorrelationIdMiddleware, CORRELATION_HEADER } from './correlation-id.middleware';

describe('CorrelationIdMiddleware', () => {
  let middleware: CorrelationIdMiddleware;

  beforeEach(() => {
    middleware = new CorrelationIdMiddleware();
  });

  it('should generate a correlation ID header if not present in request', () => {
    const req: any = { headers: {} };
    const res: any = { setHeader: jest.fn() };
    const next = jest.fn();

    middleware.use(req, res, next);

    expect(req.headers[CORRELATION_HEADER]).toBeDefined();
    expect(res.setHeader).toHaveBeenCalledWith(CORRELATION_HEADER, req.headers[CORRELATION_HEADER]);
    expect(next).toHaveBeenCalled();
  });

  it('should preserve incoming correlation ID header', () => {
    const existingId = 'custom-trace-id-12345';
    const req: any = { headers: { [CORRELATION_HEADER]: existingId } };
    const res: any = { setHeader: jest.fn() };
    const next = jest.fn();

    middleware.use(req, res, next);

    expect(req.headers[CORRELATION_HEADER]).toBe(existingId);
    expect(res.setHeader).toHaveBeenCalledWith(CORRELATION_HEADER, existingId);
    expect(next).toHaveBeenCalled();
  });
});
