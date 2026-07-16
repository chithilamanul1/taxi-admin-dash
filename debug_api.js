async function debugApi() {
    try {
        const res = await fetch('http://localhost:3000/api/admin/destinations');
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Response:', text.substring(0, 500));
    } catch (err) {
        console.error('Error:', err);
    }
}
debugApi();
