import ProdutoModel from '../models/ProdutoModel.js';
import fs from 'fs/promises';
import { processarFoto, removerFoto } from '../utils/fotoHelper.js';

/**
 * @typedef {object} UploadFotoPayload
 * @property {string} foto.required - Arquivo da foto no envio multipart/form-data.
 */

/**
 * POST /catalogo/{id}/foto
 * @tags Foto
 * @summary Envia ou troca a foto de um produto
 * @description Recebe a imagem do item, redimensiona para no máximo 800px, converte para JPEG e substitui a foto anterior.
 * @security ApiKeyAuth
 * @param {integer} id.path.required
 * @param {UploadFotoPayload} request.body.required - Foto do produto em multipart/form-data
 *
 * @return 201 - Foto salva com sucesso
 * @return 400 - ID inválido ou nenhuma imagem enviada
 * @return 404 - Registro do produto não encontrado
 * @return 500 - Erro interno ao salvar o registro da foto
 * @example response - 201 - Exemplo de foto salva
 * {
 *   "message": "Foto salva com sucesso!",
 *   "foto": "uploads/produto_1_1710000000000.jpg"
 * }
 */
export const uploadFoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem enviada.' });
        }

        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const produto = await ProdutoModel.buscarPorId(parseInt(id, 10));
        if (!produto) {
            removerFoto(req.file.path);
            return res.status(404).json({ error: 'Registro do produto não encontrado.' });
        }

        if (!produto.disponivel) {
            removerFoto(req.file.path);
            return res.status(400).json({ error: 'Item indisponível.' });
        }

        if (produto.foto) {
            await fs.unlink(produto.foto).catch(() => {});
        }

        produto.foto = await processarFoto(req.file.path);
        await produto.atualizar();

        return res.status(201).json({ message: 'Foto salva com sucesso!', foto: produto.foto });
    } catch (error) {
        console.error('Erro ao salvar foto:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o registro da foto.' });
    }
};

/**
 * GET /catalogo/{id}/foto
 * @tags Foto
 * @summary Mostra a foto de um produto
 * @description Retorna a imagem salva para o item do catálogo.
 * @security ApiKeyAuth
 * @param {integer} id.path.required
 *
 * @return 200 - Arquivo de imagem do produto
 * @return 400 - ID inválido
 * @return 404 - Registro do produto ou foto não encontrada
 * @return 500 - Erro interno ao buscar foto
 */
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
            return res.status(404).json({ error: 'Foto do produto não encontrada.' });
        }

        return res.sendFile(produto.foto, { root: '.' });
    } catch (error) {
        console.error('Erro ao buscar foto do produto:', error);
        return res.status(500).json({ error: 'Erro ao buscar foto do produto.' });
    }
};
