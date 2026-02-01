
const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/app/admin/page.js');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Count before
    const openingBefore = (content.match(/<div/g) || []).length;
    const closingBefore = (content.match(/<\/div>/g) || []).length;
    console.log(`Before: ${openingBefore} opening, ${closingBefore} closing`);

    // Fix all </div > with space to </div>
    content = content.replace(/<\/div\s+>/g, '</div>');
    console.log('Fixed malformed </div > tags');

    // Count after fix
    const openingAfter = (content.match(/<div/g) || []).length;
    const closingAfter = (content.match(/<\/div>/g) || []).length;
    console.log(`After space fix: ${openingAfter} opening, ${closingAfter} closing`);

    // If still unbalanced, need to add closing divs at the end
    const diff = openingAfter - closingAfter;
    if (diff > 0) {
        console.log(`Need to add ${diff} closing </div> tag(s)`);

        // Find the position right before the final )
        // and add the missing closing divs
        const lines = content.split('\n');
        const lastLineIndex = lines.length - 1;

        // Find the line with "    )" (the return statement close)
        for (let i = lastLineIndex; i >= 0; i--) {
            if (lines[i].trim() === ')') {
                // Insert closing divs before this line
                const indent = '        ';
                const closingDivs = [];
                for (let j = 0; j < diff; j++) {
                    closingDivs.push(indent + '</div>');
                }
                lines.splice(i, 0, ...closingDivs);
                console.log(`Inserted ${diff} closing div(s) at line ${i}`);
                break;
            }
        }

        content = lines.join('\n');
    }

    // Final count
    const finalOpening = (content.match(/<div/g) || []).length;
    const finalClosing = (content.match(/<\/div>/g) || []).length;
    console.log(`Final: ${finalOpening} opening, ${finalClosing} closing`);

    fs.writeFileSync(filePath, content);
    console.log('File saved successfully');

} catch (err) {
    console.error('Error:', err);
    process.exit(1);
}
