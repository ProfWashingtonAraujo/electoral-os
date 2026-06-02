const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiZjhlM2Y2OC0wMWVmLTRjMzUtYjQ0Ny00NTFkMzZjODEyNjYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzgyNzM4MzIsImV4cCI6MTc3ODg3ODYzMn0.ojYqbFlXDvGzqDC55jPyX6leJePlfLVuLigcTakBgLE';

async function testCreateUser() {
  console.log('--- Testing POST /api/users ---');
  const res = await fetch('http://localhost:3001/api/users', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`
    },
    body: JSON.stringify({
      name: 'Teste Usuário',
      email: 'teste@electoralos.com.br',
      password: 'Teste@2025',
      role: 'admin'
    })
  });
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Body:', text);
  
  console.log('\n--- Testing GET /api/users ---');
  const res2 = await fetch('http://localhost:3001/api/users', {
    headers: { 'Authorization': `Bearer ${TOKEN}` }
  });
  const text2 = await res2.text();
  console.log('Status:', res2.status);
  console.log('Body:', text2);
}

testCreateUser().catch(console.error);
