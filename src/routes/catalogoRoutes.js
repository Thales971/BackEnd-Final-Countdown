import express from 'express';
import * as produtoCtrl from '../controllers/produtoController.js';
import * as fotoCtrl from '../controllers/fotoController.js';
import { upload } from '../utils/fotoHelper.js';

const router = express.Router();

router.post('/', produtoCtrl.criar);
router.get('/', produtoCtrl.buscarTodos);

router.get('/:id', produtoCtrl.buscarPorId);
router.put('/:id', produtoCtrl.atualizar);
router.delete('/:id', produtoCtrl.deletar);

// Foto
router.post('/:id/foto', upload.single('foto'), fotoCtrl.uploadFoto);
router.get('/:id/foto', fotoCtrl.verFoto);
export default router;
