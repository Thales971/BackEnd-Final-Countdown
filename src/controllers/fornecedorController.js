import FornecedorModel from '../models/FornecedorModel.js';

export const criar = async (req, res) => {
    try {
        const data = await FornecedorModel.criar(req.body || {});
        return res.status(201).json(data);
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

export const listar = async (req, res) => {
    try {
        const registros = await FornecedorModel.buscarTodos(req.query);
        return res.status(200).json(registros);
    } catch (err) {
        return res.status(500).json({ error: 'Erro interno.' });
    }
};

export const obter = async (req, res) => {
    try {
        const { id } = req.params;

        const fornecedor = await FornecedorModel.buscarPorId(id);

        if (!fornecedor) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        return res.status(200).json(fornecedor);
    } catch (err) {
        return res.status(500).json({ error: 'Erro interno.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await FornecedorModel.atualizar(id, req.body || {});
        return res.status(200).json(data);
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
        const { id } = req.params;

        await FornecedorModel.deletar(id);
        return res.status(200).json({ message: 'Registro deletado com sucesso.' });
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
