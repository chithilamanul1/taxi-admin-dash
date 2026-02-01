
const fs = require('fs');

const content = fs.readFileSync('src/app/admin/page.js', 'utf8');
const lines = content.split('\n');

let depth = 0;
let minDepth = 0;
let minDepthLine = 0;
let returnStart = -1;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Find return statement
    if (line.includes('return (')) {
        returnStart = lineNum;
        console.log(`Return statement at line ${lineNum}`);
    }

    if (returnStart === -1) continue; // Skip until return

    // Count div opens and closes on this line
    const opens = (line.match(/<div/g) || []).length;
    const closes = (line.match(/<\/div/g) || []).length;

    const prevDepth = depth;
    depth += opens - closes;

    // Track when depth goes negative (invalid state)
    if (depth < minDepth) {
        minDepth = depth;
        minDepthLine = lineNum;
    }

    // Log significant changes
    if (opens > 0 || closes > 0) {
        if (depth < 1 && lineNum > returnStart) {
            console.log(`Line ${lineNum}: opens=${opens}, closes=${closes}, depth=${prevDepth}->${depth} ** LOW DEPTH`);
        }
    }

    // If depth goes to 0 or negative before EOF
    if (depth <= 0 && lineNum < lines.length - 10) {
        console.log(`WARNING: Depth reached ${depth} at line ${lineNum} - possibly premature close`);
        console.log(`  Content: ${line.trim().substring(0, 80)}...`);
    }
}

console.log(`\nFinal depth at EOF: ${depth}`);
console.log(`Minimum depth reached: ${minDepth} at line ${minDepthLine}`);
if (depth !== 0) {
    console.log(`\nStructural issue: Depth should be 0 at end, but is ${depth}`);
    if (depth > 0) console.log(`Missing ${depth} closing </div> tag(s)`);
    if (depth < 0) console.log(`${-depth} extra closing </div> tag(s)`);
}
