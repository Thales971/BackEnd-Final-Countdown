import sharp from 'sharp';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploads_dir = './uploads';

if (!fs.existsSync(uploads_dir)) {
    fs.mkdirSync(uploads_dir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploads_dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `produto_${req.params.id}_${Date.now()}${ext}`);
    },
});

export const upload = multer({ storage }); // multer({ dest: 'uploads/' });

export async function processarFoto(filePath) {
    const processado = await sharp(fs.readFileSync(filePath))
        .resize({ width: 800, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();
    fs.writeFileSync(filePath, processado);
    return filePath.replace(/\\/g, '/');
}

export function removerFoto(filePath) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}
