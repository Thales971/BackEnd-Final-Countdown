import express from 'express';
import * as controller from '../controllers/fornecedorController.js';

const router = express.Router();

router.post('/', controller.criarFornecedor);
router.get('/', controller.buscarTodosOsFornecedores);
router.get('/:id', controller.buscarFornecedorPorId);
router.put('/:id', controller.atualizarFornecedor);
router.delete('/:id', controller.deletarFornecedor);

export default router;
