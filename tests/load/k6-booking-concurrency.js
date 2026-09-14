import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 5000 },
    { duration: '3m', target: 50000 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<300', 'p(99)<800'],
    http_req_failed: ['rate<0.001'],
  },
};

export default function () {
  const url = 'http://api.ecivres.local/bookings';
  const payload = JSON.stringify({
    serviceId: 'srv_123',
    scheduledAt: '2026-10-01T10:00:00Z',
    paymentMethodId: 'pm_card_visa',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer k6_load_test_jwt_token',
    },
  };

  const res = http.post(url, payload, params);
  check(res, {
    'status is 201 created': (r) => r.status === 201,
    'latency under 300ms': (r) => r.timings.duration < 300,
  });

  sleep(1);
}
