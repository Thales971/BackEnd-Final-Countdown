import express from 'express';
import 'dotenv/config';
import path from 'path';

import apiKey from './utils/apiKey.js';
import fornecedorRoutes from './routes/fornecedorRoutes.js';
import produtoRoutes from './routes/produtoRoutes.js';
import exemploRoutes from './routes/exemploRoute.js'; // opcional

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// rotas
// todas as rotas /principal exigem X-API-Key (middleware apiKey)
app.use('/principal', apiKey, fornecedorRoutes);

// rotas de produto (sem autenticação)
app.use('/catalogo', produtoRoutes);

// rota opcional de exemplo
app.use('/exemplo', exemploRoutes);

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
});
