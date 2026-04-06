import prisma from '../utils/prismaClient.js';

export default class FornecedorModel {
    constructor(
        id = null,
        nome,
        email,
        telefone,
        cnpj,
        cep,
        logradouro,
        bairro,
        localidade,
        uf,
        ativo = true,
        produtos = []
    ) {
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
        this.produtos = produtos;
    }

    validacao() {
        if (!this.nome || this.nome.length < 3 || this.nome.length > 100) {
            throw new Error('Campo obrigatório não informado.');
        }

        if (!this.cep) {
            throw new Error('Campo obrigatório não informado.');
        }

        if (this.ativo === false) {
            throw new Error('Operação não permitida para registro inativo.');
        }

        let cepLimpo = '';
        if (this.cep) {
            const cepString = String(this.cep);
            for (let i = 0; i < cepString.length; i++) {
                const caractere = cepString[i];
                if (caractere >= '0' && caractere <= '9') {
                    cepLimpo += caractere;
                }
            }
        }

        if (cepLimpo.length !== 8) {
            throw new Error('CEP inválido.');
        }

        this.cep = cepLimpo;
    }

    async preencherEnderecoPorCep() {
        if (!this.cep) return;

        let cepLimpo = '';
        const cepString = String(this.cep);
        for (let i = 0; i < cepString.length; i++) {
            const caractere = cepString[i];
            if (caractere >= '0' && caractere <= '9') {
                cepLimpo += caractere;
            }
        }

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            const dados = await resposta.json();

            if (dados.erro) {
                throw new Error('CEP não encontrado.');
            }

            this.logradouro = dados.logradouro || null;
            this.bairro = dados.bairro || null;
            this.localidade = dados.localidade || null;
            this.uf = dados.uf || null;
        } catch (error) {
            if (error.message === 'CEP não encontrado.') throw error;
            throw new Error('Serviço externo indisponível.');
        }
    }

    async criar() {
        this.validacao();
        await this.preencherEnderecoPorCep();

        return prisma.fornecedor.create({
            data: {
                nome: this.nome,
                email: this.email,
                telefone: this.telefone,
                cnpj: this.cnpj,
                cep: String(this.cep),
                logradouro: this.logradouro,
                bairro: this.bairro,
                localidade: this.localidade,
                uf: this.uf,
                ativo: this.ativo,
            },
        });
    }

    async atualizar() {
        if (this.ativo === false) {
            throw new Error('Operação não permitida para registro inativo.');
        }

        this.validacao();
        if (this.cep) await this.preencherEnderecoPorCep();

        return prisma.fornecedor.update({
            where: { id: this.id },
            data: {
                nome: this.nome,
                email: this.email,
                telefone: this.telefone,
                cnpj: this.cnpj,
                cep: String(this.cep),
                logradouro: this.logradouro,
                bairro: this.bairro,
                localidade: this.localidade,
                uf: this.uf,
                ativo: this.ativo,
            },
        });
    }

    async deletar() {
        if (this.ativo === false) {
            throw new Error('Operação não permitida para registro inativo.');
        }

        return prisma.fornecedor.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }

        if (filtros.email) {
            where.email = { contains: filtros.email, mode: 'insensitive' };
        }

        if (filtros.localidade) {
            where.localidade = { contains: filtros.localidade, mode: 'insensitive' };
        }

        if (filtros.ativo !== undefined) {
            where.ativo = filtros.ativo === 'true' || filtros.ativo === true;
        }

        return prisma.fornecedor.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.fornecedor.findUnique({ where: { id } });
        if (!data) return null;
        return new FornecedorModel(
            data.id,
            data.nome,
            data.email,
            data.telefone,
            data.cnpj,
            data.cep,
            data.logradouro,
            data.bairro,
            data.localidade,
            data.uf,
            data.ativo,
            data.produtos
        );
    }
}
