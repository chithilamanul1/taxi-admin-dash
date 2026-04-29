const fs = require('fs');

const content = fs.readFileSync('src/components/BookingModal.jsx', 'utf8');
const lines = content.split('\n');
const braces = [];
const parens = [];

lines.forEach((line, i) => {
    for (let char of line) {
        if (char === '{') braces.push(i + 1);
        else if (char === '}') {
            if (braces.length > 0) braces.pop();
            else console.log(`Extra } at line ${i + 1}`);
        }
        else if (char === '(') parens.push(i + 1);
        else if (char === ')') {
            if (parens.length > 0) parens.pop();
            else console.log(`Extra ) at line ${i + 1}`);
        }
    }
});

console.log(`Unclosed { : ${braces.length}`);
if (braces.length > 0) console.log(`Lines: ${braces.join(', ')}`);
console.log(`Unclosed ( : ${parens.length}`);
if (parens.length > 0) console.log(`Lines: ${parens.join(', ')}`);
