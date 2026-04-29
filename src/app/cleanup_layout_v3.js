const fs = require('fs');
const path = 'd:/dev/Airport Taxi tours/src/app/layout.js';
const content = fs.readFileSync(path, 'utf8');

const marker1 = "apple: '/logo.png',";
const jsonLdStartMarker = "// JSON-LD Structured Data";

const pos1 = content.indexOf(marker1);
const startPos = content.indexOf(jsonLdStartMarker);

if (pos1 !== -1 && startPos !== -1) {
    // Find the end of the metadata object after pos1
    const sub = content.substring(pos1);
    const endOfMetadata = sub.indexOf('}') + sub.substring(sub.indexOf('}') + 1).indexOf('}') + 1; // This is a bit hacky
    
    // Better: find the first '}' at column 0 after pos1
    const lines = content.split('\n');
    let endLine = -1;
    let startLine = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(marker1)) {
            // Found it, now find the '}' at column 0
            for (let j = i; j < lines.length; j++) {
                if (lines[j].trim() === '}' && lines[j].indexOf('}') === 0) {
                     endLine = j;
                     break;
                }
            }
        }
        if (lines[i].includes(jsonLdStartMarker)) {
            startLine = i;
        }
    }

    if (endLine !== -1 && startLine !== -1) {
        const newLines = [...lines.slice(0, endLine + 1), ...lines.slice(startLine)];
        fs.writeFileSync(path, newLines.join('\n'));
        console.log('File cleaned successfully at lines', endLine, startLine);
    } else {
        console.log('Lines not found', { endLine, startLine });
    }
} else {
    console.log('Markers not found', { pos1, startPos });
}
