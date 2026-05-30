const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'BookingWidget.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add states for tours
content = content.replace(
    /const \[pricingSettings, setPricingSettings\] = useState\(null\);/,
    `const [pricingSettings, setPricingSettings] = useState(null);\n    const [airportTours, setAirportTours] = useState([]);\n    const [normalTours, setNormalTours] = useState([]);`
);

// 2. Add API Fetches to Promise.all
content = content.replace(
    /fetch\('\/api\/admin\/pricing-settings', \{ cache: 'no-store' \}\)\.then\(r => r\.json\(\)\)\.catch\(err => \{ console\.error\("Failed to fetch pricing settings", err\); return null; \}\),/,
    `fetch('/api/admin/pricing-settings', { cache: 'no-store' }).then(r => r.json()).catch(err => { console.error("Failed to fetch pricing settings", err); return null; }),
                    fetch('/api/admin/airport-tours', { cache: 'no-store' }).then(r => r.json()).catch(err => { console.error("Error", err); return null; }),
                    fetch('/api/admin/normal-tours', { cache: 'no-store' }).then(r => r.json()).catch(err => { console.error("Error", err); return null; }),`
);

// We need to match the returned array destructuring.
content = content.replace(
    /const \[marketingRes, destinationsRes, settingsRes, surgeRes, couponsRes\] = await Promise\.all\(\[/,
    `const [marketingRes, destinationsRes, settingsRes, airportToursRes, normalToursRes, surgeRes, couponsRes] = await Promise.all([`
);

// 3. Set states
content = content.replace(
    /if \(settingsRes\?\.success && settingsRes\.data\) \{\s*setPricingSettings\(settingsRes\.data\);\s*\}/,
    `if (settingsRes?.success && settingsRes.data) {\n                    setPricingSettings(settingsRes.data);\n                }\n                if (airportToursRes?.success && airportToursRes.data) {\n                    setAirportTours(airportToursRes.data);\n                }\n                if (normalToursRes?.success && normalToursRes.data) {\n                    setNormalTours(normalToursRes.data);\n                }`
);

// 4. Update calculatePrice call inside VehicleCarousel map
content = content.replace(
    /pricingSettings\.roundTripPackages,\s*pricingSettings\.airportRoundTripPackages/g,
    `normalTours,
                                                                    airportTours`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('BookingWidget updated successfully.');
