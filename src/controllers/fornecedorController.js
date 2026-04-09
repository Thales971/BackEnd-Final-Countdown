import FornecedorModel from '../models/FornecedorModel.js';

/**
 * @typedef {object} reqBodyFornecedor
 * @property {string} nome.required
 * @property {string} email.required
 * @property {string} telefone.required
 * @property {string} cnpj.required
 * @property {string} cep.required
 * @property {boolean} ativo.required
 */

/**
 * POST /principal
 * @tags Fornecedores
 * @summary Cria um novo registro de fornecedor
 * @description EndPoint responsável por cadastrar um novo fornecedor no sistema web.
 * @param {reqBodyFornecedor} request.body.required
 *
 * @return 201 - Fornecedor criado com sucesso
 * @return 400 - Dados inválidos ou campos obrigatórios não informados
 * @return 500 - Erro interno no servidor
 */
export const criar = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, email, telefone, cnpj, cep, ativo } = req.body;

        if (!nome) {
            return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
        }
        if (!email) {
            return res.status(400).json({ error: 'O campo "email" é obrigatório!' });
        }
        if (!telefone) {
            return res.status(400).json({ error: 'O campo "telefone" é obrigatório!' });
        }
        if (!cnpj) {
            return res.status(400).json({ error: 'O campo "cnpj" é obrigatório!' });
        }
        if (!cep) {
            return res.status(400).json({ error: 'O campo "cep" é obrigatório!' });
        }
        if (ativo === undefined || typeof ativo !== 'boolean') {
            return res.status(400).json({ error: 'O campo "ativo" deve ser boolean!' });
        }

        const fornecedor = new FornecedorModel({
            nome,
            email,
            telefone,
            cnpj,
            cep,
            ativo,
        });

        const data = await fornecedor.criar();

        return res.status(201).json({ message: 'Registro criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        const msg = error.message;
        if (
            ['CEP inválido.', 'CEP não encontrado.', 'Campo obrigatório não informado.'].includes(
                msg
            )
        ) {
            return res.status(400).json({ error: msg });
        }
        if (msg === 'Serviço externo indisponível.') {
            return res.status(400).json({ error: msg });
        }
        return res.status(500).json({ error: 'Erro interno ao salvar o registro.' });
    }
};

/**
 * GET /principal
 * @tags Fornecedores
 * @summary Busca todos os registros de fornecedores
 * @description EndPoint responsável por buscar fornecedores cadastrados no sistema web.
 * Permite filtrar os resultados utilizando parâmetros de consulta (query params).
 *
 * @param {string} nome.query
 * @param {string} email.query
 * @param {string} localidade.query
 * @param {boolean} ativo.query
 *
 * @return {array<reqBodyFornecedor>} 200 - Lista de fornecedores encontrada com sucesso
 * @return {object} 404 - Nenhum fornecedor encontrado
 * @return {object} 500 - Erro interno no servidor
 */
export const buscarTodos = async (req, res) => {
    try {
        const fornecedores = await FornecedorModel.buscarTodos(req.query);

        if (!fornecedores || fornecedores.length === 0) {
            return res.status(404).json({ message: 'Nenhum fornecedor encontrado.' });
        }

        return res.status(200).json(fornecedores);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar fornecedores.' });
    }
};

/**
 * GET /principal/{id}
 * @tags Fornecedores
 * @summary Busca um registro de fornecedor por ID
 * @description EndPoint responsável por buscar um fornecedor específico cadastrado no sistema web a partir do ID.
 * @param {integer} id.path.required
 *
 * @return 200 - Fornecedor encontrado com sucesso
 * @return 400 - ID inválido
 * @return 404 - Fornecedor não encontrado
 * @return 500 - Erro interno do servidor
 */
export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const fornecedor = await FornecedorModel.buscarPorId(parseInt(id));

        if (!fornecedor) {
            return res.status(404).json({ error: 'Fornecedor não encontrado.' });
        }

        return res.status(200).json({ data: fornecedor });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar fornecedor.' });
    }
};

/**
 * PUT /principal/{id}
 * @tags Fornecedores
 * @summary Atualiza um registro de fornecedor por ID
 * @description Endpoint responsável por atualizar fornecedor específico pelo seu ID.
 * @param {integer} id.path.required
 * @param {reqBodyFornecedor} request.body.required
 *
 * @return 200 - Registro atualizado com sucesso
 * @return 400 - Dados inválidos ou campos obrigatórios não informados
 * @return 404 - Erro ao atualizar ID do registro
 * @return 500 - Erro interno no servidor
 */
export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const fornecedor = await FornecedorModel.buscarPorId(parseInt(id));

        if (!fornecedor) {
            return res.status(404).json({ error: 'Fornecedor não encontrado para atualizar.' });
        }

        if (req.body.nome !== undefined) {
            fornecedor.nome = req.body.nome;
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
            fornecedor.ativo = req.body.ativo;
        }

        const data = await fornecedor.atualizar();

        return res.status(200).json({
            message: `O registro "${data.nome}" foi atualizado com sucesso!`,
            data,
        });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        const msg = error.message;
        if (
            [
                'CEP inválido.',
                'CEP não encontrado.',
                'Operação não permitida para registro inativo.',
                'Campo obrigatório não informado.',
            ].includes(msg)
        ) {
            return res.status(400).json({ error: msg });
        }
        if (msg === 'Serviço externo indisponível.') {
            return res.status(400).json({ error: msg });
        }
        return res.status(500).json({ error: 'Erro ao atualizar fornecedor.' });
    }
};

/**
 * DELETE /principal/{id}
 * @tags Fornecedores
 * @summary Deleta um registro de fornecedor por ID
 * @description Endpoint responsável por deletar fornecedor específico pelo seu ID.
 * @param {integer} id.path.required
 *
 * @return 200 - Registro deletado com sucesso
 * @return 400 - ID inválido
 * @return 404 - Erro ao deletar ID do registro
 * @return 500 - Erro interno no servidor
 */
export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const fornecedor = await FornecedorModel.buscarPorId(parseInt(id));

        if (!fornecedor) {
            return res.status(404).json({ error: 'Fornecedor não encontrado para deletar.' });
        }

        await fornecedor.deletar();

        return res.status(200).json({
            message: `O fornecedor "${fornecedor.nome}" foi deletado com sucesso!`,
            deletado: fornecedor,
        });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        const msg = error.message;
        if (msg === 'Operação não permitida para registro inativo.') {
            return res.status(400).json({ error: msg });
        }
        return res.status(500).json({ error: 'Erro ao deletar fornecedor.' });
    }
};

export const listar = buscarTodos;
export const obter = buscarPorId;
