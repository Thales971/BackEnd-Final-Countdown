import express from 'express';
import * as produtoCtrl from '../controllers/produtoController.js';
import { upload } from '../utils/upload.js';

const express = require('express');
const router = express.Router();

const upload = require('../utils/upload.js');
const catalogoController = require('../controllers/catalogoController.js');

router.post('/catalogo/:id/foto', upload.single('foto'), catalogoController.uploadFoto)
router.post('/', produtoCtrl.criar);
router.get('/', produtoCtrl.listar);
router.get('/:id', produtoCtrl.obter);
router.put('/:id', produtoCtrl.atualizar);
router.delete('/:id', produtoCtrl.deletar);

// Foto
router.post('/:id/foto', upload.single('foto'), produtoCtrl.uploadFoto);
router.get('/:id/foto', produtoCtrl.pegarFoto);

//PDF
router.get('/:id/pdf', produtoCtrl.pdfIndividual);
router.get('/pdf', produtoCtrl.pdfGeral);

export default router;
