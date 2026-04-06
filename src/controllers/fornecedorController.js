import FornecedorModel from '../models/FornecedorModel.js';

const parseId = (value) => Number.parseInt(value, 10);

export const criar = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Campo obrigatório não informado.' });
        }

        const { nome, cep } = req.body;
        if (!nome || !cep) {
            return res.status(400).json({ error: 'Campo obrigatório não informado.' });
        }

        const fornecedor = new FornecedorModel(
            req.body.id || null,
            req.body.nome,
            req.body.email,
            req.body.telefone,
            req.body.cnpj,
            req.body.cep,
            req.body.logradouro,
            req.body.bairro,
            req.body.localidade,
            req.body.uf,
            req.body.ativo,
            req.body.produtos
        );
        const data = await fornecedor.criar();
        return res.status(201).json({ message: 'Registro criado com sucesso.', data });
    } catch (err) {
        const msg = err.message;
        if (
            [
                'Campo obrigatório não informado.',
                'CEP inválido.',
                'CEP não encontrado.',
                'Serviço externo indisponível.',
            ].includes(msg)
        ) {
            return res.status(400).json({ error: msg });
        }

        return res.status(500).json({ error: 'Erro interno.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await FornecedorModel.buscarTodos(req.query);
        return res.json(registros);
    } catch (err) {
        return res.status(500).json({ error: 'Erro interno.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const fornecedor = await FornecedorModel.buscarPorId(id);

        if (!fornecedor) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        return res.json({ data: fornecedor });
    } catch (err) {
        return res.status(500).json({ error: 'Erro interno.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const fornecedor = await FornecedorModel.buscarPorId(id);
        if (!fornecedor) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        if (fornecedor.ativo === false) {
            return res.status(400).json({ error: 'Operação não permitida para registro inativo.' });
        }

        if (req.body.nome !== undefined) {
            const nome = String(req.body.nome).trim();
            if (!nome || nome.length < 3 || nome.length > 100) {
                return res.status(400).json({ error: 'Campo obrigatório não informado.' });
            }
            fornecedor.nome = nome;
        }

        if (req.body.email !== undefined) {
            fornecedor.email = req.body.email;
        }

        if (req.body.telefone !== undefined) {
            fornecedor.telefone = req.body.telefone;
        }

        if (req.body.cnpj !== undefined) {
            fornecedor.cnpj = req.body.cnpj;
        }

        if (req.body.cep !== undefined) {
            fornecedor.cep = req.body.cep;
        }

        if (req.body.ativo !== undefined) {
            fornecedor.ativo = req.body.ativo === true || req.body.ativo === 'true';
        }

        const data = await fornecedor.atualizar();
        return res.json({ message: 'Registro atualizado com sucesso.', data });
    } catch (err) {
        const msg = err.message;
        if (
            [
                'Campo obrigatório não informado.',
                'CEP inválido.',
                'CEP não encontrado.',
                'Serviço externo indisponível.',
                'Operação não permitida para registro inativo.',
            ].includes(msg)
        ) {
            return res.status(400).json({ error: msg });
        }

        if (msg === 'Registro não encontrado.') {
            return res.status(404).json({ error: msg });
        }

        return res.status(500).json({ error: 'Erro interno.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const fornecedor = await FornecedorModel.buscarPorId(id);
        if (!fornecedor) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        if (fornecedor.ativo === false) {
            return res.status(400).json({ error: 'Operação não permitida para registro inativo.' });
        }

        await fornecedor.deletar();
        return res.json({ message: 'Registro deletado com sucesso.' });
    } catch (err) {
        const msg = err.message;
        if (msg === 'Registro não encontrado.') {
            return res.status(404).json({ error: msg });
        }

        if (msg === 'Operação não permitida para registro inativo.') {
            return res.status(400).json({ error: msg });
        }

        return res.status(500).json({ error: 'Erro interno.' });
    }
};

export const listar = buscarTodos;
export const obter = buscarPorId;
