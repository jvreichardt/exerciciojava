

function mostrar(tela) {
    document.querySelectorAll(".tela").forEach(item => {
        item.classList.remove("ativa");
    });

    document.getElementById(tela).classList.add("ativa");
}

function moeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function escapar(texto) {
    return String(texto).replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}


let produtos = [
    { nome: "Notebook", preco: 3500, estoque: 5 },
    { nome: "Mouse", preco: 80, estoque: 10 },
    { nome: "Teclado", preco: 150, estoque: 8 },
    { nome: "Monitor", preco: 1200, estoque: 0 },
    { nome: "Headset", preco: 250, estoque: 4 }
];

function produtosDisponiveis() {
    return produtos.filter(p => p.estoque > 0);
}

function nomesProdutos() {
    return produtosDisponiveis().map(p => p.nome);
}

function valorTotalEstoque() {
    return produtos.reduce((total, p) => {
        return total + (p.preco * p.estoque);
    }, 0);
}

function produtoMaisCaro(lista) {
    return lista.reduce((maior, atual) =>
        atual.preco > maior.preco ? atual : maior
    );
}

document.getElementById("formProduto").addEventListener("submit", function(e) {
    e.preventDefault();

    const nome = document.getElementById("nomeProduto").value.trim();
    const preco = Number(document.getElementById("precoProduto").value);
    const estoque = Number(document.getElementById("estoqueProduto").value);

    if (!nome || !Number.isFinite(preco) || preco <= 0 ||
        !Number.isInteger(estoque) || estoque < 0) {
        alert("Preencha os campos corretamente!");
        return;
    }

    produtos.push({ nome, preco, estoque });

    this.reset();
    renderProdutos();
});

function renderProdutos() {
    const disponiveis = produtosDisponiveis();

    document.getElementById("listaProdutos").innerHTML = `
        <h3>Produtos cadastrados</h3>
        ${produtos.map(p => `
            <div class="item">
                <strong>${escapar(p.nome)}</strong>
                <p>Preço: ${moeda(p.preco)}</p>
                <p>Estoque: ${p.estoque}</p>
            </div>
        `).join("")}

        <h3>Produtos aprovados pelo filtro (estoque maior que zero)</h3>
        <p>${nomesProdutos().map(escapar).join(", ") || "Nenhum produto disponível"}</p>
    `;

    let caro = produtos.length ? produtoMaisCaro(produtos) : null;

    document.getElementById("resumoProdutos").innerHTML = `
        <div class="resumo">
            <h3>Resumo do estoque</h3>
            <p>Produtos disponíveis: ${disponiveis.length}</p>
            <p>Valor total em estoque: ${moeda(valorTotalEstoque())}</p>
            <p>Produto mais caro: ${caro ? escapar(caro.nome) + " - " + moeda(caro.preco) : "Nenhum"}</p>
        </div>
    `;
}


let alunos = [
    { nome: "Maria", idade: 20, curso: "Informática", notas: [8, 9, 7] },
    { nome: "João", idade: 22, curso: "Administração", notas: [5, 6, 5] },
    { nome: "Ana", idade: 19, curso: "Informática", notas: [9, 10, 9] },
    { nome: "Pedro", idade: 21, curso: "Programação", notas: [3, 4, 5] }
];

function calcularMedia(aluno) {
    if (!aluno.notas.length) return 0;

    return aluno.notas.reduce((total, nota) => total + nota, 0)
        / aluno.notas.length;
}

function situacaoAluno(aluno) {
    const media = calcularMedia(aluno);

    if (media >= 7) {
        return "Aprovado";
    } else if (media >= 5) {
        return "Recuperação";
    } else {
        return "Reprovado";
    }
}

function alunosAprovados() {
    return alunos.filter(a => situacaoAluno(a) === "Aprovado");
}
function buscarAluno(nome) {
    return alunos.find(a =>
        a.nome.toLowerCase() === nome.toLowerCase()
    );
}

function melhorAluno() {
    return alunos.length
        ? alunos.reduce((melhor, atual) =>
            calcularMedia(atual) > calcularMedia(melhor) ? atual : melhor
        )
        : null;
}

function mediaTurma() {
    if (!alunos.length) return 0;

    return alunos.reduce((total, aluno) =>
        total + calcularMedia(aluno), 0
    ) / alunos.length;
}

document.getElementById("formAluno").addEventListener("submit", function(e) {
    e.preventDefault();

    const nome = document.getElementById("nomeAluno").value.trim();
    const idade = Number(document.getElementById("idadeAluno").value);
    const curso = document.getElementById("cursoAluno").value.trim();

    const notas = document.getElementById("notasAluno").value
        .split(",")
        .map(n => n.trim())
        .map(Number);

    const notasValidas = notas.length > 0 &&
        notas.every(n => Number.isFinite(n) && n >= 0 && n <= 10);

    if (!nome || !curso || !Number.isInteger(idade) ||
        idade <= 0 || !notasValidas) {
        alert("Informe nome, curso, idade válida e notas entre 0 e 10.");
        return;
    }

    alunos.push({ nome, idade, curso, notas });

    this.reset();
    renderAlunos();
});

function renderAlunos() {
    const melhor = melhorAluno();

    document.getElementById("listaAlunos").innerHTML = `
        <h3>Lista de alunos</h3>

        ${alunos.map(a => `
            <div class="item">
                <strong>${escapar(a.nome)}</strong>
                <p>Idade: ${a.idade} anos</p>
                <p>Curso: ${escapar(a.curso)}</p>
                <p>Notas: ${a.notas.join(", ")}</p>
                <p>Média: ${calcularMedia(a).toFixed(2)}</p>
                <p>Situação: <strong>${situacaoAluno(a)}</strong></p>
            </div>
        `).join("")}
    `;

    document.getElementById("resumoAlunos").innerHTML = `
        <div class="resumo">
            <h3>Resumo da turma</h3>
            <p>Total de alunos: ${alunos.length}</p>
            <p>Alunos aprovados: ${alunosAprovados().map(a => escapar(a.nome)).join(", ") || "Nenhum"}</p>
            <p>Melhor aluno: ${melhor ? escapar(melhor.nome) : "Nenhum"}</p>
            <p>Média geral da turma: ${mediaTurma().toFixed(2)}</p>
        </div>
    `;
}


// EXPERIMENTO 3 - LOJA VIRTUAL


let estoqueLoja = [
    { nome: "Celular", categoria: "Eletrônicos", preco: 1800, estoque: 10 },
    { nome: "Fone Bluetooth", categoria: "Eletrônicos", preco: 200, estoque: 3 },
    { nome: "Camiseta", categoria: "Roupas", preco: 70, estoque: 20 },
    { nome: "Calça Jeans", categoria: "Roupas", preco: 150, estoque: 2 },
    { nome: "Mochila", categoria: "Acessórios", preco: 120, estoque: 8 }
];

function buscarCategoria(categoria) {
    return estoqueLoja.filter(p =>
        p.categoria.toLowerCase().includes(categoria.toLowerCase())
    );
}

function calcularEstoqueLoja() {
    return estoqueLoja.reduce((total, p) =>
        total + p.preco * p.estoque, 0
    );
}

function maisCaroLoja() {
    return estoqueLoja.length
        ? estoqueLoja.reduce((maior, p) =>
            p.preco > maior.preco ? p : maior
        )
        : null;
}

function comprarProduto(indice) {
    const produto = estoqueLoja.find((p, i) => i === indice);

    if (!produto || produto.estoque <= 0) {
        alert("Produto sem estoque!");
        return;
    }

    produto.estoque--;

    alert("Compra realizada com sucesso!");

    renderLoja();
}

document.getElementById("formLoja").addEventListener("submit", function(e) {
    e.preventDefault();

    const nome = document.getElementById("nomeLoja").value.trim();
    const categoria = document.getElementById("categoriaLoja").value.trim();
    const preco = Number(document.getElementById("precoLoja").value);
    const estoque = Number(document.getElementById("estoqueLoja").value);

    if (!nome || !categoria || !Number.isFinite(preco) ||
        preco <= 0 || !Number.isInteger(estoque) || estoque < 0) {
        alert("Preencha os dados corretamente!");
        return;
    }

    estoqueLoja.push({ nome, categoria, preco, estoque });

    this.reset();
    renderLoja();
});

function renderLoja() {
    const categoria = document.getElementById("filtroCategoria").value.trim();

    const lista = categoria
        ? buscarCategoria(categoria)
        : estoqueLoja;

    const caro = maisCaroLoja();

    document.getElementById("listaLoja").innerHTML = `
        <h3>Produtos da loja</h3>

        ${lista.map(p => {
            const indice = estoqueLoja.indexOf(p);

            return `
                <div class="item">
                    <strong>${escapar(p.nome)}</strong>
                    <p>Categoria: ${escapar(p.categoria)}</p>
                    <p>Preço: ${moeda(p.preco)}</p>
                    <p>Estoque: ${p.estoque}</p>
                    <button onclick="comprarProduto(${indice})"
                        ${p.estoque <= 0 ? "disabled" : ""}>
                        Comprar
                    </button>
                </div>
            `;
        }).join("") || "<p>Nenhum produto encontrado.</p>"}
    `;

    const poucoEstoque = estoqueLoja.filter(p =>
        p.estoque > 0 && p.estoque <= 3
    );

    document.getElementById("resumoLoja").innerHTML = `
        <div class="resumo">
            <h3>Resumo da loja</h3>
            <p>Total de produtos: ${estoqueLoja.length}</p>
            <p>Valor total do estoque: ${moeda(calcularEstoqueLoja())}</p>
            <p>Produto mais caro: ${caro ? escapar(caro.nome) + " - " + moeda(caro.preco) : "Nenhum"}</p>
            <p>Pouco estoque: ${poucoEstoque.map(p => escapar(p.nome)).join(", ") || "Nenhum"}</p>
        </div>
    `;
}

// EXPERIMENTO 4 - BANCO DIGITAL

const conta = {
    titular: "Maria Silva",
    saldo: 1000,
    movimentacoes: []
};

function depositar() {
    const valor = Number(document.getElementById("valorBanco").value);

    if (!Number.isFinite(valor) || valor <= 0) {
        alert("Informe um valor válido para depósito!");
        return;
    }

    conta.saldo += valor;

    conta.movimentacoes.push({
        tipo: "Depósito",
        valor: valor,
        data: new Date().toLocaleString("pt-BR")
    });

    document.getElementById("valorBanco").value = "";

    renderBanco();
}

function sacar() {
    const valor = Number(document.getElementById("valorBanco").value);

    if (!Number.isFinite(valor) || valor <= 0) {
        alert("Informe um valor válido para saque!");
        return;
    }

    if (valor > conta.saldo) {
        alert("Saldo insuficiente!");
        return;
    }

    conta.saldo -= valor;

    conta.movimentacoes.push({
        tipo: "Saque",
        valor: valor,
        data: new Date().toLocaleString("pt-BR")
    });

    document.getElementById("valorBanco").value = "";

    renderBanco();
}

function totalDepositos() {
    return conta.movimentacoes
        .filter(m => m.tipo === "Depósito")
        .reduce((total, m) => total + m.valor, 0);
}

function totalSaques() {
    return conta.movimentacoes
        .filter(m => m.tipo === "Saque")
        .reduce((total, m) => total + m.valor, 0);
}

function maiorMovimentacao() {
    return conta.movimentacoes.length
        ? conta.movimentacoes.reduce((maior, atual) =>
            atual.valor > maior.valor ? atual : maior
        )
        : null;
}

function renderBanco() {
    const maior = maiorMovimentacao();

    document.getElementById("saldoAtual").textContent =
        moeda(conta.saldo);

    document.getElementById("extrato").innerHTML = `
        <h3>Extrato de movimentações</h3>

        ${conta.movimentacoes.map(m => `
            <div class="item">
                <strong>${m.tipo}</strong>
                <p>Valor: ${moeda(m.valor)}</p>
                <p>Data: ${escapar(m.data)}</p>
            </div>
        `).join("") || "<p>Nenhuma movimentação realizada.</p>"}
    `;

    document.getElementById("resumoBanco").innerHTML = `
        <div class="resumo">
            <h3>Resumo bancário</h3>
            <p>Titular: ${escapar(conta.titular)}</p>
            <p>Total de depósitos: ${moeda(totalDepositos())}</p>
            <p>Total de saques: ${moeda(totalSaques())}</p>
            <p>Maior movimentação: ${
                maior ? maior.tipo + " - " + moeda(maior.valor) : "Nenhuma"
            }</p>
        </div>
    `;
}






renderProdutos();
renderAlunos();
renderLoja();
renderBanco();
