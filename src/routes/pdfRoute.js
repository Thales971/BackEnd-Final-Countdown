import express from 'express';
import { relatorioPorId, relatorioTodos } from '../controllers/pdfController.js';
import autenticar from '../utils/apiKey.js';

const router = express.Router();

router.get('/catalogo/pdf', autenticar, relatorioTodos);
router.get('/catalogo/:id/pdf', autenticar, relatorioPorId);

export default router;
