import express from 'express';
import { upload } from '../utils/fotoHelper.js';
import * as controller from '../controllers/fotoController.js';
import autenticar from '../utils/apiKey.js';

const router = express.Router();

router.post('/catalogo/:id/foto', autenticar, upload.single('foto'), controller.uploadFoto);
router.get('/catalogo/:id/foto', autenticar, controller.verFoto);

export default router;
