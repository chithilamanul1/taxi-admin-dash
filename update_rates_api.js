const sigiriyaTiers = {
    'mini-car': [
        { minKm: 0, maxKm: 20, type: 'flat', value: 7000 },
        { minKm: 21, maxKm: 40, type: 'flat', value: 9000 },
        { minKm: 41, maxKm: 60, type: 'per-km', value: 150 },
        { minKm: 61, maxKm: 100, type: 'per-km', value: 150 },
        { minKm: 100, maxKm: 9999, type: 'per-km', value: 135 }
    ],
    'sedan': [
        { minKm: 0, maxKm: 20, type: 'flat', value: 9000 },
        { minKm: 21, maxKm: 40, type: 'flat', value: 11000 },
        { minKm: 41, maxKm: 60, type: 'per-km', value: 180 },
        { minKm: 61, maxKm: 100, type: 'per-km', value: 170 },
        { minKm: 100, maxKm: 9999, type: 'per-km', value: 155 }
    ]
};

const ellaTiers = {
    'mini-car': [
        { minKm: 0, maxKm: 20, type: 'flat', value: 7000 },
        { minKm: 21, maxKm: 40, type: 'flat', value: 9000 },
        { minKm: 41, maxKm: 60, type: 'per-km', value: 150 },
        { minKm: 61, maxKm: 100, type: 'per-km', value: 150 },
        { minKm: 100, maxKm: 9999, type: 'per-km', value: 135 }
    ],
    'sedan': [
        { minKm: 0, maxKm: 20, type: 'flat', value: 9000 },
        { minKm: 21, maxKm: 40, type: 'flat', value: 11000 },
        { minKm: 41, maxKm: 60, type: 'per-km', value: 180 },
        { minKm: 61, maxKm: 100, type: 'per-km', value: 170 },
        { minKm: 100, maxKm: 9999, type: 'per-km', value: 155 }
    ]
};

async function updateRates() {
    try {
        const res = await fetch('http://localhost:3000/api/admin/destinations');
        const data = await res.json();
        const destinations = data.data;

        // Update Sigiriya
        const sigiriya = destinations.find(d => d.name.toLowerCase().includes('sigiriya') && (!d.pickupLocation || d.pickupLocation.trim() === ''));
        if (sigiriya) {
            const updateRes = await fetch('http://localhost:3000/api/admin/destinations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    _id: sigiriya._id,
                    vehicleTiers: sigiriyaTiers,
                    applicableRideType: 'all'
                })
            });
            console.log('Updated Sigiriya:', await updateRes.json());
        } else {
            const createRes = await fetch('http://localhost:3000/api/admin/destinations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Sigiriya, Sri Lanka',
                    pickupLocation: '',
                    applicableRideType: 'all',
                    vehicleTiers: sigiriyaTiers,
                    route_id: `route_global_sigiriya_${Date.now().toString().slice(-6)}`,
                    title: 'Airport to Sigiriya, Sri Lanka'
                })
            });
            console.log('Created Sigiriya:', await createRes.json());
        }

        // Update Ella
        const ella = destinations.find(d => d.name.toLowerCase().includes('ella') && (!d.pickupLocation || d.pickupLocation.trim() === ''));
        if (ella) {
            const updateRes = await fetch('http://localhost:3000/api/admin/destinations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    _id: ella._id,
                    vehicleTiers: ellaTiers,
                    applicableRideType: 'all'
                })
            });
            console.log('Updated Ella:', await updateRes.json());
        } else {
            const createRes = await fetch('http://localhost:3000/api/admin/destinations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Ella, Sri Lanka',
                    pickupLocation: '',
                    applicableRideType: 'all',
                    vehicleTiers: ellaTiers,
                    route_id: `route_global_ella_${Date.now().toString().slice(-6)}`,
                    title: 'Airport to Ella, Sri Lanka'
                })
            });
            console.log('Created Ella:', await createRes.json());
        }

    } catch (err) {
        console.error('Error:', err);
    }
}

updateRates();
