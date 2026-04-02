import fs from 'fs';
import path from 'path';
import ProdutoModel from '../models/ProdutoModel.js';
import { processarFoto, removerFoto } from '../utils/fotoHelper.js';

export const verFoto = async (req, res) => {
    try {
        const { id } = req.params;

        const produto = await ProdutoModel.buscarPorId(id);

        if (!produto || !produto.foto) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        const caminho = path.isAbsolute(produto.foto)
            ? produto.foto
            : path.resolve(process.cwd(), produto.foto);

        return res.sendFile(caminho);
    } catch (err) {
        return res.status(500).json({ error: 'Erro interno.' });
    }
};

export const uploadFoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Campo obrigatório não informado.' });
        }

        const { id } = req.params;

        const produto = await ProdutoModel.buscarPorId(id);

        if (!produto) {
            removerFoto(req.file.path);
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        if (produto.foto) {
            const fotoAntiga = path.isAbsolute(produto.foto)
                ? produto.foto
                : path.resolve(process.cwd(), produto.foto);
            if (fs.existsSync(fotoAntiga)) {
                fs.unlinkSync(fotoAntiga);
            }
        }

        const caminhoProcessado = await processarFoto(req.file.path);
        const data = await ProdutoModel.atualizar(id, { foto: caminhoProcessado });

        return res.status(200).json(data);
    } catch (err) {
        if (req.file) {
            removerFoto(req.file.path);
        }

        const msg = err.message;
        if (msg === 'Registro não encontrado.') {
            return res.status(404).json({ error: msg });
        }

        if (msg === 'Não é permitido utilizar item indisponível.') {
            return res.status(400).json({ error: msg });
        }

        return res.status(500).json({ error: 'Erro interno.' });
    }
};
