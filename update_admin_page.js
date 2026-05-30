const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'admin', 'page.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add states
content = content.replace(
    /const \[pricingSettings, setPricingSettings\] = useState\(\{([^}]+)\}\)/,
    `const [pricingSettings, setPricingSettings] = useState({$1})\n    const [airportTours, setAirportTours] = useState([])\n    const [normalTours, setNormalTours] = useState([])`
);

// 2. Add API Fetches
const pricingFetchStr = `// Fetch global settings
                fetch('/api/admin/pricing-settings', { cache: 'no-store' })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && data.data) {
                            setPricingSettings(ensureAllVehicles(data.data))
                        }
                        setIsLoading(false)
                    })
                    .catch(err => {
                        console.error(err)
                        setIsLoading(false)
                    })`;

const newFetchesStr = `// Fetch global settings
                fetch('/api/admin/pricing-settings', { cache: 'no-store' })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && data.data) {
                            setPricingSettings(ensureAllVehicles(data.data))
                        }
                        setIsLoading(false)
                    })
                    .catch(err => {
                        console.error(err)
                        setIsLoading(false)
                    })

                fetch('/api/admin/airport-tours', { cache: 'no-store' })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && Array.isArray(data.data)) setAirportTours(data.data)
                    })
                    .catch(console.error)

                fetch('/api/admin/normal-tours', { cache: 'no-store' })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && Array.isArray(data.data)) setNormalTours(data.data)
                    })
                    .catch(console.error)`;

content = content.replace(pricingFetchStr, newFetchesStr);

// 3. Remove ensureAllVehicles for the separated packages
// We can just strip out the Processing for normal and airport packages in ensureAllVehicles to avoid it recreating them.
content = content.replace(
    /\/\/ Process roundTripPackages \(Normal packages\)([\s\S]*?)updatedSettings\.roundTripPackages = normalPackages;/g,
    ''
);
content = content.replace(
    /\/\/ Process airportRoundTripPackages([\s\S]*?)updatedSettings\.airportRoundTripPackages = airportPackages;/g,
    ''
);

// 4. Update the Airport Round Tour UI
// Remove the global save button for Airport Tours (Save Changes)
content = content.replace(
    /<button\s+onClick=\{async \(\) => \{\s+const res = await fetch\('\/api\/admin\/pricing-settings'[\s\S]*?ShieldCheck size=\{16\} strokeWidth=\{3\} \/> Save Changes\s+<\/button>/g,
    ''
);

// Update "Add Airport Package" state updater
content = content.replace(
    /const exists = \(pricingSettings\.airportRoundTripPackages \|\| \[\]\)\.some\(p => p\.hours === newHours\);/g,
    'const exists = airportTours.some(p => p.hours === newHours);'
);
content = content.replace(
    /setPricingSettings\(\{\s*\.\.\.pricingSettings,\s*airportRoundTripPackages: \[\.\.\.\(pricingSettings\.airportRoundTripPackages \|\| \[\]\), \.\.\.newPackages\]\s*\}\);/g,
    'setAirportTours([...airportTours, ...newPackages]);'
);

// Update mapping and editing logic for Airport Tours
content = content.replace(
    /const uniqueAirportHours = \[\.\.\.new Set\(\(pricingSettings\.airportRoundTripPackages \|\| \[\]\)\.map\(p => p\.hours\)\)\]\.sort\(\(a, b\) => a - b\);/g,
    'const uniqueAirportHours = [...new Set(airportTours.map(p => p.hours))].sort((a, b) => a - b);'
);
content = content.replace(
    /initialPackages=\{\(pricingSettings\.airportRoundTripPackages \|\| \[\]\)\.filter\(p => p\.hours === hours\)\}/g,
    'initialPackages={airportTours.filter(p => p.hours === hours)}'
);
content = content.replace(
    /const updated = \(pricingSettings\.airportRoundTripPackages \|\| \[\]\)\.map\(p => \{/g,
    'const updated = airportTours.map(p => {'
);
content = content.replace(
    /setPricingSettings\(\{ \.\.\.pricingSettings, airportRoundTripPackages: updated \}\);/g,
    'setAirportTours(updated);'
);
content = content.replace(
    /const updated = \(pricingSettings\.airportRoundTripPackages \|\| \[\]\)\.filter\(p => p\.hours !== h\);/g,
    'const updated = airportTours.filter(p => p.hours !== h);'
);
content = content.replace(
    /const updatedSettings = \{ \.\.\.pricingSettings, airportRoundTripPackages: updated \};/g,
    ''
);
// In onDeleteGroup
content = content.replace(
    /setPricingSettings\(\{ \.\.\.pricingSettings, airportRoundTripPackages: updated \}\);\s*const res = await fetch\('\/api\/admin\/pricing-settings'[\s\S]*?alert\('Failed to save packages\.'\);\s*\}/g,
    `setAirportTours(updated);\n                                                        const res = await fetch('/api/admin/airport-tours', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ packages: updated }) });\n                                                        const data = await res.json();\n                                                        if (!data.success) alert('Failed to delete package.');`
);
// In onSaveGroup
content = content.replace(
    /const newSettings = \{ \.\.\.pricingSettings, airportRoundTripPackages: updated \};\s*setPricingSettings\(newSettings\);\s*const res = await fetch\('\/api\/admin\/pricing-settings', \{\s*method: 'PUT',\s*headers: \{ 'Content-Type': 'application\/json' \},\s*body: JSON\.stringify\(newSettings\)\s*\}\);\s*const data = await res\.json\(\);\s*if \(data\.success\) \{\s*alert\(\`\$\{hours\}H Package saved successfully!\`\);\s*\} else \{\s*alert\('Failed to save packages\.'\);\s*\}/g,
    `setAirportTours(updated);\n                                                        const res = await fetch('/api/admin/airport-tours', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ packages: updated }) });\n                                                        const data = await res.json();\n                                                        if (data.success) { alert(\`\${hours}H Package saved successfully!\`); } else { alert('Failed to save packages.'); }`
);

// 5. Update the Normal Round Tour UI
// Remove global save button
content = content.replace(
    /<button\s+onClick=\{async \(\) => \{\s+const res = await fetch\('\/api\/admin\/pricing-settings'[\s\S]*?ShieldCheck size=\{16\} strokeWidth=\{3\} \/> Save Changes\s+<\/button>/g,
    ''
);

// Add Hour Package logic
content = content.replace(
    /const exists = \(pricingSettings\.roundTripPackages \|\| \[\]\)\.some\(p => p\.hours === newHours\);/g,
    'const exists = normalTours.some(p => p.hours === newHours);'
);
content = content.replace(
    /setPricingSettings\(\{\s*\.\.\.pricingSettings,\s*roundTripPackages: \[\.\.\.\(pricingSettings\.roundTripPackages \|\| \[\]\), \.\.\.newPackages\]\s*\}\);/g,
    'setNormalTours([...normalTours, ...newPackages]);'
);

// Map and filter logic for Normal Tours
content = content.replace(
    /const uniqueNormalHours = \[\.\.\.new Set\(\(pricingSettings\.roundTripPackages \|\| \[\]\)\.map\(p => p\.hours\)\)\]\.sort\(\(a, b\) => a - b\);/g,
    'const uniqueNormalHours = [...new Set(normalTours.map(p => p.hours))].sort((a, b) => a - b);'
);
content = content.replace(
    /initialPackages=\{\(pricingSettings\.roundTripPackages \|\| \[\]\)\.filter\(p => p\.hours === hours\)\}/g,
    'initialPackages={normalTours.filter(p => p.hours === hours)}'
);
content = content.replace(
    /const updated = \(pricingSettings\.roundTripPackages \|\| \[\]\)\.map\(p => \{/g,
    'const updated = normalTours.map(p => {'
);
content = content.replace(
    /setPricingSettings\(\{ \.\.\.pricingSettings, roundTripPackages: updated \}\);/g,
    'setNormalTours(updated);'
);
content = content.replace(
    /const updated = \(pricingSettings\.roundTripPackages \|\| \[\]\)\.filter\(p => p\.hours !== h\);/g,
    'const updated = normalTours.filter(p => p.hours !== h);'
);
// In onDeleteGroup for normal
content = content.replace(
    /setPricingSettings\(\{ \.\.\.pricingSettings, roundTripPackages: updated \}\);/g,
    `setNormalTours(updated);\n                                                        fetch('/api/admin/normal-tours', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ packages: updated }) });`
);
// In onSaveGroup for normal
content = content.replace(
    /const newSettings = \{ \.\.\.pricingSettings, roundTripPackages: updated \};\s*setPricingSettings\(newSettings\);\s*const res = await fetch\('\/api\/admin\/pricing-settings', \{\s*method: 'PUT',\s*headers: \{ 'Content-Type': 'application\/json' \},\s*body: JSON\.stringify\(newSettings\)\s*\}\);\s*const data = await res\.json\(\);\s*if \(data\.success\) \{\s*alert\(\`\$\{hours\}H Package saved successfully!\`\);\s*\} else \{\s*alert\('Failed to save packages\.'\);\s*\}/g,
    `setNormalTours(updated);\n                                                        const res = await fetch('/api/admin/normal-tours', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ packages: updated }) });\n                                                        const data = await res.json();\n                                                        if (data.success) { alert(\`\${hours}H Package saved successfully!\`); } else { alert('Failed to save packages.'); }`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Admin page updated successfully.');
