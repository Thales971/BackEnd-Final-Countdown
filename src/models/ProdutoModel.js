import prisma from '../utils/prismaClient.js';

export default class ProdutoModel {
    constructor({ id = null, nome = null, descricao = null, categoria = null, preco = null, disponivel = true, foto = null } = {}){
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.categoria = categoria;
        this.preco = preco;
        this.disponivel = disponivel;
        this.foto = foto;
    }

    async criar() {
        return prisma.produto.create({
            data: {
                nome: this.nome,
                descricao: this.descricao,
                categoria: this.categoria,
                preco: this.preco,
                disponivel: this.disponivel,
                foto: this.foto,
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
                disponivel: this.disponivel,
                foto: this.foto,
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
            where.categoria = filtros.categoria.toUpperCase();
        }

        if (filtros.disponivel !== undefined) {
            where.disponivel = filtros.disponivel === 'true' || filtros.disponivel === true;
        }

        return prisma.produto.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.produto.findUnique({ where: { id } });

        if (!data) {
            return null;
        }

        return new ProdutoModel(data);
    }
}
