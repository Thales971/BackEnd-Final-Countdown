import pg from 'pg';
import 'dotenv/config';
import pkg from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const { PrismaClient } = pkg;
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Resetando tabelas Fornecedor e Produto...');

    await prisma.produto.deleteMany();
    await prisma.fornecedor.deleteMany();

    console.log('📦 Inserindo 5 Fornecedores...');

    await prisma.fornecedor.createMany({
        data: [
            {
                nome: 'Tech Supply Ltda',
                email: 'contato@techsupply.com',
                telefone: '(11) 98765-4321',
                cnpj: '12.345.678/0001-90',
                cep: '01001000',
                logradouro: 'Rua das Flores',
                bairro: 'Centro',
                localidade: 'São Paulo',
                uf: 'SP',
                ativo: true,
            },
            {
                nome: 'Moda Express',
                email: 'vendas@modaexpress.com',
                telefone: '(21) 99876-5432',
                cnpj: '23.456.789/0001-12',
                cep: '20040030',
                logradouro: 'Av. Rio Branco',
                bairro: 'Centro',
                localidade: 'Rio de Janeiro',
                uf: 'RJ',
                ativo: true,
            },
            {
                nome: 'Alimentos Prime',
                email: 'atendimento@alimentosprime.com',
                telefone: '(31) 97654-3210',
                cnpj: '34.567.890/0001-34',
                cep: '30130010',
                logradouro: 'Rua Bahia',
                bairro: 'Funcionários',
                localidade: 'Belo Horizonte',
                uf: 'MG',
                ativo: true,
            },
            {
                nome: 'Móveis Conforto',
                email: 'suporte@moveisconforto.com',
                telefone: '(41) 96543-2109',
                cnpj: '45.678.901/0001-56',
                cep: '80010010',
                logradouro: 'Av. Batel',
                bairro: 'Batel',
                localidade: 'Curitiba',
                uf: 'PR',
                ativo: true,
            },
            {
                nome: 'Eletrônicos Global',
                email: 'comercial@eletronicosglobal.com',
                telefone: '(51) 95432-1098',
                cnpj: '56.789.012/0001-78',
                cep: '90010010',
                logradouro: 'Rua dos Andradas',
                bairro: 'Centro',
                localidade: 'Porto Alegre',
                uf: 'RS',
                ativo: true,
            },
        ],
    });

    console.log('📦 Inserindo 5 Produtos...');

    await prisma.produto.createMany({
        data: [
            {
                nome: 'Notebook Dell XPS 15',
                descricao: 'Intel i7, 16GB RAM, 512GB SSD',
                categoria: 'ELETRONICOS',
                disponivel: true,
                preco: 7499.9,
                foto: null,
                fornecedorId: 1,
            },
            {
                nome: 'Camisa Polo Ralph Lauren',
                descricao: 'Algodão premium, tamanho M',
                categoria: 'VESTUARIO',
                disponivel: true,
                preco: 299.9,
                foto: null,
                fornecedorId: 2,
            },
            {
                nome: 'Arroz Integral 5kg',
                descricao: 'Tipo 1, embalagem a vácuo',
                categoria: 'ALIMENTOS',
                disponivel: true,
                preco: 24.9,
                foto: null,
                fornecedorId: 3,
            },
            {
                nome: 'Sofá 3 lugares Couro',
                descricao: 'Reclinável, cor preto',
                categoria: 'MOVEIS',
                disponivel: true,
                preco: 1899.9,
                foto: null,
                fornecedorId: 4,
            },
            {
                nome: 'Smart TV LG 55" OLED',
                descricao: '4K, Wi-Fi, WebOS',
                categoria: 'ELETRONICOS',
                disponivel: true,
                preco: 4299.9,
                foto: null,
                fornecedorId: 5,
            },
        ],
    });
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('✅ Seed concluído! (5 Fornecedores + 5 Produtos)');
    });
