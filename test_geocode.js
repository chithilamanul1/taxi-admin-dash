const fs = require('fs');

async function run() {
    let key = '';
    if (fs.existsSync('.env')) {
        const env = fs.readFileSync('.env', 'utf8');
        const match = env.match(/NEXT_PUBLIC_GOOGLE_MAPS_API_KEY\s*=\s*(.*)/);
        if (match) key = match[1].trim().replace(/['"]/g, '');
    }

    if (!key) {
        console.error('No Google Maps API Key found.');
        return;
    }

    const geocode = async (address) => {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${key}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.status === 'OK') {
            const loc = data.results[0].geometry.location;
            console.log(`Address: "${address}" -> Lat: ${loc.lat}, Lng: ${loc.lng}`);
            return loc;
        } else {
            console.log(`Failed to geocode "${address}":`, data.status, data.error_message);
            return null;
        }
    };

    await geocode("se, Sri Lanka");
    await geocode("see, Sri Lanka");
    await geocode("seed, Sri Lanka");
    await geocode("seeduwa, Sri Lanka");
}

run().catch(console.error);
