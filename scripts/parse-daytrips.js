const fs = require('fs');
const path = require('path');

const csvPath = path.join(process.cwd(), 'public/daytrips.csv');
const rawContent = fs.readFileSync(csvPath, 'utf8');

function parseCSV(csvText) {
    const rows = [];
    let currentRow = [];
    let currentCell = '';
    let inQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        if (char === '"') {
            if (inQuotes && csvText[i + 1] === '"') {
                currentCell += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            currentRow.push(currentCell.trim());
            currentCell = '';
        } else if (char === '\n' && !inQuotes) {
            currentRow.push(currentCell.trim());
            rows.push(currentRow);
            currentRow = [];
            currentCell = '';
        } else {
            currentCell += char;
        }
    }
    if (currentCell) currentRow.push(currentCell.trim());
    if (currentRow.length > 0) rows.push(currentRow);
    return rows;
}

const allRows = parseCSV(rawContent);
const header = allRows[0];
const dataRows = allRows.slice(1);

const tours = dataRows.map(row => {
    const title = row[16] || row[2];
    if (!title || title.length < 5) return null;

    const tour = {
        title: title,
        category: 'day-trip',
        description: row[22]?.replace('Show More', '').trim() || '',
        inclusions: [],
        exclusions: [],
        notSuitableFor: [],
        notAllowed: [],
        experience: [],
        price: { amount: 25, currency: 'USD', type: 'from' }
    };

    const pStr = row[21] || row[3];
    if (pStr) {
        const m = pStr.match(/[\d.]+/);
        if (m) tour.price.amount = parseFloat(m[0]);
    }

    function getSection(startKey, endKey) {
        let startIdx = -1;
        for (let i = 0; i < row.length; i++) {
            if (row[i].toLowerCase() === startKey.toLowerCase()) {
                startIdx = i;
                break;
            }
        }
        if (startIdx === -1) return [];

        const items = [];
        for (let i = startIdx + 1; i < row.length; i++) {
            const cell = row[i];
            if (!cell) continue;
            if (endKey && cell.toLowerCase().includes(endKey.toLowerCase())) break;
            if (['exclude', 'not allowed', 'not suitable for'].includes(cell.toLowerCase())) break;

            const cleaned = cell.trim();
            if (cleaned.length > 2 && !/^\d+\.$/.test(cleaned)) {
                items.push(cleaned);
            }
        }
        // Join fragmented items if they are short and followed by lowercase
        const merged = [items[0]];
        for (let i = 1; i < items.length; i++) {
            const last = merged[merged.length - 1];
            if (last && (last.length < 15 || !/^[A-Z]/.test(items[i]))) {
                merged[merged.length - 1] = last + ' ' + items[i];
            } else {
                merged.push(items[i]);
            }
        }
        return merged.filter(x => x);
    }

    tour.inclusions = getSection('Include', 'Exclude');
    tour.exclusions = getSection('Exclude', 'Not Suitable For');
    tour.notSuitableFor = getSection('Not Suitable For - [ People with ]', 'Not Allowed');
    tour.notAllowed = getSection('Not Allowed', '#######');

    let expStart = -1;
    for (let i = 0; i < row.length; i++) {
        if (row[i].includes('Below are the locations for your day trip')) {
            expStart = i;
            break;
        }
    }
    if (expStart !== -1) {
        let rawExp = row.slice(expStart).join(' ');
        const parts = rawExp.split(/\d+\./).filter(p => p.trim());
        tour.experience = parts.map(p => {
            const text = p.trim().replace(/\s+/g, ' ');
            // Heading is the first few words or until first period
            const endOfHeading = text.indexOf('.') > 0 && text.indexOf('.') < 40 ? text.indexOf('.') : 30;
            const heading = text.substring(0, endOfHeading).trim();
            return { heading, text };
        }).filter(e => e.heading && e.heading.length > 2).slice(0, 10);
    }

    return tour;
}).filter(t => t && t.title);

const finalUnique = [];
const seenT = new Set();
for (const t of tours) {
    if (!seenT.has(t.title)) {
        finalUnique.push(t);
        seenT.add(t.title);
    }
}

fs.writeFileSync('scripts/parsed-daytrips.json', JSON.stringify(finalUnique, null, 2));
console.log(`Parsed ${finalUnique.length} unique day trips.`);
