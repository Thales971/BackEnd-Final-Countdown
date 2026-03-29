/**
 * src/utils/viaCep.js
 * Utilitário para validar CEP e consultar a API ViaCEP.
 * Lança erros com mensagens específicas usadas pela atividade.
 */

export async function consultarCEP(cep) {
    if (!cep || typeof cep !== 'string') {
        throw new Error('CEP inválido.');
    }

    const onlyDigits = cep.replace(/\D/g, '');
    if (onlyDigits.length !== 8) {
        throw new Error('CEP inválido.');
    }

    const url = `https://viacep.com.br/ws/${onlyDigits}/json/`;

    try {
        const res = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
        if (!res.ok) {
            throw new Error('Serviço externo indisponível.');
        }

        const data = await res.json();

        if (data.erro) {
            throw new Error('CEP não encontrado.');
        }

        return {
            cep: onlyDigits,
            logradouro: data.logradouro || null,
            bairro: data.bairro || null,
            localidade: data.localidade || null,
            uf: data.uf || null,
        };
    } catch (err) {
        if (err.message === 'CEP inválido.' || err.message === 'CEP não encontrado.') {
            throw err;
        }
        throw new Error('Serviço externo indisponível.');
    }
}

export default { consultarCEP };
