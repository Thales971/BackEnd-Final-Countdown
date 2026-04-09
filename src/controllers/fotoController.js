import ProdutoModel from '../models/ProdutoModel.js';
import fs from 'fs/promises';
import { processarFoto, removerFoto } from '../utils/fotoHelper.js';

// ============================================================================
// Estes comentários alimentam a documentação automática do Swagger.
// Eu uso @tags, @summary, @description e @param para explicar a rota de forma
// clara na tela de testes em /api-docs.
// No caso do upload, o @consumes multipart/form-data é o que faz o Swagger
// mostrar o campo de arquivo para enviar a foto.
// ============================================================================

/**
 * POST /catalogo/{id}/foto
 * @tags Produtos
 * @summary Faz o upload da foto de um produto
 * @description EndPoint responsável por anexar uma foto a um produto existente a partir do ID. A imagem é redimensionada e otimizada (JPEG).
 * @param {integer} id.path.required
 * @param {file} foto.formData.required - Imagem do produto
 * @consumes multipart/form-data
 *
 * @return 201 - Foto salva com sucesso
 * @return 400 - ID inválido ou nenhuma imagem enviada
 * @return 404 - Registro do produto não encontrado
 * @return 500 - Erro interno ao salvar o registro da foto
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
 * @tags Produtos
 * @summary Visualiza a foto de um produto
 * @description EndPoint responsável por retornar o arquivo de imagem associado ao produto correspondente ao ID.
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
