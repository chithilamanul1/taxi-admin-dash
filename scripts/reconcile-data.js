const fs = require('fs');
const path = require('path');

const existing = JSON.parse(fs.readFileSync(path.join(__dirname, 'existing-tours.json'), 'utf8'));

// Load scraped data from the brain directory (I need the actual paths)
// I'll define them here manually based on my previous view_file calls
const scrapedFiles = [
    'C:/Users/chith/.gemini/antigravity/brain/f9c4013f-ac44-4a8f-bbd3-65b3f5ea01cb/browser/scratchpad_3bwgd6zy.md.resolved.4', // Packages
    'C:/Users/chith/.gemini/antigravity/brain/f9c4013f-ac44-4a8f-bbd3-65b3f5ea01cb/browser/scratchpad_1cugm8cu.md.resolved',        // Day Trips 1
    'C:/Users/chith/.gemini/antigravity/brain/f9c4013f-ac44-4a8f-bbd3-65b3f5ea01cb/browser/scratchpad_f7uic7an.md.resolved.9'       // Day Trips 2
];

function extractJson(content) {
    const match = content.match(/```json\n([\s\S]*?)\n```/);
    if (match) return JSON.parse(match[1]);
    const match2 = content.match(/\[\s+\{[\s\S]*\}\s+\]/);
    if (match2) return JSON.parse(match2[0]);
    return [];
}

const allScraped = [];
scrapedFiles.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    const data = extractJson(content);
    allScraped.push(...data);
});

const scrapedTitles = allScraped.map(s => s.title.toLowerCase().trim());
const missing = existing.filter(e => !scrapedTitles.includes(e.title.toLowerCase().trim()));

const results = {
    missingCount: missing.length,
    missingTitles: missing.map(m => m.title)
};
fs.writeFileSync(path.join(__dirname, 'reconciliation-results.json'), JSON.stringify(results, null, 2));
console.log(`Wrote reconciliation results for ${missing.length} missing tours.`);
