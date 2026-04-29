const fs = require('fs');

const content = fs.readFileSync('src/components/BookingModal.jsx', 'utf8');
const lines = content.split('\n');
const stack = [];

lines.forEach((line, i) => {
    const tokens = line.match(/<(div|\/div)\b/g);
    if (tokens) {
        tokens.forEach(token => {
            if (token === '<div') {
                stack.push(i + 1);
            } else {
                if (stack.length > 0) {
                    stack.pop();
                } else {
                    console.log(`Extra </div> at line ${i + 1}`);
                }
            }
        });
    }
});

if (stack.length > 0) {
    console.log(`Unclosed <div> at lines: ${stack.join(', ')}`);
} else {
    console.log('All divs balanced!');
}
