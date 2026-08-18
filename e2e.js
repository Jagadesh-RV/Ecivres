const axios = require('axios');

async function run() {
  const api = axios.create({ baseURL: 'http://localhost:5001/api/v1' });
  const email = `test-${Date.now()}@example.com`;
  
  try {
    console.log('1. Registering user...');
    const regRes = await api.post('/auth/register', { name: 'Test', email, password: 'password', confirmPassword: 'password' });
    console.log('Registered:', regRes.data.user.email);
    
    console.log('2. Logging in...');
    const loginRes = await api.post('/auth/login', { email, password: 'password' });
    const { access_token, refresh_token } = loginRes.data;
    console.log('Got tokens');
    
    console.log('3. Fetching /users/me...');
    const meRes = await api.get('/users/me', { headers: { Authorization: `Bearer ${access_token}` } });
    console.log('Me:', meRes.data.email);
    
    console.log('4. Refreshing token...');
    const refRes = await api.post('/auth/refresh', { refresh_token });
    console.log('New access token length:', refRes.data.access_token.length);
    
    console.log('5. Logging out...');
    await api.post('/auth/logout', { refresh_token: refRes.data.refresh_token });
    console.log('Logged out');
    
    console.log('ALL E2E PASSED');
  } catch (e) {
    console.error('E2E FAILED:', e.response?.data || e.message);
    process.exit(1);
  }
}
run();
