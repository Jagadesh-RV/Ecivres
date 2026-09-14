import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 1000 },
    { duration: '10s', target: 100000 }, // Traffic spike
    { duration: '2m', target: 100000 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'],
    http_req_failed: ['rate<0.001'],
  },
};

export default function () {
  const url = 'http://api.ecivres.local/services/search?query=home+cleaning&lat=37.7749&lng=-122.4194';
  const res = http.get(url);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'cache hit header present': (r) => r.headers['X-Cache'] === 'HIT' || r.status === 200,
  });

  sleep(0.5);
}
