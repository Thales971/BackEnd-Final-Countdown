import htmlPdf from 'html-pdf-node';
import fs from 'fs';

function produtoParaHtml(produto, fotoBase64 = null) {
    return `
    <html>
      <body>
        <h1>Produto: ${produto.nome}</h1>
        ${fotoBase64 ? `<img src="data:image/jpeg;base64,${fotoBase64}" style="max-width:300px;" />` : ''}
        <ul>
          <li>Descrição: ${produto.descricao || ''}</li>
          <li>Categoria: ${produto.categoria}</li>
          <li>Preço: ${produto.preco}</li>
          <li>Disponível: ${produto.disponivel}</li>
        </ul>
      </body>
    </html>
  `;
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
                `<tr><td>${p.id}</td><td>${p.nome}</td><td>${p.categoria}</td><td>${p.preco}</td></tr>`,
        )
        .join('');
    const html = `<html><body><h1>Catálogo</h1><table border="1"><thead><tr><th>ID</th><th>Nome</th><th>Categoria</th><th>Preço</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
    return gerarPdfBuffer(html);
}

export default { gerarPdfIndividual, gerarPdfGeral };
