import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 20000 },  // Ramp up to 20k users
    { duration: '5m', target: 100000 }, // Surge to 100k concurrent users
    { duration: '5m', target: 100000 }, // Sustain 100k load
    { duration: '2m', target: 0 },      // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<300', 'p(99)<800'], // P95 < 300ms, P99 < 800ms
    http_req_failed: ['rate<0.001'],               // Error rate < 0.1%
  },
};

const BASE_URL = 'https://api.ecivres.com';

export default function () {
  // 1. Service Discovery Search
  const searchRes = http.get(`${BASE_URL}/api/v1/services/search?category=Plumbing`);
  check(searchRes, {
    'search status 200': (r) => r.status === 200,
    'search latency < 300ms': (r) => r.timings.duration < 300,
  });

  sleep(1);

  // 2. AI Provider Recommendation Query
  const aiRes = http.get(`${BASE_URL}/api/v1/ai/recommendations/providers?latitude=40.7128&longitude=-74.0060`);
  check(aiRes, {
    'ai status 200': (r) => r.status === 200,
  });

  sleep(1);
}
