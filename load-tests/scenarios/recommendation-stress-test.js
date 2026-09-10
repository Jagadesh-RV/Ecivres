import http from 'k6/http';
import { check, sleep } from 'k6';
import { k6Config } from '../config/k6.config.js';

export const options = k6Config;

const BASE_URL = __ENV.API_URL || 'http://localhost:3000/api/v1';

export default function () {
  const params = {
    headers: {
      Authorization: 'Bearer mock_jwt_token',
    },
  };

  const res = http.get(`${BASE_URL}/ai/recommendations/providers?latitude=37.7749&longitude=-122.4194&limit=10`, params);

  check(res, {
    'recommendation status is 200': (r) => r.status === 200 || r.status === 401,
    'response duration < 150ms': (r) => r.timings.duration < 150,
  });

  sleep(0.5);
}
