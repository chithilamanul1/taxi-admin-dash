
const acorn = require('acorn');
const jsx = require('acorn-jsx');
const fs = require('fs');

const code = fs.readFileSync('src/app/admin/page.js', 'utf8');

const Parser = acorn.Parser.extend(jsx());

try {
    Parser.parse(code, {
        ecmaVersion: 2020,
        sourceType: 'module',
        locations: true
    });
    console.log('No syntax errors found!');
} catch (e) {
    console.log('Syntax Error at line', e.loc.line, 'column', e.loc.column);
    console.log('Message:', e.message);

    // Show context around the error
    const lines = code.split('\n');
    const start = Math.max(0, e.loc.line - 5);
    const end = Math.min(lines.length, e.loc.line + 3);

    for (let i = start; i < end; i++) {
        const marker = i + 1 === e.loc.line ? '>>> ' : '    ';
        console.log(marker + (i + 1) + ': ' + lines[i]);
    }
}
