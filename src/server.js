import express from 'express';
import 'dotenv/config';
import exemplosRoutes from './routes/exemploRoute.js';
import docApiSwagger from 'express-jsdoc-swagger';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

docApiSwagger(app)({
    info: {
        title: 'API de Produtos',
        version: '1.0.0',
        description: 'Documentação da API de Produtos',
    },
    baseDir: import.meta.dirname,
    filesPattern: './**/*.js',
});

app.get('/', (req, res) => {
    res.send('🚀 API funcionando');
});

// Rotas
app.use('/api', exemplosRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
