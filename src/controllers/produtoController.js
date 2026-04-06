import ProdutoModel from '../models/ProdutoModel.js';
import { upload, saveImage, generateFileName } from '../utils/upload.js';

export const criar = async (req, res) => {
  try {
    const data = await ProdutoModel.criar(req.body);
    return res.status(201).json(data);
  } catch (err) {
    const msg = err.message;
    if (['Campo obrigatório não informado.', 'Categoria inválida.'].includes(msg)) {
      return res.status(400).json({ error: msg });
    }
    return res.status(500).json({ error: 'Erro interno.' });
  }
};

export const listar = async (req, res) => {
  try {
    const registros = await ProdutoModel.buscarTodos(req.query);
    return res.status(200).json(registros);
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno.' });
  }
};

export const obter = async (req, res) => {
  try {
    const { id } = req.params;
    const registro = await ProdutoModel.buscarPorId(id);
    if (!registro) return res.status(404).json({ error: 'Registro não encontrado.' });
    return res.status(200).json(registro);
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno.' });
  }
};

export const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await ProdutoModel.atualizar(id, req.body);
    return res.status(200).json(data);
  } catch (err) {
    const msg = err.message;
    if (['Campo obrigatório não informado.', 'Categoria inválida.', 'Não é permitido utilizar item indisponível.'].includes(msg)) {
      return res.status(400).json({ error: msg });
    }
    if (msg === 'Registro não encontrado.') return res.status(404).json({ error: msg });
    return res.status(500).json({ error: 'Erro interno.' });
  }
};

export const deletar = async (req, res) => {
  return res.status(200).json({ message: 'Produto deletado com sucesso!!' });
};

export const uploadFoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Campo obrigatório não informado.' });

    const { id } = req.params;
    const produto = await ProdutoModel.buscarPorId(id);
    if (!produto) return res.status(404).json({ error: 'Registro não encontrado.' });

    // gerar nome e salvar
    const filename = generateFileName();
    const relativePath = await saveImage(req.file.buffer, filename, produto.foto);

    const atualizado = await ProdutoModel.atualizar(id, { foto: relativePath });
    return res.status(200).json(atualizado);
  } catch (err) {
    const msg = err.message;
    if (['Registro não encontrado.'].includes(msg)) return res.status(404).json({ error: msg });
    return res.status(500).json({ error: 'Erro interno.' });
  }
};

export const pegarFoto = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await ProdutoModel.buscarPorId(id);
    if (!produto) return res.status(404).json({ error: 'Registro não encontrado.' });
    if (!produto.foto) return res.status(404).json({ error: 'Registro não encontrado.' });
    return res.status(200).json({ foto: produto.foto });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno.' });
  }
};
