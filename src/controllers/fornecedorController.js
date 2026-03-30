import FornecedorModel from '../models/FornecedorModel.js';
import { consultarCEP } from '../utils/viaCep.js';

export const criarFornecedor = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, email, telefone, cnpj, cep, logradouro, bairro, localidade, uf, ativo } =
            req.body;

        // Validações estritas pedidas no documento
        if (!nome) {
            return res.status(400).json({ error: 'Campo obrigatório não informado.' });
        }

        const nomeTrim = typeof nome === 'string' ? nome.trim() : nome;
        if (typeof nomeTrim !== 'string' || nomeTrim.length < 3 || nomeTrim.length > 100) {
            return res
                .status(400)
                .json({ error: 'O campo "nome" deve ter entre 3 e 100 caracteres.' });
        }

        if (!cnpj || !email) {
            return res.status(400).json({ error: 'Campo obrigatório não informado.' });
        }

        // Integração ViaCEP (apenas se CEP fornecido)
        let endereco = null;
        if (cep) {
            try {
                endereco = await consultarCEP(cep);
            } catch (err) {
                return res.status(400).json({ error: err.message });
            }
        }

        const fornecedor = new FornecedorModel({
            nome: nomeTrim,
            email,
            telefone,
            cnpj,
            cep: cep ?? null,
            logradouro: endereco ? endereco.logradouro : (logradouro ?? null),
            bairro: endereco ? endereco.bairro : (bairro ?? null),
            localidade: endereco ? endereco.localidade : (localidade ?? null),
            uf: endereco ? endereco.uf : (uf ?? null),
            ativo: ativo === undefined ? true : Boolean(ativo),
        });

        const data = await fornecedor.criar();

        return res.status(201).json({ message: 'Fornecedor criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o fornecedor.' });
    }
};

export const buscarTodosOsFornecedores = async (req, res) => {
    try {
        const registros = await FornecedorModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(400).json({ message: 'Nenhum fornecedor encontrado.' });
        }

        return res.status(200).json(registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar registros dos fornecedores.' });
    }
};

export const buscarFornecedorPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res
                .status(400)
                .json({ error: 'O ID do fornecedor enviado não é um número válido.' });
        }

        const fornecedor = await FornecedorModel.buscarPorId(parseInt(id));

        if (!fornecedor) {
            return res.status(404).json({ error: 'Fornecedor não encontrado.' });
        }

        return res.status(200).json({ data: fornecedor });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar registro do fornecedor.' });
    }
};

export const atualizarFornecedor = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        if (!req.body) {
            return res
                .status(400)
                .json({ error: 'Corpo da requisição vazio. Envie os dados do fornecedor!' });
        }

        const fornecedor = await FornecedorModel.buscarPorId(parseInt(id));

        if (!fornecedor) {
            return res.status(404).json({ error: 'Fornecedor não encontrado para atualizar.' });
        }

        // Bloqueio de inativos
        if (fornecedor.ativo === false) {
            return res.status(400).json({ error: 'Operação não permitida para registro inativo.' });
        }

        if (req.body.nome !== undefined) fornecedor.nome = req.body.nome;
        if (req.body.email !== undefined) fornecedor.email = req.body.email;
        if (req.body.telefone !== undefined) fornecedor.telefone = req.body.telefone;
        if (req.body.cnpj !== undefined) fornecedor.cnpj = req.body.cnpj;

        // Se CEP for enviado, consultar ViaCEP antes de salvar e preencher endereço
        if (req.body.cep !== undefined) {
            try {
                const endereco = await consultarCEP(req.body.cep);
                fornecedor.cep = req.body.cep;
                fornecedor.logradouro = endereco.logradouro;
                fornecedor.bairro = endereco.bairro;
                fornecedor.localidade = endereco.localidade;
                fornecedor.uf = endereco.uf;
            } catch (err) {
                return res.status(400).json({ error: err.message });
            }
        }

        if (req.body.logradouro !== undefined) fornecedor.logradouro = req.body.logradouro;
        if (req.body.bairro !== undefined) fornecedor.bairro = req.body.bairro;
        if (req.body.localidade !== undefined) fornecedor.localidade = req.body.localidade;
        if (req.body.uf !== undefined) fornecedor.uf = req.body.uf;
        if (req.body.ativo !== undefined) fornecedor.ativo = Boolean(req.body.ativo);

        const data = await fornecedor.atualizar();

        return res
            .status(200)
            .json({ message: `O fornecedor "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        return res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
};

export const deletarFornecedor = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }
        const fornecedor = await FornecedorModel.buscarPorId(parseInt(id));

        if (!fornecedor) {
            return res.status(404).json({ error: 'Fornecedor não encontrado para deletar.' });
        }

        // Bloqueio de inativos
        if (fornecedor.ativo === false) {
            return res.status(400).json({ error: 'Operação não permitida para registro inativo.' });
        }

        await fornecedor.deletar();

        return res.status(200).json({
            message: `O fornecedor "${fornecedor.nome}" foi deletado com sucesso!`,
            deletado: fornecedor,
        });
    } catch (error) {
        console.error('Erro ao deletar Fornecedor:', error);
        return res.status(500).json({ error: 'Erro ao deletar fornecedor.' });
    }
};
