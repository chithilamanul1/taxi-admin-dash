
require('dotenv').config({ path: '.env' });
const { Resend } = require('resend');

async function testEmail() {
    console.log('--- Email Test Script ---');
    const key = process.env.RESEND_API_KEY;
    console.log('Checking Key:', key ? `Present (${key.slice(0, 5)}...)` : 'MISSING');

    if (!key) {
        console.error('ERROR: RESEND_API_KEY is missing in .env.local');
        process.exit(1);
    }

    const resend = new Resend(key);
    const from = 'onboarding@resend.dev'; // Use verified testing domain
    const to = 'airporttaxis.lk@gmail.com';

    console.log(`Sending from: ${from}`);
    console.log(`Sending to: ${to}`);

    try {
        const data = await resend.emails.send({
            from: from,
            to: to,
            subject: 'Direct Node Test',
            html: '<strong>It works!</strong>'
        });

        if (data.error) {
            console.error('RESEND API ERROR:', data.error);
        } else {
            console.log('SUCCESS:', data);
        }
    } catch (e) {
        console.error('EXCEPTION:', e);
    }
}

testEmail();
