import prisma from '../utils/prismaClient.js';

export default class FornecedorModel {
    constructor({
        id = null,
        nome = null,
        email = null,
        telefone = null,
        cnpj = null,
        cep = null,
        logradouro = null,
        bairro = null,
        localidade = null,
        uf = null,
        ativo = true,
    } = {}) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.cnpj = cnpj;
        this.cep = cep;
        this.logradouro = logradouro;
        this.bairro = bairro;
        this.localidade = localidade;
        this.uf = uf;
        this.ativo = ativo;
    }

    async criar() {
        return prisma.fornecedor.create({
            data: {
                nome: this.nome,
                email: this.email,
                telefone: this.telefone,
                cnpj: this.cnpj,
                cep: this.cep,
                logradouro: this.logradouro,
                bairro: this.bairro,
                localidade: this.localidade,
                uf: this.uf,
                ativo: this.ativo,
            },
        });
    }

    async atualizar() {
        return prisma.fornecedor.update({
            where: { id: this.id },
            data: {
                nome: this.nome,
                email: this.email,
                telefone: this.telefone,
                cnpj: this.cnpj,
                cep: this.cep,
                logradouro: this.logradouro,
                bairro: this.bairro,
                localidade: this.localidade,
                uf: this.uf,
                ativo: this.ativo,
            },
        });
    }

    async deletar() {
        return prisma.fornecedor.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }
        if (filtros.email !== undefined) {
            where.email = { contains: filtros.email, mode: 'insensitive' };
        }
        if (filtros.telefone !== undefined) {
            where.telefone = { contains: filtros.telefone, mode: 'insensitive' };
        }
        if (filtros.cnpj !== undefined) {
            where.cnpj = { contains: filtros.cnpj, mode: 'insensitive' };
        }
        if (filtros.cep !== undefined) {
            where.cep = { contains: filtros.cep, mode: 'insensitive' };
        }

        return prisma.fornecedor.findMany({ where });
    }
    static async buscarPorId(id) {
        const data = await prisma.fornecedor.findUnique({ where: { id } });
        if (!data) {
            return null;
        }
        return new FornecedorModel(data);
    }
}
