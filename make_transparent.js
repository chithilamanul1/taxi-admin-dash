const Jimp = require('jimp');

async function processImage() {
    try {
        const image = await Jimp.read('public/logo.png');

        // Define tolerance for white
        const tolerance = 15;

        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const red = this.bitmap.data[idx];
            const green = this.bitmap.data[idx + 1];
            const blue = this.bitmap.data[idx + 2];
            const alpha = this.bitmap.data[idx + 3];

            // If the pixel is close to white, make it transparent
            if (red > 255 - tolerance && green > 255 - tolerance && blue > 255 - tolerance) {
                this.bitmap.data[idx + 3] = 0; // Set alpha to 0
            }
        });

        await image.writeAsync('public/logo_transparent.png');
        console.log('Successfully created transparent logo.');

        // Also resize for favicon
        const favicon = image.clone();
        favicon.resize(48, 48); // Standard favicon size
        await favicon.writeAsync('public/favicon.ico');
        console.log('Successfully created transparent favicon.');

    } catch (err) {
        console.error('Error processing image:', err);
    }
}

processImage();
