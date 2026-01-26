// qa_droid.js
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    console.log('🤖 QA Droid: Starting Night Patrol...');

    // 1. Launch the "Ghost" Browser
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const baseUrl = 'http://localhost:3000'; // Make sure your app is running!

    // Log File Setup
    const logStream = fs.createWriteStream('QA_REPORT.md');
    const log = (msg) => {
        console.log(msg);
        logStream.write(msg + '\n');
    };

    log('# 🕵️ QA Droid Report\n');

    // 2. The "Bug Trap" (Listens for invisible errors)
    page.on('console', msg => {
        if (msg.type() === 'error') log(`❌ [CONSOLE ERROR]: ${msg.text()}`);
    });
    page.on('pageerror', err => log(`🔥 [CRASH]: ${err.message}`));
    page.on('response', response => {
        if (response.status() === 404) log(`⚠️ [404 MISSING]: ${response.url()}`);
        if (response.status() === 500) log(`🔥 [500 SERVER ERROR]: ${response.url()}`);
    });

    try {
        // 3. Visit Dashboard
        log('## Testing: Dashboard Page');
        // Using a more generic path if /dashboard/projects doesn't exist, but sticking to user request
        await page.goto(`${baseUrl}/dashboard/projects`, { waitUntil: 'networkidle' }).catch(() => log('⚠️ /dashboard/projects not reachable? Check if server is up.'));
        await page.waitForTimeout(1000); // Wait for animations
        log('✅ Navigation successful');

        // 4. "Visual Bug" Check (Takes a screenshot for you to see)
        await page.screenshot({ path: 'evidence/dashboard_screenshot.png', fullPage: true });
        log('📸 Screenshot saved to /evidence/dashboard_screenshot.png');

        // 5. The "Button Masher" (Finds all buttons and checks them)
        const buttons = await page.$$('button');
        log(`found ${buttons.length} buttons. Checking them...`);

        for (let i = 0; i < buttons.length; i++) {
            const isVisible = await buttons[i].isVisible();
            const isDisabled = await buttons[i].isDisabled();

            if (isVisible && !isDisabled) {
                // We hover to check for hover-state CSS bugs
                await buttons[i].hover();
                log(`- Button ${i + 1}: Interactable ✅`);
            } else {
                log(`- Button ${i + 1}: ⚠️ Hidden or Disabled`);
            }
        }

        // 6. Test Client Portal
        log('\n## Testing: Client Portal');
        await page.goto(`${baseUrl}/portal`, { waitUntil: 'networkidle' }).catch(() => log('⚠️ /portal not reachable?'));
        await page.screenshot({ path: 'evidence/portal_screenshot.png' });

        // Check if the "Project Timeline" exists
        const timeline = await page.$('text="Project Timeline"');
        if (timeline) log('✅ Project Timeline element found.');
        else log('❌ UI BUG: Project Timeline missing on Portal!');

    } catch (error) {
        log(`\n💥 FATAL ERROR: Script failed to run. ${error.message}`);
    } finally {
        await browser.close();
        log('\n🤖 QA Patrol Finished. Check QA_REPORT.md for details.');
        logStream.end();
    }
})();
