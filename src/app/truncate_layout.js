const fs = require('fs');
const path = 'd:/dev/Airport Taxi tours/src/app/layout.js';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

// Keep lines 1-78 (index 0 to 77)
// Keep lines 790 onwards (index 789 onwards)
const newLines = [...lines.slice(0, 78), ...lines.slice(789)];
fs.writeFileSync(path, newLines.join('\n'));
console.log('File truncated successfully from line 79 to 789');
