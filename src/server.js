import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import path from 'path';
import expressJSDocSwagger from 'express-jsdoc-swagger';

import apiKey from './utils/apiKey.js';
import fornecedorRoutes from './routes/fornecedorRoutes.js';
import catalogoRoutes from './routes/catalogoRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const swaggerOptions = {
    info: {
        version: '1.0.0',
        title: 'API Final Countdown',
        description: 'API REST do tema Produtos e Fornecedores.',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
    baseDir: process.cwd(),
    filesPattern: './src/controllers/*.js',
    exposeApiDocs: true,
    apiDocsPath: '/api-docs.json',
    swaggerUIPath: '/api-docs',
    exposeSwaggerUI: true,
    notRequiredAsNullable: false,
};

expressJSDocSwagger(app)(swaggerOptions);

// servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// rotas
// todas as rotas /principal exigem X-API-Key (middleware apiKey)
app.use('/principal', apiKey, fornecedorRoutes);

// rotas de produto/catálogo (sem autenticação)
app.use('/catalogo', catalogoRoutes);

app.get('/', (req, res) => res.send('🚀 API funcionando'));

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Erro interno.' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
    console.log(`OpenAPI JSON em http://localhost:${PORT}/api-docs.json`);
});
