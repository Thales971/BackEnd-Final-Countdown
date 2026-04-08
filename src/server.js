import express from 'express';
import 'dotenv/config';
import fornecedorRoutes from './routes/fornecedorRoutes.js';
import catalogoRoutes from './routes/catalogoRoutes.js';
import pdfRoute from './routes/pdfRoute.js';
import docApiSwagger from 'express-jsdoc-swagger';
import autenticar from './utils/apiKey.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

docApiSwagger(app)({
    info: {
        title: 'API Final Countdown - Documentação Swagger',
        version: '1.0.0',
        description:
            'Uma API projetada para o controle essencial de cadastros de produtos e fornecedores corporativos.',
    },
    baseDir: import.meta.dirname,
    filesPattern: './**/*.js',
});

app.get('/', (req, res) => {
    res.send('🚀 API funcionando');
});

// Rotas
app.use('/api/fornecedores', autenticar, fornecedorRoutes);
app.use('/api/produtos', catalogoRoutes);
app.use('/api/pdfs', pdfRoute);

// Arquivos estáticos
app.use('/', express.static('uploads'));

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
