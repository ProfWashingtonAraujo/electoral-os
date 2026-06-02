async function testLogin() {
    try {
        const res = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@electoralos.com.br', password: 'Admin@2025' })
        });
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Response:', JSON.stringify(data, null, 2));
        if (data.token) {
            console.log('\n✅ Login successful! Token received.');
            // Test /me endpoint
            const meRes = await fetch('http://localhost:3001/api/auth/me', {
                headers: { Authorization: `Bearer ${data.token}` }
            });
            const meData = await meRes.json();
            console.log('\n/me response:', JSON.stringify(meData, null, 2));
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
}
testLogin();
export {};
//# sourceMappingURL=test-login.js.map