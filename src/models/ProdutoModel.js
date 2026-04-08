import prisma from "../utils/prismaClient.js";

const CATEGORIAS_VALIDAS = ['ELETRONICOS', 'VESTUARIO', 'ALIMENTOS', 'MOVEIS'];

export default class ProdutoModel {
  constructor({
    id = null,
    nome,
    descricao = null,
    categoria,
    disponivel = true,
    preco,
    foto = null,
    fornecedorId = null,
  } = {}) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.categoria = categoria;
    this.disponivel = disponivel;
    this.preco = preco;
    this.foto = foto;
    this.fornecedorId = fornecedorId;
  }

  validar() {
    if (!this.nome || String(this.nome).trim() === "") {
      throw new Error('Campo obrigatório não informado.');
    }
    if (!this.categoria || !CATEGORIAS_VALIDAS.includes(this.categoria)) {
      throw new Error('Categoria inválida.');
    }
    if (this.preco === undefined || this.preco === null || isNaN(this.preco) || Number(this.preco) < 0) {
      throw new Error('Campo obrigatório não informado.');
    }
    if (this.disponivel === undefined || this.disponivel === null) {
      throw new Error('Campo obrigatório não informado.');
    }
    this.preco = Number(this.preco);
    this.disponivel = this.disponivel === true || String(this.disponivel).toLowerCase() === 'true';
  }

  async criar() {
    this.validar();

    const registro = await prisma.produto.create({
      data: {
        nome: this.nome,
        descricao: this.descricao,
        categoria: this.categoria,
        disponivel: this.disponivel,
        preco: this.preco,
        foto: this.foto,
        fornecedorId: this.fornecedorId ? Number(this.fornecedorId) : null,
      },
    });

    this.id = registro.id;
    return registro;
  }

  async atualizar() {
    if (!this.id) {
      throw new Error("ID do produto é necessário para a atualização.");
    }
    
    // According to existing controller logic
    if (this.disponivel === false || this.disponivel === 'false') {
       throw new Error('Não é permitido utilizar item indisponível.');
    }

    this.validar();

    return prisma.produto.update({
      where: { id: this.id },
      data: {
        nome: this.nome,
        descricao: this.descricao,
        categoria: this.categoria,
        disponivel: this.disponivel,
        preco: this.preco,
        foto: this.foto,
        fornecedorId: this.fornecedorId ? Number(this.fornecedorId) : null,
      },
    });
  }

  async deletar() {
    if (this.disponivel === false || String(this.disponivel).toLowerCase() === 'false') {
       throw new Error('Não é permitido utilizar item indisponível.');
    }
    return prisma.produto.delete({ where: { id: this.id } });
  }

  static async buscarTodos(filtros = {}) {
    const where = {};

    if (filtros.nome) {
      where.nome = { contains: filtros.nome, mode: "insensitive" };
    }

    if (filtros.categoria) {
      where.categoria = filtros.categoria;
    }

    if (filtros.disponivel !== undefined) {
      where.disponivel = String(filtros.disponivel) === 'true';
    }

    return prisma.produto.findMany({ where });
  }

  static async buscarPorId(id) {
    const data = await prisma.produto.findUnique({
      where: { id: Number(id) },
    });

    if (!data) return null;
    return new ProdutoModel(data);
  }
}