const cloudinary = require('cloudinary').v2;

// Credentials from user
cloudinary.config({
    cloud_name: 'dgzov8som',
    api_key: '356912925698388',
    api_secret: 'L2JXAAMfGnxesOdYRYhyUsUcPys'
});

async function test() {
    try {
        console.log('Testing Cloudinary with provided credentials...');
        const result = await cloudinary.api.ping();
        console.log('Ping successful:', result);
        
        // Try to list folders to confirm full access
        const folders = await cloudinary.api.root_folders();
        console.log('Folders found:', folders.folders.map(f => f.name));
        
    } catch (err) {
        console.error('Cloudinary Test Failed:', err.message);
        if (err.http_code) console.error('HTTP Code:', err.http_code);
    }
}

test();
