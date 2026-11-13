import axios from 'axios';
import { attachNetworkResilience } from '../src/services/api/resilience';

describe('Mobile Client Network Resilience & Retry Policy', () => {
  it('should inject React-Native platform headers into outbound requests', async () => {
    const testAxios = axios.create();
    attachNetworkResilience(testAxios);

    // Mock adapter to capture request config
    testAxios.defaults.adapter = async (config) => {
      return {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    };

    const res = await testAxios.get('https://example.com/test');
    expect(res.config.headers.get('X-Client-Platform')).toBe('React-Native');
    expect(res.config.headers.get('X-Client-Version')).toBe('0.87.0');
  });

  it('should retry idempotent GET requests upon transient 503 server error', async () => {
    const testAxios = axios.create();
    attachNetworkResilience(testAxios, {
      maxRetries: 2,
      initialDelayMs: 10,
      maxDelayMs: 50,
    });

    let callCount = 0;
    testAxios.defaults.adapter = async (config) => {
      callCount++;
      if (callCount < 2) {
        const error: any = new Error('Service Unavailable');
        error.config = config;
        error.response = { status: 503, data: 'Unavailable' };
        throw error;
      }
      return {
        data: { recovered: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    };

    const res = await testAxios.get('https://example.com/idempotent');
    expect(callCount).toBe(2);
    expect(res.data.recovered).toBe(true);
  });

  it('should NOT retry non-idempotent POST requests on server error', async () => {
    const testAxios = axios.create();
    attachNetworkResilience(testAxios, { maxRetries: 3 });

    let callCount = 0;
    testAxios.defaults.adapter = async (config) => {
      callCount++;
      const error: any = new Error('Service Unavailable');
      error.config = config;
      error.response = { status: 503, data: 'Unavailable' };
      throw error;
    };

    await expect(testAxios.post('https://example.com/orders', { amount: 50 })).rejects.toThrow();
    expect(callCount).toBe(1); // Exactly 1 attempt without retry
  });
});
