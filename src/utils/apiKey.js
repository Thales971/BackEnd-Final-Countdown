import 'dotenv/config';

export default function apiKey(req, res, next) {
    const expected = process.env.API_KEY;
    const provided = req.header('X-API-Key') || req.header('x-api-key');

    if (!expected || !provided || provided !== expected) {
        return res.status(401).json({ error: 'Acesso negado.' });
    }

    return next();
}
