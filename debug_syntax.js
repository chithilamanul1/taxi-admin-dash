
const fs = require('fs');
const path = require('path');

const filePath = process.argv[2] || 'src/app/admin/page.js';
const content = fs.readFileSync(filePath, 'utf8');

function checkBalance(text) {
    const stack = [];
    const mapping = { '}': '{', ')': '(', ']': '[' };
    let inString = null; // ' or " or `
    let inComment = false; // // or /* */
    let commentType = null; // 'line' or 'block'

    const lines = text.split('\n');

    for (let lineNo = 0; lineNo < lines.length; lineNo++) {
        const line = lines[lineNo];
        for (let col = 0; col < line.length; col++) {
            const char = line[col];
            const nextChar = line[col + 1];

            // Handle Strings
            if (inString) {
                if (char === '\\') {
                    col++; // skip escaped char
                } else if (char === inString) {
                    inString = null;
                }
                continue;
            }

            // Handle Comments
            if (inComment) {
                if (commentType === 'block' && char === '*' && nextChar === '/') {
                    inComment = false;
                    col++;
                } else if (commentType === 'line' && col === line.length - 1) {
                    inComment = false; // Reset at end of line
                }
                continue;
            }

            // Start Comment?
            if (char === '/' && nextChar === '*') {
                inComment = true;
                commentType = 'block';
                col++;
                continue;
            }
            if (char === '/' && nextChar === '/') {
                inComment = true; // effectively skip rest of line
                commentType = 'line';
                break; // Skip rest of loop for this line
            }

            // Start String?
            if (['"', "'", '`'].includes(char)) {
                inString = char;
                continue;
            }

            // Brackets
            if (['{', '(', '['].includes(char)) {
                stack.push({ char, line: lineNo + 1, col: col + 1 });
            } else if (['}', ')', ']'].includes(char)) {
                if (stack.length === 0) {
                    return `Error: Unexpected '${char}' at line ${lineNo + 1}:${col + 1}. Stack empty.`;
                }
                const last = stack.pop();
                if (last.char !== mapping[char]) {
                    return `Error: Mismatched '${char}' at line ${lineNo + 1}:${col + 1}. Expected closing fo '${last.char}' (opened at ${last.line}:${last.col}).`;
                }
            }
        }
    }

    if (stack.length > 0) {
        const last = stack[stack.length - 1];
        return `Error: Unclosed '${last.char}' at line ${last.line}:${last.col} (reached EOF).`;
    }

    return "Success: Brackets are balanced.";
}

console.log(checkBalance(content));
