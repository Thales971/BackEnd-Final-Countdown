import htmlPdf from "html-pdf-node";
import fs from "fs";

export async function gerarPdfProduto(produto) {
    let fotoHtml = "-";

    if (produto.foto && fs.existsSync(produto.foto)) {
        const base64 = fs.readFileSync(produto.foto).toString("base64");
        fotoHtml = `<img src="data:image/jpeg;base64, ${base64}" width="80" style="border-radius: 15px;"/>`;
    }

    const html = `<!DOCTYPE html>
<html>
    <body>
        <h1 style="text-align: center;">Relatório do Produto</h1>

        <p style="text-align: center;">Foto: ${fotoHtml}</p>
        <p style="text-align: center;">Nome: ${produto.nome}</p>
        <p style="text-align: center;">Descrição: ${produto.descricao || "-"}</p>
        <p style="text-align: center;">Categoria: ${produto.categoria || "-"}</p>
        <p style="text-align: center;">Disponível: ${produto.disponivel}</p>
        <p style="text-align: center;">Preço: R$ ${produto.preco}</p>
    </body>
</html>`;

    return htmlPdf.generatePdf({ content: html }, { format: "A4" });
}

export async function gerarPdfTodos(produtos) {
    const linhas = produtos
        .map(
            (p) => `
    <tr>
        <td>${p.nome}</td>
        <td>${p.descricao || "-"}</td>
        <td>${p.categoria || "-"}</td>
        <td>${p.disponivel}</td>
        <td>R$ ${p.preco}</td>
        <td>${p.foto && fs.existsSync(p.foto) ? "- TEM FOTO -" : "-"}</td>
    </tr>
    `
        )
        .join("");

    const html = `
<h1 style="text-align: center;">Relatório de Produtos</h1>

<table border="1" cellspacing="0" cellpadding="8" style="width: 100%; text-align: center;">
    <tr>
        <th>Nome</th>
        <th>Descrição</th>
        <th>Categoria</th>
        <th>Disponível</th>
        <th>Preço</th>
        <th>Foto</th>
    </tr>
    ${linhas}
</table>

<p>Total: ${produtos.length}</p>
`;
    return htmlPdf.generatePdf({ content: html }, { format: "A4" });
}

