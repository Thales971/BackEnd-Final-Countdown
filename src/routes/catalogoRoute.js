import express from 'express';
import * as produtoCtrl from '../controllers/produtoController.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

router.post('/', produtoCtrl.criar);
router.get('/', produtoCtrl.listar);
router.get('/:id', produtoCtrl.obter);
router.put('/:id', produtoCtrl.atualizar);
router.delete('/:id', produtoCtrl.deletar);

router.post('/:id/foto', upload.single('foto'), produtoCtrl.uploadFoto);
router.get('/:id/foto', produtoCtrl.pegarFoto);

router.get('/:id/pdf', produtoCtrl.pdfIndividual);
router.get('/pdf', produtoCtrl.pdfGeral);

export default router;
