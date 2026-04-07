import ProdutoModel from '../models/ProdutoModel.js';
import fs from 'fs/promises';
import { processarFoto, removerFoto } from '../utils/fotoHelper.js';

export const uploadFoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem enviada.' });
        }

        const { id } = req.params;

        if (isNaN(id)) return res.status(400).json({ error: 'O ID enviado não é um número válido.' });

        const produto = await ProdutoModel.buscarPorId(parseInt(id, 10));
        if (!produto) {
            removerFoto(req.file.path);
            return res.status(404).json({ error: 'Registro do produto não encontrado.' });
        }

        if (produto.foto) {
            await fs.unlink(produto.foto).catch(() => { });
        }

        produto.foto = await processarFoto(req.file.path);
        await produto.atualizar();

        return res.status(201).json({ message: 'Foto salva com sucesso!', foto: produto.foto });
    } catch (error) {
        console.error('Erro ao salvar foto:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o registro da foto.' });
    }
};

export const verFoto = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const produto = await ProdutoModel.buscarPorId(parseInt(id, 10));

        if (!produto) {
            return res.status(404).json({ error: 'Registro do produto não encontrado.' });
        }

        if (!produto.foto) {
            return res.status(404).json({ error: 'Foto do produto não encontrada.'})
        }

        return res.sendFile(produto.foto, { root: '.'});
    } catch (error) {
        console.error('Erro ao buscar foto do produto:', error);
        return res.status(500).json({ error: 'Erro ao buscar foto do produto.' });
    }
};
