import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export interface ResilienceConfig {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  retryCondition?: (error: AxiosError) => boolean;
}

const DEFAULT_CONFIG: Required<ResilienceConfig> = {
  maxRetries: 3,
  initialDelayMs: 300,
  maxDelayMs: 3000,
  retryCondition: (error: AxiosError) => {
    // Retry on network errors or transient 5xx server errors
    if (!error.response) {
      return true; // Network error or timeout
    }
    const status = error.response.status;
    return status === 502 || status === 503 || status === 504 || status === 429;
  },
};

/**
 * Attaches exponential backoff and network resilience policy to an Axios instance.
 */
export function attachNetworkResilience(
  axiosInstance: AxiosInstance,
  customConfig?: ResilienceConfig,
): void {
  const config = { ...DEFAULT_CONFIG, ...customConfig };

  axiosInstance.interceptors.request.use((reqConfig: InternalAxiosRequestConfig) => {
    // Inject mobile platform headers
    reqConfig.headers.set('X-Client-Platform', 'React-Native');
    reqConfig.headers.set('X-Client-Version', '0.87.0');
    return reqConfig;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalConfig = error.config as (InternalAxiosRequestConfig & { _retryCount?: number });

      if (!originalConfig) {
        return Promise.reject(error);
      }

      // Only retry safe idempotent GET/HEAD/OPTIONS methods by default
      const method = (originalConfig.method || 'GET').toUpperCase();
      const isIdempotent = ['GET', 'HEAD', 'OPTIONS'].includes(method);

      if (!isIdempotent) {
        return Promise.reject(error);
      }

      const retryCount = originalConfig._retryCount || 0;

      if (retryCount < config.maxRetries && config.retryCondition(error)) {
        originalConfig._retryCount = retryCount + 1;

        // Exponential backoff with jitter
        const delay = Math.min(
          config.initialDelayMs * Math.pow(2, retryCount) + Math.random() * 100,
          config.maxDelayMs,
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
        return axiosInstance(originalConfig);
      }

      return Promise.reject(error);
    },
  );
}
