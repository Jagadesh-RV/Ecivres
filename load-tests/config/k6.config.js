export const k6Config = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp up to 50 virtual users
    { duration: '1m', target: 200 },  // Sustained load 200 VUs
    { duration: '30s', target: 500 }, // Spike to 500 VUs
    { duration: '30s', target: 0 },   // Cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200', 'p(99)<500'], // 95% of requests < 200ms
    http_req_failed: ['rate<0.01'],                 // Error rate < 1%
  },
};
