const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const LOG_FILE = 'night_log.txt';

function log(message) {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] ${message}\n`;
    console.log(message);
    fs.appendFileSync(LOG_FILE, entry);
}

function runAsync(command) {
    try {
        log(`Executing: ${command}`);
        return execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    } catch (error) {
        log(`Error executing ${command}: ${error.message}`);
        return error.stdout || error.message;
    }
}

function fixLintErrors(errors) {
    log(`Attempting to fix ${errors.length} lint error files...`);

    errors.forEach(fileError => {
        const filePath = fileError.filePath;
        if (!fs.existsSync(filePath)) return;

        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        fileError.messages.forEach(msg => {
            // Fix: 'X' is defined but never used
            if (msg.message.includes('defined but never used')) {
                const varName = msg.message.split("'")[1];
                const regex = new RegExp(`(const|let|var|import)\\s+\\{?\\s*${varName}\\s*\\}?\\s*(=|from|;)`, 'g');
                // Simple comment-out fix for unused variables
                if (content.includes(varName)) {
                    log(`Fixing unused variable '${varName}' in ${filePath}`);
                    content = content.replace(new RegExp(`\\b${varName}\\b`, 'g'), `/* unused */ ${varName}`);
                    modified = true;
                }
            }

            // Fix: Missing return in arrow function
            if (msg.ruleId === 'arrow-body-style' && content.includes('=> {')) {
                // This is complex for regex, but let's try a simple wrap if it's on one line
            }
        });

        if (modified) {
            fs.writeFileSync(filePath, content);
            log(`Updated ${filePath}`);
        }
    });
}

function main() {
    log('--- NIGHT MANAGER START ---');

    // Phase 1: Lint
    log('Phase 1: Running Lint...');
    const lintOutput = runAsync('npm run lint -- --format json');

    try {
        const errors = JSON.parse(lintOutput);
        const filesWithErrors = errors.filter(e => e.errorCount > 0);

        if (filesWithErrors.length > 0) {
            log(`Found errors in ${filesWithErrors.length} files.`);
            fixLintErrors(filesWithErrors);

            log('Re-running lint to verify fixes...');
            runAsync('npm run lint');
        } else {
            log('No lint errors found.');
        }
    } catch (e) {
        log('Failed to parse lint output as JSON. Check npm configuration.');
    }

    // Phase 2: Build
    log('Phase 2: Running Build...');
    const buildOutput = runAsync('npm run build');

    if (buildOutput.includes('Compiled successfully') || buildOutput.includes('Done')) {
        log('Build SUCCESSFUL.');
    } else {
        log('Build FAILED. Check build_log.txt or terminal output.');
    }

    log('--- NIGHT MANAGER FINISHED ---');
}

main();
