const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function test() {
    try {
        console.log('Testing Cloudinary config...');
        console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
        console.log('API Key:', process.env.CLOUDINARY_API_KEY);
        
        // Try a simple API call
        const result = await cloudinary.api.ping();
        console.log('Ping result:', result);
        
        // Try listing resources (optional)
        // const resources = await cloudinary.api.resources({ max_results: 1 });
        // console.log('Resources found:', resources.resources.length);
        
    } catch (err) {
        console.error('Cloudinary Test Failed:', err);
    }
}

test();
