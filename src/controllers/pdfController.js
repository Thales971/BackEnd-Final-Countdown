import ProdutoModel from '../models/ProdutoModel.js';
import { gerarPdfProduto, gerarPdfTodos } from '../utils/pdfHelper.js';

/**
 * @typedef {object} reqBodyPdf
 */

/**
 * GET /catalogo/pdf
 * @tags PDF
 * @summary Gera o PDF com todos os produtos
 * @description Monta um relatório PDF com todos os itens do catálogo e devolve o arquivo em application/pdf.
 * @security ApiKeyAuth
 *
 * @return {string} 200 - PDF gerado com sucesso - application/pdf
 * @return {object} 404 - Nenhum produto encontrado
 * @return {object} 500 - Erro interno do servidor
 */
export const relatorioTodos = async (req, res) => {
    try {
        const produtos = await ProdutoModel.buscarTodos();

        if (!produtos || produtos.length === 0) {
            return res.status(404).json({ error: 'Nenhum produto encontrado!' });
        }

        const pdf = await gerarPdfTodos(produtos);

        return res
            .set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="produtos_relatorio.pdf"`,
            })
            .send(pdf);
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        return res.status(500).json({ error: 'Erro ao gerar relatório.' });
    }
};

/**
 * GET /catalogo/{id}/pdf
 * @tags PDF
 * @summary Gera o PDF de um produto por ID
 * @description Gera o PDF de um item específico do catálogo e retorna o arquivo em application/pdf.
 * @security ApiKeyAuth
 *
 * @param {integer} id.path.required
 *
 * @return {string} 200 - PDF gerado com sucesso - application/pdf
 * @return {object} 400 - Dados inválidos
 * @return {object} 404 - Produto não encontrado
 * @return {object} 500 - Erro interno do servidor
 */
export const relatorioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const produto = await ProdutoModel.buscarPorId(parseInt(id, 10));

        if (!produto) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        const pdf = await gerarPdfProduto(produto);
        return res
            .set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="produto_${id}.pdf"`,
            })
            .send(pdf);
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        return res.status(500).json({ error: 'Erro ao gerar relatório.' });
    }
};
