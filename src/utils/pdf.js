import htmlPdf from 'html-pdf-node';

function produtoParaHtml(produto, fotoBase64 = null) {
    return `
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; color: #1e293b; }
      h1 { margin-bottom: 16px; }
      .card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; }
      .foto { margin: 10px 0 18px; }
      .foto img { max-width: 260px; border-radius: 8px; border: 1px solid #cbd5e1; }
      .linha { margin: 6px 0; }
      .chave { font-weight: bold; }
    </style>
  </head>
  <body>
    <h1>Relatório Individual do Catálogo</h1>
    <div class="card">
      <div class="linha"><span class="chave">ID:</span> ${produto.id}</div>
      <div class="linha"><span class="chave">Nome:</span> ${produto.nome}</div>
      <div class="linha"><span class="chave">Descrição:</span> ${produto.descricao || '-'}</div>
      <div class="linha"><span class="chave">Categoria:</span> ${produto.categoria}</div>
      <div class="linha"><span class="chave">Disponível:</span> ${produto.disponivel ? 'Sim' : 'Não'}</div>
      <div class="linha"><span class="chave">Preço:</span> R$ ${Number(produto.preco).toFixed(2)}</div>
      <div class="linha"><span class="chave">Fornecedor ID:</span> ${produto.fornecedorId ?? '-'}</div>
      <div class="foto">
        ${fotoBase64 ? `<img src="data:image/jpeg;base64,${fotoBase64}" alt="Foto do produto" />` : 'Sem foto cadastrada'}
      </div>
    </div>
  </body>
</html>`;
}

export async function gerarPdfBuffer(html) {
    const file = { content: html };
    const options = { format: 'A4' };
    const pdfBuffer = await htmlPdf.generatePdf(file, options);
    return pdfBuffer;
}

export async function gerarPdfIndividual(produto, fotoBase64 = null) {
    const html = produtoParaHtml(produto, fotoBase64);
    return gerarPdfBuffer(html);
}

export async function gerarPdfGeral(produtos) {
    const rows = produtos
        .map(
            (p) =>
                `<tr>
                    <td>${p.id}</td>
                    <td>${p.nome}</td>
                    <td>${p.categoria}</td>
                    <td>${p.disponivel ? 'Sim' : 'Não'}</td>
                    <td>R$ ${Number(p.preco).toFixed(2)}</td>
                    <td>${p.fornecedorId ?? '-'}</td>
                </tr>`
        )
        .join('');

    const html = `<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; color: #1e293b; }
    h1 { margin-bottom: 12px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
    th { background: #f1f5f9; }
  </style>
</head>
<body>
  <h1>Relatório Geral do Catálogo</h1>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Nome</th>
        <th>Categoria</th>
        <th>Disponível</th>
        <th>Preço</th>
        <th>Fornecedor ID</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;

    return gerarPdfBuffer(html);
}

export default { gerarPdfIndividual, gerarPdfGeral };
