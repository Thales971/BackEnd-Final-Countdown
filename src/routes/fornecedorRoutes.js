import express from 'express';
import * as controller from '../controllers/fornecedorController.js';

const router = express.Router();

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.obter);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.deletar);

export default router;
