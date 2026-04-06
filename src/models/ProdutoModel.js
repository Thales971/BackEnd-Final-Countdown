import prisma from '../utils/prismaClient.js';

export default class ProdutoModel {
    constructor(
        id = null,
        nome,
        descricao = null,
        categoria,
        disponivel = null,
        preco,
        foto = null,
        fornecedorId = null
    ) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.categoria = categoria;
        this.disponivel = disponivel;
        this.preco = Number(preco);
        this.foto = foto;
        this.fornecedorId = fornecedorId;
    }

    async criar() {
        return prisma.produto.create({
            data: {
                nome: this.nome,
                descricao: this.descricao,
                categoria: this.categoria,
                disponivel: Boolean(this.disponivel),
                preco: this.preco,
                fornecedorId: this.fornecedorId,
            },
        });
    }

    async atualizar() {
        return prisma.produto.update({
            where: { id: this.id },
            data: {
                nome: this.nome,
                descricao: this.descricao,
                categoria: this.categoria,
                preco: this.preco,
                disponivel: Boolean(this.disponivel),
                foto: this.foto,
                fornecedorId: this.fornecedorId,
            },
        });
    }

    async deletar() {
        return prisma.produto.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }
        if (filtros.categoria) {
            where.categoria = filtros.categoria;
        }
        if (filtros.disponivel !== undefined) {
            where.disponivel = filtros.disponivel === 'true' || filtros.disponivel === true;
        }

        if (filtros.precoMin !== undefined || filtros.precoMax !== undefined) {
            where.preco = {};
            if (filtros.precoMin !== undefined) {
                where.preco.gte = Number(filtros.precoMin);
            }
            if (filtros.precoMax !== undefined) {
                where.preco.lte = Number(filtros.precoMax);
            }
        }

        return prisma.produto.findMany({ where });
    }

    static async buscarPorId(id) {
        const dados = await prisma.produto.findUnique({ where: { id } });
        if (!dados) {
            return null;
        }
        return new ProdutoModel(
            dados.id,
            dados.nome,
            dados.descricao,
            dados.categoria,
            dados.disponivel,
            dados.preco,
            dados.foto,
            dados.fornecedorId
        );
    }
}
