import ProdutoModel from '../models/ProdutoModel.js';

/**
 * @typedef {object} ReqBodyProduto
 * @property {string} nome.required - Nome do produto
 * @property {string} descricao - Descrição do produto
 * @property {string} categoria.required - Categoria (ELETRONICOS, VESTUARIO, ALIMENTOS, MOVEIS)
 * @property {number} preco.required - Preço do produto
 * @property {boolean} disponivel.required - Disponibilidade no catálogo
 * @property {number} fornecedorId - ID do fornecedor relacionado (opcional)
 */

/**
 * POST /catalogo
 * @tags Catálogo
 * @summary Cria um novo item no catálogo
 * @param {ReqBodyProduto} request.body.required
 * @return 201 - Registro criado com sucesso
 * @return 400 - Campo obrigatório não informado ou categoria inválida
 * @return 500 - Erro interno
 */
export const criar = async (req, res) => {
    try {
        const data = await ProdutoModel.criar(req.body || {});
        return res.status(201).json(data);
    } catch (err) {
        const msg = err.message;
        if (['Campo obrigatório não informado.', 'Categoria inválida.'].includes(msg)) {
            return res.status(400).json({ error: msg });
        }

        return res.status(500).json({ error: 'Erro interno.' });
    }
};

/**
 * GET /catalogo
 * @tags Catálogo
 * @summary Lista itens do catálogo
 * @param {string} nome.query - Filtrar por nome
 * @param {string} categoria.query - Filtrar por categoria
 * @param {boolean} disponivel.query - Filtrar por disponibilidade
 * @return 200 - Registros encontrados
 * @return 500 - Erro interno
 */
export const listar = async (req, res) => {
    try {
        const registros = await ProdutoModel.buscarTodos(req.query);
        return res.status(200).json(registros);
    } catch (err) {
        return res.status(500).json({ error: 'Erro interno.' });
    }
};

/**
 * GET /catalogo/{id}
 * @tags Catálogo
 * @summary Busca item por ID
 * @param {integer} id.path.required - ID do item
 * @return 200 - Registro encontrado
 * @return 404 - Registro não encontrado
 * @return 500 - Erro interno
 */
export const obter = async (req, res) => {
    try {
        const { id } = req.params;

        const produto = await ProdutoModel.buscarPorId(id);

        if (!produto) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        return res.status(200).json(produto);
    } catch (err) {
        return res.status(500).json({ error: 'Erro interno.' });
    }
};

/**
 * PUT /catalogo/{id}
 * @tags Catálogo
 * @summary Atualiza item por ID
 * @param {integer} id.path.required - ID do item
 * @param {ReqBodyProduto} request.body.required
 * @return 200 - Registro atualizado
 * @return 400 - Campo obrigatório não informado, categoria inválida ou item indisponível
 * @return 404 - Registro não encontrado
 * @return 500 - Erro interno
 */
export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await ProdutoModel.atualizar(id, req.body || {});
        return res.status(200).json(data);
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

        if (msg === 'Registro não encontrado.') {
            return res.status(404).json({ error: msg });
        }

        return res.status(500).json({ error: 'Erro interno.' });
    }
};

/**
 * DELETE /catalogo/{id}
 * @tags Catálogo
 * @summary Remove item por ID
 * @param {integer} id.path.required - ID do item
 * @return 200 - Registro deletado
 * @return 400 - Item indisponível
 * @return 404 - Registro não encontrado
 * @return 500 - Erro interno
 */
export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        await ProdutoModel.deletar(id);
        return res.status(200).json({ message: 'Registro deletado com sucesso.' });
    } catch (err) {
        const msg = err.message;
        if (msg === 'Registro não encontrado.') {
            return res.status(404).json({ error: msg });
        }

        if (msg === 'Não é permitido utilizar item indisponível.') {
            return res.status(400).json({ error: msg });
        }

        return res.status(500).json({ error: 'Erro interno.' });
    }
};
