// src/utils/upload.js
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

function generateFileName() {
    return `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
}

async function saveImage(buffer, filename, existingRelativePath = null) {
    const filepath = path.join(uploadsDir, filename);

    // process image: rotate, resize max 800px, convert to jpeg quality 80
    await sharp(buffer)
        .rotate()
        .resize({ width: 800, height: 800, fit: 'inside' })
        .jpeg({ quality: 80 })
        .toFile(filepath);

    // remove previous image if provided
    if (existingRelativePath) {
        try {
            let existingFile = existingRelativePath;
            // if path like 'uploads/xxx.jpg' or contains separators, extract filename
            if (existingFile.includes('/') || existingFile.includes('\\')) {
                existingFile = existingFile.split(/[\\/]/).pop();
            }
            const existingFull = path.join(uploadsDir, existingFile);
            if (fs.existsSync(existingFull)) {
                fs.unlinkSync(existingFull);
            }
        } catch (err) {
            // ignore deletion errors
        }
    }

    // return path stored in DB (use forward slash)
    return `uploads/${filename}`;
}

export { upload, saveImage, generateFileName, uploadsDir };
export default { upload, saveImage, generateFileName, uploadsDir };
