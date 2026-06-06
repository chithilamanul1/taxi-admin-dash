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

    const origin = "Bandaranaike International Airport (CMB), Sri Lanka";
    const destination = "Bandaranaike International Airport (CMB), Sri Lanka";
    const waypoints = ["seeduwa, Sri Lanka"];

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&waypoints=${encodeURIComponent(waypoints.join('|'))}&key=${key}`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.status === 'OK') {
        const route = data.routes[0];
        let totalDistance = 0;
        let totalDuration = 0;
        route.legs.forEach((leg, index) => {
            console.log(`Leg ${index}: ${leg.start_address} -> ${leg.end_address} | Distance: ${leg.distance.text} (${leg.distance.value} m) | Duration: ${leg.duration.text}`);
            totalDistance += leg.distance.value;
            totalDuration += leg.duration.value;
        });
        console.log(`Total Distance: ${totalDistance} m (${totalDistance / 1000} km)`);
        console.log(`Total Duration: ${totalDuration / 60} min`);
    } else {
        console.log('Directions failed:', data.status, data.error_message);
    }
}

run().catch(console.error);
