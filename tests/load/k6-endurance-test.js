import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '5m', target: 20000 },
    { duration: '24h', target: 20000 }, // Long soak / endurance run
    { duration: '5m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'],
    http_req_failed: ['rate<0.001'],
  },
};

export default function () {
  const res = http.get('http://api.ecivres.local/health/readiness');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(5);
}
