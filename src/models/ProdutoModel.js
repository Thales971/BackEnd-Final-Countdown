import prisma from '../utils/prismaClient.js';

const CATEGORIAS = ['ELETRONICOS', 'VESTUARIO', 'ALIMENTOS', 'MOVEIS'];

class ProdutoModel {
    static async criar(payload) {
        const { nome, descricao, categoria, disponivel = true, preco, fornecedorId } = payload;

        if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
            throw new Error('Campo obrigatório não informado.');
        }

        if (!categoria || !CATEGORIAS.includes(categoria)) {
            throw new Error('Categoria inválida.');
        }

        if (preco === undefined || preco === null || Number(preco) < 0) {
            throw new Error('Campo obrigatório não informado.');
        }

        const data = {
            nome: nome.trim(),
            descricao: descricao || null,
            categoria,
            disponivel: Boolean(disponivel),
            preco: Number(preco),
            foto: null,
            fornecedorId: fornecedorId || null,
        };

        return prisma.produto.create({ data });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: String(filtros.nome), mode: 'insensitive' };
        }
        if (filtros.categoria) {
            where.categoria = filtros.categoria;
        }
        if (filtros.disponivel !== undefined) {
            where.disponivel = filtros.disponivel === 'true' || filtros.disponivel === true;
        }

        return prisma.produto.findMany({ where });
    }

    static async buscarPorId(id) {
        const intId = parseInt(id, 10);
        if (Number.isNaN(intId)) {
            return null;
        }

        const data = await prisma.produto.findUnique({ where: { id: intId } });
        return data || null;
    }

    static async atualizar(id, payload) {
        const intId = parseInt(id, 10);
        if (Number.isNaN(intId)) {
            throw new Error('Registro não encontrado.');
        }

        const existente = await prisma.produto.findUnique({ where: { id: intId } });
        if (!existente) {
            throw new Error('Registro não encontrado.');
        }

        if (existente.disponivel === false) {
            throw new Error('Não é permitido utilizar item indisponível.');
        }

        const { nome, descricao, categoria, disponivel, preco, fornecedorId, foto } = payload;

        if (categoria !== undefined && !CATEGORIAS.includes(categoria)) {
            throw new Error('Categoria inválida.');
        }

        if (preco !== undefined && Number(preco) < 0) {
            throw new Error('Campo obrigatório não informado.');
        }

        const data = {
            nome: nome !== undefined ? String(nome).trim() : existente.nome,
            descricao: descricao !== undefined ? descricao : existente.descricao,
            categoria: categoryOrDefault(categoria, existente.categoria),
            disponivel: disponivel !== undefined ? Boolean(disponivel) : existente.disponivel,
            preco: preco !== undefined ? Number(preco) : existente.preco,
            fornecedorId: fornecedorId !== undefined ? fornecedorId : existente.fornecedorId,
            foto: foto !== undefined ? foto : existente.foto,
        };

        return prisma.produto.update({ where: { id: intId }, data });
    }

    static async deletar(id) {
        const intId = parseInt(id, 10);
        if (Number.isNaN(intId)) {
            throw new Error('Registro não encontrado.');
        }

        const existente = await prisma.produto.findUnique({ where: { id: intId } });
        if (!existente) {
            throw new Error('Registro não encontrado.');
        }

        if (existente.disponivel === false) {
            throw new Error('Não é permitido utilizar item indisponível.');
        }

        return prisma.produto.delete({ where: { id: intId } });
    }
}

function categoryOrDefault(categoria, current) {
    return categoria !== undefined ? categoria : current;
}

export default ProdutoModel;
