import express from 'express';
import { gerarRelatorioGeral, gerarRelatorioIndividual } from '../controllers/pdfController.js';

const router = express.Router();

router.get('/pdf', gerarRelatorioGeral);
router.get('/:id/pdf', gerarRelatorioIndividual);

export default router;
