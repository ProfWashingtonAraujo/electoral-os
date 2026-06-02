async function test() {
    try {
        const res = await fetch('http://localhost:3001/api/voters');
        const text = await res.text();
        console.log('API Voters Raw:', text);
        try {
            console.log('API Voters JSON:', JSON.parse(text));
        }
        catch {
            console.log('API Voters is not JSON');
        }
    }
    catch (error) {
        console.error('Fetch failed:', error);
    }
}
test();
export {};
//# sourceMappingURL=test-api.js.map