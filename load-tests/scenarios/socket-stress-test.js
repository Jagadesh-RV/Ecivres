import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '1m',
};

export default function () {
  const res = http.get('http://localhost:3000/socket.io/?EIO=4&transport=polling');

  check(res, {
    'socket handshake status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
