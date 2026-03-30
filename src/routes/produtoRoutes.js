import express from 'express';
import * as controller from '../controllers/produtoController.js';

const router = express.Router();

router.post('/catalogo', controller.criar);
router.get('/catalogo', controller.buscarTodos);
router.get('/catalogo/:id', controller.buscarPorId);
router.put('/catalogo/:id', controller.atualizar);
router.delete('/catalogo/:id', controller.deletar);

export default router;
