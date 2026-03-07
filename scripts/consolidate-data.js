// This file will be populated by a script that extracts data from the scratchpads
const fs = require('fs');
const path = require('path');

const brainDir = 'C:/Users/chith/.gemini/antigravity/brain/f9c4013f-ac44-4a8f-bbd3-65b3f5ea01cb/browser/';
const scrapedFiles = [
    'scratchpad_3fkr54d3.md',            // Ultra Fidelity Packages
    'scratchpad_3bwgd6zy.md.resolved.4', // Packages (fallback)
    'scratchpad_1cugm8cu.md.resolved',   // Day Trips 1
    'scratchpad_f7uic7an.md.resolved.9'  // Day Trips 2
];

function extractJson(content) {
    const match = content.match(/```json\n([\s\S]*?)\n```/);
    if (match) return JSON.parse(match[1]);
    const match2 = content.match(/\[\s+\{[\s\S]*\}\s+\]/);
    if (match2) return JSON.parse(match2[0]);
    return [];
}

const allTours = [];
scrapedFiles.forEach(f => {
    const content = fs.readFileSync(path.join(brainDir, f), 'utf8');
    const data = extractJson(content);
    allTours.push(...data);
});

// Deduplicate by title
const uniqueTours = [];
const titles = new Set();
allTours.forEach(t => {
    const cleanTitle = t.title.toLowerCase().trim();
    if (!titles.has(cleanTitle)) {
        titles.add(cleanTitle);
        uniqueTours.push(t);
    }
});

fs.writeFileSync(path.join(__dirname, 'master-tours-data.json'), JSON.stringify(uniqueTours, null, 2));
console.log(`Consolidated ${uniqueTours.length} unique tours.`);
