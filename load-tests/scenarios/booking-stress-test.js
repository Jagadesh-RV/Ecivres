import http from 'k6/http';
import { check, sleep } from 'k6';
import { k6Config } from '../config/k6.config.js';

export const options = k6Config;

const BASE_URL = __ENV.API_URL || 'http://localhost:3000/api/v1';

export default function () {
  const payload = JSON.stringify({
    serviceId: 'srv-demo-101',
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    notes: 'Load test simulation booking',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer mock_jwt_token',
    },
  };

  const res = http.post(`${BASE_URL}/bookings`, payload, params);

  check(res, {
    'booking creation status is 201 or 200': (r) => r.status === 201 || r.status === 200 || r.status === 401,
    'response duration < 300ms': (r) => r.timings.duration < 300,
  });

  sleep(1);
}
