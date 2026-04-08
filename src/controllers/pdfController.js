import ProdutoModel from '../models/ProdutoModel.js';
import { gerarPdfProduto, gerarPdfTodos } from '../utils/pdfHelper.js';

// ==============================================================================
// EXPLICAÇÃO DO SWAGGER (JSDoc)
// Os blocos de comentários abaixo (/** ... */) são utilizados pela biblioteca
// 'express-jsdoc-swagger' para desenhar a interface da documentação na rota /api-docs.
// Anotações como @tags (agrupamento), @summary (título), @description (detalhes),
// e @param (variáveis da requisição) permitem documentar interativamente o formato.
// No caso da rota de PDF, eles mapeiam quais retornos esperar (como arquivo)
// e os eventuais status (200, 404, 500) caso relatórios não existam na base de dados.
// ==============================================================================

/**
 * @typedef {object} reqBodyPdf
 */

/**
 * GET /pdf/relatorio/todos
 * @tags Relatórios
 * @summary Busca todos os registros de relatório e os converte para PDF
 * @description EndPoint responsável por buscar produtos cadastrados e transformá-los em PDF
 *
 * @return 200 - Produtos encontrados e convertidos com sucesso
 * @return 404 - Nenhum produto encontrado
 * @return 500 - Erro interno do servidor
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
 * GET /pdf/relatorio/{id}
 * @tags Relatórios
 * @summary Busca um registro e converte-o para PDF através do ID
 * @description EndPoint responsável por buscar produtos por ID e transformá-los em PDF
 *
 * @param {integer} id.path.required
 *
 * @return 200 - Produto encontrado e convertido com sucesso
 * @return 400 - Dados inválidos
 * @return 404 - Produto não encontrado
 * @return 500 - Erro interno do servidor
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
