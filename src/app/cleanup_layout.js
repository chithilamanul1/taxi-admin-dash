const fs = require('fs');
const path = 'd:/dev/Airport Taxi tours/src/app/layout.js';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

// Find the line where the new metadata ends (line 78 approx)
// It ends with a '}' followed by '}' and then keywords.
// Actually, I'll just find the first occurrence of 'export const metadata = {' and its closing '}'.
// And then delete everything until 'const jsonLd = {'.

let startIndex = -1;
let endIndex = -1;
let jsonLdStart = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('export const metadata = {')) {
        startIndex = i;
    }
    if (startIndex !== -1 && lines[i].trim() === '}' && endIndex === -1) {
        // Find the matching brace for metadata object
        // Actually, my new metadata ends with '},' for icons and then '}' for object.
        // Let's find 'apple: \'/logo.png\',' then the next two '}'
        if (i > 0 && lines[i-1].includes('apple:')) {
             // this might be tricky.
        }
    }
}

// Safer approach: 
// The file should have:
// imports
// metadata object
// jsonLd object
// fonts
// RootLayout

// I'll look for the FIRST 'export const metadata' and the FIRST 'const jsonLd'
// and delete everything in between except the end of metadata.

const metadataStart = content.indexOf('export const metadata = {');
const jsonLdStartPos = content.indexOf('const jsonLd = {');

if (metadataStart !== -1 && jsonLdStartPos !== -1) {
    const beforeMetadata = content.substring(0, metadataStart);
    const metadataPart = content.substring(metadataStart, jsonLdStartPos);
    
    // In metadataPart, find the LAST '}' that belongs to metadata
    const lastBrace = metadataPart.lastIndexOf('}');
    const cleanMetadata = metadataPart.substring(0, lastBrace + 1);
    
    const rest = content.substring(jsonLdStartPos);
    
    const newContent = beforeMetadata + cleanMetadata + '\n\n// JSON-LD Structured Data\n' + rest;
    fs.writeFileSync(path, newContent);
    console.log('File cleaned successfully');
} else {
    console.log('Could not find metadata or jsonLd markers');
}
