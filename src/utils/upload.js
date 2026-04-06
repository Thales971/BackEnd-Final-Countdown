import multer from 'multer';

export const generateFileName = (file) => {
    return Date.now() + '-' + file.originalname;
};

export const saveImage = async (buffer,filename,) => {
    const caminho = `uploads/${filename}`;
    await fs.promises.writeFile(caminho, buffer);
    return caminho; // caminho relativo para salvar no banco
}

const storage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

export const upload = multer({ storage: multer.memoryStorage() });
