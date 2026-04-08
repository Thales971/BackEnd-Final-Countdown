import ProdutoModel from '../models/ProdutoModel.js';

const CATEGORIAS_VALIDAS = ['ELETRONICOS', 'VESTUARIO', 'ALIMENTOS', 'MOVEIS'];
const parseId = (value) => Number.parseInt(value, 10);

/**
 * @typedef {object} reqBodyProduto
 * @property {string} nome.required
 * @property {string} descricao
 * @property {string} categoria.required
 * @property {boolean} disponivel.required
 * @property {number} preco.required
 * @property {integer} fornecedorId
 */

/**
 * POST /api/produtos
 * @tags Produtos
 * @summary Cria um novo registro de produto
 * @description EndPoint responsável por cadastrar um novo produto no sistema web.
 * @param {reqBodyProduto} request.body.required
 *
 * @return 201 - Produto criado com sucesso
 * @return 400 - Dados inválidos ou campos obrigatórios não informados
 * @return 500 - Erro interno no servidor
 */
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

        const produto = new ProdutoModel({
            nome,
            descricao,
            categoria,
            disponivel,
            preco: precoNumero,
            fornecedorId,
        });

        const data = await produto.criar();

        return res
            .status(201)
            .json({ message: `O produto "${data.nome}" foi criado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        const msg = error.message;
        if (['Campo obrigatório não informado.', 'Categoria inválida.'].includes(msg)) {
            return res.status(400).json({ error: msg });
        }
        return res.status(500).json({ error: 'Erro interno.' });
    }
};

/**
 * GET /api/produtos
 * @tags Produtos
 * @summary Busca todos os registros de produtos
 * @description EndPoint responsável por buscar produtos cadastrados no sistema web.
 * Permite filtrar os resultados utilizando parâmetros de consulta (query params).
 *
 * @param {string} nome.query
 * @param {string} categoria.query
 * @param {boolean} disponivel.query
 *
 * @return {array<reqBodyProduto>} 200 - Lista de produtos encontrada com sucesso
 * @return {object} 500 - Erro interno no servidor
 */
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
        return res.status(200).json(registros);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        return res.status(500).json({ error: 'Erro interno.' });
    }
};

/**
 * GET /api/produtos/{id}
 * @tags Produtos
 * @summary Busca um registro de produto por ID
 * @description EndPoint responsável por buscar um produto específico cadastrado no sistema web a partir do ID.
 * @param {integer} id.path.required
 *
 * @return 200 - Produto encontrado com sucesso
 * @return 400 - ID inválido
 * @return 404 - Produto não encontrado
 * @return 500 - Erro interno do servidor
 */
export const buscarPorId = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const registro = await ProdutoModel.buscarPorId(id);

        if (!registro) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        return res.status(200).json({ data: registro });
    } catch (error) {
        console.error('Erro ao buscar produto por ID:', error);
        return res.status(500).json({ error: 'Erro interno.' });
    }
};

/**
 * PUT /api/produtos/{id}
 * @tags Produtos
 * @summary Atualiza um registro de produto por ID
 * @description Endpoint responsável por atualizar produto específico pelo seu ID.
 * @param {integer} id.path.required
 * @param {reqBodyProduto} request.body.required
 *
 * @return 200 - Registro atualizado com sucesso
 * @return 400 - Dados inválidos ou campos obrigatórios não informados
 * @return 404 - Erro ao atualizar ID do registro
 * @return 500 - Erro interno no servidor
 */
export const atualizar = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Campo obrigatório não informado.' });
        }

        const produto = await ProdutoModel.buscarPorId(id);

        if (!produto) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        if (req.body.nome !== undefined) {
            produto.nome = String(req.body.nome).trim();
        }
        if (req.body.descricao !== undefined) {
            produto.descricao = req.body.descricao;
        }
        if (req.body.categoria !== undefined) {
            produto.categoria = req.body.categoria;
        }
        if (req.body.preco !== undefined) {
            produto.preco = req.body.preco;
        }
        if (req.body.disponivel !== undefined) {
            produto.disponivel = req.body.disponivel;
        }
        if (req.body.fornecedorId !== undefined) {
            produto.fornecedorId = req.body.fornecedorId;
        }

        const data = await produto.atualizar();

        return res.status(200).json({
            message: `O produto "${data.nome}" foi atualizado com sucesso!`,
            data,
        });
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        const msg = error.message;
        if (
            [
                'Campo obrigatório não informado.',
                'Categoria inválida.',
                'Não é permitido utilizar item indisponível.',
            ].includes(msg)
        ) {
            return res.status(400).json({ error: msg });
        }
        return res.status(500).json({ error: 'Erro interno.' });
    }
};

/**
 * DELETE /api/produtos/{id}
 * @tags Produtos
 * @summary Deleta um registro de produto por ID
 * @description Endpoint responsável por deletar produto específico pelo seu ID.
 * @param {integer} id.path.required
 *
 * @return 200 - Registro deletado com sucesso
 * @return 400 - ID inválido
 * @return 404 - Erro ao deletar ID do registro
 * @return 500 - Erro interno no servidor
 */
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

        await produto.deletar();

        return res.status(200).json({
            message: `O produto "${produto.nome}" foi deletado com sucesso!`,
            deletado: produto,
        });
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        const msg = error.message;
        if (msg === 'Não é permitido utilizar item indisponível.') {
            return res.status(400).json({ error: msg });
        }
        return res.status(500).json({ error: 'Erro interno.' });
    }
};

export const listar = buscarTodos;
export const obter = buscarPorId;
