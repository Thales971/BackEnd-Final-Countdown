import fs from 'fs';
import path from 'path';
import ProdutoModel from '../models/ProdutoModel.js';
import { gerarPdfGeral, gerarPdfIndividual } from '../utils/pdf.js';

export const gerarRelatorioGeral = async (req, res) => {
    try {
        const produtos = await ProdutoModel.buscarTodos(req.query);

        if (!produtos || produtos.length === 0) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        const pdf = await gerarPdfGeral(produtos);

        return res
            .set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="catalogo_geral.pdf"',
            })
            .send(pdf);
    } catch (err) {
        return res.status(500).json({ error: 'Erro interno.' });
    }
};

export const gerarRelatorioIndividual = async (req, res) => {
    try {
        const { id } = req.params;

        const produto = await ProdutoModel.buscarPorId(id);

        if (!produto) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        if (produto.disponivel === false) {
            return res.status(400).json({ error: 'Não é permitido utilizar item indisponível.' });
        }

        let fotoBase64 = null;
        if (produto.foto) {
            const caminho = path.isAbsolute(produto.foto)
                ? produto.foto
                : path.resolve(process.cwd(), produto.foto);

            if (fs.existsSync(caminho)) {
                fotoBase64 = fs.readFileSync(caminho).toString('base64');
            }
        }

        const pdf = await gerarPdfIndividual(produto, fotoBase64);

        return res
            .set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="catalogo_${id}.pdf"`,
            })
            .send(pdf);
    } catch (err) {
        return res.status(500).json({ error: 'Erro interno.' });
    }
};
