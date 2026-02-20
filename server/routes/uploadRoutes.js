const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration for original files (temporary before processing)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const folder = req.body.folder || 'misc';
        const targetDir = path.join(uploadDir, folder);

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        const filename = `${Date.now()}_${req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '')}`;
        const webpFilename = filename.replace(/\.[^/.]+$/, "") + ".webp";
        const filePath = path.join(targetDir, webpFilename);

        // Process with sharp
        await sharp(req.file.buffer)
            .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(filePath);

        // Construct URL
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.get('host');
        const fileUrl = `${protocol}://${host}/uploads/${folder}/${webpFilename}`;

        res.json({
            success: true,
            url: fileUrl,
            filename: webpFilename
        });

    } catch (error) {
        console.error('Upload API Error:', error);
        res.status(500).json({ error: 'Failed to process file' });
    }
});

module.exports = router;
