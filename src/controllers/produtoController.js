import ProdutoModel from '../models/ProdutoModel.js';

const CATEGORIAS_VALIDAS = ['ELETRONICOS', 'VESTUARIO', 'ALIMENTOS', 'MOVEIS'];
const parseId = (value) => Number.parseInt(value, 10);

export const criar = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Campo obrigatório não informado.' });
        }

        const { nome, categoria, preco, disponivel, descricao, fornecedorId } = req.body;

        if (!nome || !categoria || preco === undefined || disponivel === undefined) {
            return res.status(400).json({ error: 'Campo obrigatório não informado.' });
        }

        if (!CATEGORIAS_VALIDAS.includes(categoria)) {
            return res.status(400).json({ error: 'Categoria inválida.' });
        }

        const precoNumero = Number.parseFloat(preco);
        if (Number.isNaN(precoNumero) || precoNumero < 0) {
            return res.status(400).json({ error: 'Campo obrigatório não informado.' });
        }

        const isDisponivel = disponivel === true || disponivel === 'true';

        const produto = new ProdutoModel(
            null,
            nome,
            descricao,
            categoria,
            isDisponivel,
            precoNumero,
            null,
            fornecedorId
        );
        const data = await produto.criar();
        return res.status(201).json({ message: 'Registro criado com sucesso.', data });
    } catch (err) {
        const msg = err.message;
        if (['Campo obrigatório não informado.', 'Categoria inválida.'].includes(msg)) {
            return res.status(400).json({ error: msg });
        }
        return res.status(500).json({ error: 'Erro interno.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const filtros = {};

        if (req.query.nome) {
            filtros.nome = req.query.nome;
        }

        if (req.query.categoria) {
            if (!CATEGORIAS_VALIDAS.includes(req.query.categoria)) {
                return res.status(400).json({ error: 'Categoria inválida.' });
            }
            filtros.categoria = req.query.categoria;
        }

        if (req.query.disponivel !== undefined) {
            if (req.query.disponivel !== 'true' && req.query.disponivel !== 'false') {
                return res.status(400).json({ error: 'Campo obrigatório não informado.' });
            }
            filtros.disponivel = req.query.disponivel;
        }

        const registros = await ProdutoModel.buscarTodos(filtros);
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

        const registro = await ProdutoModel.buscarPorId(id);
        if (!registro) return res.status(404).json({ error: 'Registro não encontrado.' });
        return res.json({ data: registro });
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

        const produto = await ProdutoModel.buscarPorId(id);
        if (!produto) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        if (produto.disponivel === false) {
            return res.status(400).json({ error: 'Não é permitido utilizar item indisponível.' });
        }

        if (req.body.nome !== undefined) {
            if (!String(req.body.nome).trim()) {
                return res.status(400).json({ error: 'Campo obrigatório não informado.' });
            }
            produto.nome = String(req.body.nome).trim();
        }

        if (req.body.descricao !== undefined) {
            produto.descricao = req.body.descricao;
        }

        if (req.body.categoria !== undefined) {
            if (!CATEGORIAS_VALIDAS.includes(req.body.categoria)) {
                return res.status(400).json({ error: 'Categoria inválida.' });
            }
            produto.categoria = req.body.categoria;
        }

        if (req.body.preco !== undefined) {
            const precoAtualizado = Number.parseFloat(req.body.preco);
            if (Number.isNaN(precoAtualizado) || precoAtualizado < 0) {
                return res.status(400).json({ error: 'Campo obrigatório não informado.' });
            }
            produto.preco = precoAtualizado;
        }

        if (req.body.disponivel !== undefined) {
            produto.disponivel = req.body.disponivel === true || req.body.disponivel === 'true';
        }

        if (req.body.fornecedorId !== undefined) {
            produto.fornecedorId = req.body.fornecedorId;
        }

        const data = await produto.atualizar();
        return res.json({ message: 'Registro atualizado com sucesso.', data });
    } catch (err) {
        const msg = err.message;
        if (
            [
                'Campo obrigatório não informado.',
                'Categoria inválida.',
                'Não é permitido utilizar item indisponível.',
            ].includes(msg)
        ) {
            return res.status(400).json({ error: msg });
        }
        if (msg === 'Registro não encontrado.') return res.status(404).json({ error: msg });
        return res.status(500).json({ error: 'Erro interno.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const produto = await ProdutoModel.buscarPorId(id);
        if (!produto) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        if (produto.disponivel === false) {
            return res.status(400).json({ error: 'Não é permitido utilizar item indisponível.' });
        }

        await produto.deletar();
        return res.json({ message: 'Registro deletado com sucesso.' });
    } catch (err) {
        return res.status(500).json({ error: 'Erro interno.' });
    }
};

export const listar = buscarTodos;
export const obter = buscarPorId;
