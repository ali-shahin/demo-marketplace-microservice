const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

app.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const originalPath = req.file.path;
    const optimizedFilename = 'optimized-' + req.file.filename;
    const optimizedPath = path.join(uploadDir, optimizedFilename);
    try {
        // Resize to max width 800px, compress, and convert to webp
        await sharp(originalPath)
            .resize({ width: 800, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(optimizedPath);
        res.json({
            message: 'Image uploaded and optimized successfully',
            original: req.file.filename,
            optimized: optimizedFilename,
            url: `/uploads/${optimizedFilename}`
        });
    } catch (err) {
        console.error('Image processing error:', err);
        res.status(500).json({ error: 'Image processing failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Image Optimization Service running on port ${PORT}`);
});
