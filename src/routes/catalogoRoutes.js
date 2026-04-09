import express from 'express';
import * as produtoCtrl from '../controllers/produtoController.js';

const router = express.Router();

router.post('/', produtoCtrl.criar);
router.get('/', produtoCtrl.buscarTodos);

router.get('/:id', produtoCtrl.buscarPorId);
router.put('/:id', produtoCtrl.atualizar);
router.delete('/:id', produtoCtrl.deletar);

export default router;
