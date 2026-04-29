const fs = require('fs');
const path = 'd:/dev/Airport Taxi tours/src/app/layout.js';
const content = fs.readFileSync(path, 'utf8');

// The new metadata object ends with this specific sequence:
const metadataEndMarker = 'apple: \'/logo.png\',\n    },\n}';
// The JSON-LD part starts with this:
const jsonLdStartMarker = '// JSON-LD Structured Data';

const endPos = content.indexOf(metadataEndMarker);
const startPos = content.indexOf(jsonLdStartMarker);

if (endPos !== -1 && startPos !== -1) {
    const part1 = content.substring(0, endPos + metadataEndMarker.length);
    const part2 = content.substring(startPos);
    const newContent = part1 + '\n\n' + part2;
    fs.writeFileSync(path, newContent);
    console.log('File cleaned successfully');
} else {
    console.log('Markers not found', { endPos, startPos });
}
