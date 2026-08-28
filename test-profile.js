async function run() {
  try {
    const regRes = await fetch('http://127.0.0.1:5001/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test',
        email: 'test6@example.com',
        password: 'password123'
      })
    });
    console.log('Register:', regRes.status, await regRes.text());
    
    const loginRes = await fetch('http://127.0.0.1:5001/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test6@example.com',
        password: 'password123'
      })
    });
    console.log('Login:', loginRes.status);
    const loginData = await loginRes.json();
    const token = loginData.access_token;
    
    const profRes = await fetch('http://127.0.0.1:5001/api/v1/users/profiles/customer', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        phone: '1234567890'
      })
    });
    console.log('Profile:', profRes.status, await profRes.text());
    
  } catch (err) {
    console.log('Error:', err.message);
  }
}
run();
