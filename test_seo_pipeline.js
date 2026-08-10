const { runSEOPipeline } = require('./src/lib/seo-pipeline.js');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function test() {
    try {
        console.log('Testing SEO Pipeline...');
        const result = await runSEOPipeline('airport taxi colombo to kandy');
        console.log('Success:', result);
    } catch (e) {
        console.error('Pipeline Error:', e.message);
    } finally {
        mongoose.disconnect();
    }
}

test();
