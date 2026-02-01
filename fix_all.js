
const fs = require('fs');

const filePath = 'src/app/admin/page.js';
let content = fs.readFileSync(filePath, 'utf8');

console.log('=== Before fixes ===');
console.log('Opening divs:', (content.match(/<div/g) || []).length);
console.log('Closing divs:', (content.match(/<\/div>/g) || []).length);
console.log('Malformed </div >:', (content.match(/<\/div\s+>/g) || []).length);

// Step 1: Fix ALL malformed </div > tags (with any whitespace before >)
content = content.replace(/<\/div\s+>/g, '</div>');
console.log('\nFixed all malformed </div > tags');

// Step 2: Recount
const opens = (content.match(/<div/g) || []).length;
const closes = (content.match(/<\/div>/g) || []).length;
console.log('After fix - Opening divs:', opens);
console.log('After fix - Closing divs:', closes);

const missing = opens - closes;
console.log('Missing closing divs:', missing);

// Step 3: Find the return statement closing and add missing divs
if (missing > 0) {
    // Find the pattern "    )" at end of file (return statement close)
    // and insert the missing closing divs before it
    const lines = content.split('\n');

    // Find the last line that is just ")" or similar (end of return)
    for (let i = lines.length - 1; i >= 0; i--) {
        const trimmed = lines[i].trim();
        if (trimmed === ')' && lines[i + 1] && lines[i + 1].trim() === '}') {
            console.log(`Found return close at line ${i + 1}`);

            // Calculate proper indentation based on existing structure
            // We need to add divs with decreasing indentation
            const newClosingDivs = [];
            const baseIndent = '        '; // 8 spaces
            for (let j = 0; j < missing; j++) {
                // Decrease by 4 spaces for each level
                const indent = ' '.repeat(Math.max(0, 8 - (j * 4)));
                newClosingDivs.push(indent + '</div>');
            }

            // Insert the closing divs before the )
            lines.splice(i, 0, ...newClosingDivs);
            console.log(`Inserted ${missing} closing divs`);
            break;
        }
    }

    content = lines.join('\n');
}

// Final verification
const finalOpens = (content.match(/<div/g) || []).length;
const finalCloses = (content.match(/<\/div>/g) || []).length;
console.log('\n=== After all fixes ===');
console.log('Opening divs:', finalOpens);
console.log('Closing divs:', finalCloses);
console.log('Balance:', finalOpens - finalCloses === 0 ? 'BALANCED' : `UNBALANCED by ${finalOpens - finalCloses}`);

fs.writeFileSync(filePath, content);
console.log('\nFile saved!');
