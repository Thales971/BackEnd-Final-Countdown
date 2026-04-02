import prisma from '../utils/prismaClient.js';
import { consultarCEP } from '../utils/viaCep.js';

export default class FornecedorModel {
    static async criar(payload) {
        const { nome, email, telefone, cnpj, cep, ativo = true } = payload;

        if (
            !nome ||
            typeof nome !== 'string' ||
            nome.trim().length < 3 ||
            nome.trim().length > 100
        ) {
            throw new Error('Campo obrigatório não informado.');
        }

        if (!cep) {
            throw new Error('Campo obrigatório não informado.');
        }

        const endereco = await consultarCEP(String(cep));

        const data = {
            nome: nome.trim(),
            email: email || null,
            telefone: telefone || null,
            cnpj: cnpj || null,
            cep: endereco.cep,
            logradouro: endereco.logradouro,
            bairro: endereco.bairro,
            localidade: endereco.localidade,
            uf: endereco.uf,
            ativo: ativo === undefined ? true : Boolean(ativo),
        };

        return prisma.fornecedor.create({ data });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: String(filtros.nome), mode: 'insensitive' };
        }

        if (filtros.email) {
            where.email = { contains: String(filtros.email), mode: 'insensitive' };
        }

        if (filtros.localidade) {
            where.localidade = { contains: String(filtros.localidade), mode: 'insensitive' };
        }

        return prisma.fornecedor.findMany({ where });
    }

    static async buscarPorId(id) {
        const intId = Number.parseInt(id, 10);
        if (Number.isNaN(intId)) {
            return null;
        }

        const data = await prisma.fornecedor.findUnique({ where: { id: intId } });
        return data || null;
    }

    static async atualizar(id, payload) {
        const intId = Number.parseInt(id, 10);
        if (Number.isNaN(intId)) {
            throw new Error('Registro não encontrado.');
        }

        const existente = await prisma.fornecedor.findUnique({ where: { id: intId } });
        if (!existente) {
            throw new Error('Registro não encontrado.');
        }

        if (existente.ativo === false) {
            throw new Error('Operação não permitida para registro inativo.');
        }

        const { nome, email, telefone, cnpj, cep, ativo } = payload;

        if (nome !== undefined) {
            if (
                !nome ||
                typeof nome !== 'string' ||
                nome.trim().length < 3 ||
                nome.trim().length > 100
            ) {
                throw new Error('Campo obrigatório não informado.');
            }
        }

        if (!cep) {
            throw new Error('Campo obrigatório não informado.');
        }

        const endereco = await consultarCEP(String(cep));

        const data = {
            nome: nome !== undefined ? nome.trim() : existente.nome,
            email: email !== undefined ? email : existente.email,
            telefone: telefone !== undefined ? telefone : existente.telefone,
            cnpj: cnpj !== undefined ? cnpj : existente.cnpj,
            cep: endereco.cep,
            logradouro: endereco.logradouro,
            bairro: endereco.bairro,
            localidade: endereco.localidade,
            uf: endereco.uf,
            ativo: ativo !== undefined ? Boolean(ativo) : existente.ativo,
        };

        return prisma.fornecedor.update({ where: { id: intId }, data });
    }

    static async deletar(id) {
        const intId = Number.parseInt(id, 10);
        if (Number.isNaN(intId)) {
            throw new Error('Registro não encontrado.');
        }

        const existente = await prisma.fornecedor.findUnique({ where: { id: intId } });
        if (!existente) {
            throw new Error('Registro não encontrado.');
        }

        if (existente.ativo === false) {
            throw new Error('Operação não permitida para registro inativo.');
        }

        return prisma.fornecedor.delete({ where: { id: intId } });
    }
}
