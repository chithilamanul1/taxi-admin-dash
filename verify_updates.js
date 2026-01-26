const { chromium } = require('playwright');

(async () => {
    console.log('Starting Local Verification...');
    let browser;
    try {
        browser = await chromium.launch(); // Use installed playwright
        const page = await browser.newPage();

        // 1. Verify Homepage
        console.log('Checking Homepage...');
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
        const title = await page.title();
        console.log('Homepage Title:', title);

        // Check for Widget (look for text commonly in widget)
        const widgetVisible = await page.isVisible('text=Pick-up Location');
        console.log('Booking Widget Visible:', widgetVisible);

        // 2. Verify Pricing (KDH Update)
        console.log('\nChecking Pricing...');
        await page.goto('http://localhost:3000/prices', { waitUntil: 'networkidle' });
        // Look for KDH HIGHROOF
        const kdhVisible = await page.isVisible('text=KDH HIGHROOF');
        console.log('KDH HIGHROOF Listed:', kdhVisible ? 'YES' : 'NO');

        if (kdhVisible) {
            const capacity = await page.textContent('text=KDH HIGHROOF >> xpath=../.. >> text=7'); // Rough check for 7 pax often near title
            // Better: Grab the specific card content
            // But for now, simple text check is enough
            console.log('Found KDH HIGHROOF text on page.');
        }

        // 3. Verify Booking Actions
        console.log('\nChecking Booking Actions...');
        // Use the specific booking ID known
        await page.goto('http://localhost:3000/booking/697493d3e3e56d0d48a46167', { waitUntil: 'networkidle' });

        const pdfBtn = await page.isVisible('button:has-text("Download PDF")');
        const emailBtn = await page.isVisible('button:has-text("Email Receipt")');
        const ticketBtn = await page.isVisible('button:has-text("Report Issue")');

        console.log('Button - Download PDF:', pdfBtn ? 'PRESENT' : 'MISSING');
        console.log('Button - Email Receipt:', emailBtn ? 'PRESENT' : 'MISSING');
        console.log('Button - Report Issue:', ticketBtn ? 'PRESENT' : 'MISSING');

    } catch (error) {
        console.error('Verification Failed:', error.message);
    } finally {
        if (browser) await browser.close();
        console.log('\nVerification Complete.');
    }
})();
