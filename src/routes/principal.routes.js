import express from 'express';
import * as fornecedorCtrl from '../controllers/fornecedorController.js';
import apiKey from '../utils/apiKey.js';

const router = express.Router();

router.post('/', apiKey, fornecedorCtrl.criar);
router.get('/', apiKey, fornecedorCtrl.listar);
router.get('/:id', apiKey, fornecedorCtrl.obter);
router.put('/:id', apiKey, fornecedorCtrl.atualizar);
router.delete('/:id', apiKey, fornecedorCtrl.deletar);

export default router;
