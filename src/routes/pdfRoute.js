import express from 'express';
import { relatorioProdutoPorId, relatorioProdutosTodos } from '../controllers/pdfController.js';

const router = express.Router();

router.get('/produtos', relatorioProdutosTodos);
router.get('/produtos/:id', relatorioProdutoPorId);

export default router;
