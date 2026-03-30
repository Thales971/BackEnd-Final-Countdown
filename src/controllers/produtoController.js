import ProdutoModel from '../models/ProdutoModel.js';

const CATEGORIAS_VALIDAS = ['ELETRONICOS', 'VESTUARIO', 'ALIMENTOS', 'MOVEIS'];

/**
 * @typedef {object} ReqBodyProduto
 * @property {string} nome.required - Nome do produto (obrigatório)
 * @property {string} descricao - Descrição detalhada do produto
 * @property {string} categoria.required - Categoria do produto (Ex: ELETRONICOS, VESTUARIO, ALIMENTOS, MOVEIS)
 * @property {number} preco.required - Preço do produto (obrigatório, maior ou igual a zero)
 * @property {boolean} disponivel.required - Status de disponibilidade no catálogo (obrigatório)
 */

/**
 * POST /api/catalogo
 * @tags Catálogo
 * @summary Cria um novo produto no catálogo
 * @description Endpoint responsável por cadastrar um novo produto/item no sistema
 * @param {ReqBodyProduto} request.body.required
 *
 * @return 201 - Registro criado com sucesso
 * @return 400 - Dados inválidos, categoria incorreta ou campos obrigatórios não informados
 * @return 500 - Erro interno ao salvar o registro
 */

export const criar = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, descricao, categoria, preco, disponivel } = req.body;

        if (!nome) return res.status(400).json({ error: 'Campo obrigatório não informado.' });

        let categoriaTratada = categoria;
        if (
            !categoria ||
            !CATEGORIAS_VALIDAS.includes((categoriaTratada = categoria.trim().toUpperCase()))
        ) {
            return res.status(400).json({ error: 'Categoria inválida.' });
        }

        if (preco === undefined || preco === null || parseFloat(preco) < 0) {
            return res
                .status(400)
                .json({ error: 'Campo obrigatório não informado ou preço inválido.' });
        }
        if (disponivel === undefined || disponivel === null) {
            return res.status(400).json({ error: 'Campo obrigatório não informado.' });
        }

        const produto = new ProdutoModel({
            nome,
            descricao,
            categoria: categoriaTratada,
            preco: parseFloat(preco),
            disponivel: disponivel === 'true' || disponivel === true,
        });

        const data = await produto.criar();

        return res.status(201).json({ message: 'Registro criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o registro.' });
    }
};

/**
 * GET /api/catalogo
 * @tags Catálogo
 * @summary Busca todos os produtos
 * @description Endpoint responsável por buscar todos os produtos do catálogo. Permite filtrar os resultados utilizando parâmetros de consulta (query params).
 * @param {string} nome.query - Filtrar por parte do nome
 * @param {string} categoria.query - Filtrar pela categoria exata
 * @param {boolean} disponivel.query - Filtrar por itens disponíveis ou indisponíveis
 *
 * @return 200 - Registros encontrados com sucesso
 * @return 404 - Registro não encontrado
 * @return 500 - Erro interno do servidor
 */

export const buscarTodos = async (req, res) => {
    try {
        const registros = await ProdutoModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(404).json({ message: 'Registro não encontrado.' });
        }

        return res.status(200).json(registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar registros.' });
    }
};

/**
 * GET /api/catalogo/{id}
 * @tags Catálogo
 * @summary Busca um produto por ID
 * @description Endpoint responsável por buscar um registro de produto específico através do seu ID
 * @param {integer} id.path.required - ID numérico do produto
 *
 * @return 200 - Registro encontrado com sucesso
 * @return 400 - O ID enviado não é um número válido
 * @return 404 - Registro não encontrado
 * @return 500 - Erro interno do servidor
 */

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id))
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });

        const produto = await ProdutoModel.buscarPorId(parseInt(id));

        if (!produto) return res.status(404).json({ error: 'Registro não encontrado.' });

        return res.status(200).json({ data: produto });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar registro.' });
    }
};

/**
 * PUT /api/catalogo/{id}
 * @tags Catálogo
 * @summary Atualiza um produto
 * @description Endpoint responsável por atualizar parcialmente ou totalmente os dados de um produto existente
 * @param {integer} id.path.required - ID do produto a ser atualizado
 * @param {ReqBodyProduto} request.body.required - Dados do produto
 *
 * @return 200 - Registro atualizado com sucesso
 * @return 400 - ID inválido, corpo vazio ou dados incorretos (ex: preço negativo)
 * @return 404 - Registro não encontrado
 * @return 500 - Erro interno do servidor
 */

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const produto = await ProdutoModel.buscarPorId(parseInt(id));

        if (!produto) return res.status(404).json({ error: 'Registro não encontrado.' });

        if (req.body.nome !== undefined) produto.nome = req.body.nome;
        if (req.body.descricao !== undefined) produto.descricao = req.body.descricao;
        if (req.body.categoria !== undefined) {
            const catLimpa = req.body.categoria.trim().toUpperCase();
            if (!CATEGORIAS_VALIDAS.includes(catLimpa)) {
                return res.status(400).json({ error: 'Categoria inválida.' });
            }
            produto.categoria = catLimpa;
        }
        if (req.body.preco !== undefined) {
            if (parseFloat(req.body.preco) < 0)
                return res.status(400).json({ error: 'Preço não pode ser negativo.' });
            produto.preco = parseFloat(req.body.preco);
        }
        if (req.body.disponivel !== undefined) {
            produto.disponivel = req.body.disponivel === 'true' || req.body.disponivel === true;
        }

        const data = await produto.atualizar();

        return res
            .status(200)
            .json({ message: `O registro "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        return res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
};

/**
 * DELETE /api/catalogo/{id}
 * @tags Catálogo
 * @summary Deleta um produto
 * @description Endpoint responsável por remover permanentemente um produto do catálogo
 * @param {integer} id.path.required - ID do produto a ser deletado
 *
 * @return 200 - Registro deletado com sucesso
 * @return 400 - ID inválido
 * @return 404 - Registro não encontrado
 * @return 500 - Erro interno do servidor
 */

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const produto = await ProdutoModel.buscarPorId(parseInt(id));

        if (!produto) return res.status(404).json({ error: 'Registro não encontrado.' });

        await produto.deletar();

        return res.status(200).json({
            message: `O registro "${produto.nome}" foi deletado com sucesso!`,
            deletado: produto,
        });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        return res.status(500).json({ error: 'Erro ao deletar registro.' });
    }
};
