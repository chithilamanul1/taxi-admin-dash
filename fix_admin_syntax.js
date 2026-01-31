
const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/app/admin/page.js');

try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    // Target Range: Lines 826 to 963 (1-based)
    // 0-based indices: 825 to 962
    const startIndex = 825;
    const count = 963 - 826 + 1; // 138 lines

    // Verification check
    const startLine = lines[startIndex].trim();
    const endLine = lines[startIndex + count - 1].trim();

    console.log(`Checking line ${startIndex + 1}: "${startLine}"`);
    console.log(`Checking line ${startIndex + count}: "${endLine}"`);

    // Verify signatures of the block to be removed
    // Line 826 should contain "pricingCategory === 'rentals'"
    // Line 963 should be ")}"
    if (startLine.includes("pricingCategory === 'rentals'") && endLine === ')}') {
        console.log('Verification successful. Removing lines...');

        lines.splice(startIndex, count);

        fs.writeFileSync(filePath, lines.join('\n'));
        console.log('Successfully removed duplicate code block.');
    } else {
        console.error('ERROR: Line content did not match expectations. Aborting safety check.');
        process.exit(1);
    }

} catch (err) {
    console.error('Failed to process file:', err);
    process.exit(1);
}
