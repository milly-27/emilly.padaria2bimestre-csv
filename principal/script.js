let produtos = {
  doces: [],
  salgados: [],
  bebidas: []
};

function loadProducts() {
  fetch('http://localhost:3000/products.csv') // ok, se for seu arquivo CSV
    .then(response => response.text())
    .then(csvData => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          const lista = results.data;

          // Limpa estrutura antiga
          produtos = { doces: [], salgados: [], bebidas: [] };

          lista.forEach(produto => {
            const categoria = produto.categoria.toLowerCase(); // precisa ser 'doces', 'salgados' ou 'bebidas'
            if (produtos[categoria]) {
              produtos[categoria].push({
                nome: produto.nome,
                preco: parseFloat(produto.preco),
                imagem: produto.imagem
              });
            }
          });

          // Por padrão, mostra categoria 'doces'
          mostrarCategoria('doces');
        }
      });
    })
    .catch(error => console.error('Erro ao carregar produtos:', error));
}

// Função para adicionar novo produto (admin)
function abrirAdicionarProduto() {
  const nome = prompt("Nome do produto:");
  const preco = prompt("Preço:");
  const imagem = prompt("URL da imagem:");
  if (nome && preco && imagem) {
    // Usar variável global produtos para consistência:
    // Se quiser salvar no localStorage, crie outra estrutura para isso
    produtos.doces.push({ nome, preco: parseFloat(preco), imagem }); // ou categoria fixa? ajustar se quiser

    // Também atualizar localStorage para persistir? Exemplo:
    localStorage.setItem("produtos", JSON.stringify(produtos));
    alert("Produto adicionado!");
  }
}

let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function mostrarCategoria(categoria) {
  const container = document.getElementById('produtos');
  container.innerHTML = '';

  produtos[categoria].forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}">
      <h4>${item.nome}</h4>
      <p>R$ ${item.preco.toFixed(2)}</p>
      <button onclick="adicionarAoCarrinho('${categoria}', ${index})">Adicionar</button>
    `;
    container.appendChild(card);
  });
}

function adicionarAoCarrinho(categoria, index) {
  const produto = produtos[categoria][index];
  const existente = carrinho.find(item => item.nome === produto.nome);

  if (existente) {
    existente.quantidade += 1;
  } else {
    carrinho.push({ ...produto, quantidade: 1 });
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const corpoCarrinho = document.getElementById('corpo-carrinho');
  const totalEl = document.getElementById('total');
  corpoCarrinho.innerHTML = '';
  let total = 0;

  carrinho.forEach((item, index) => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.nome}</td>
      <td>
        <input type="number" min="1" value="${item.quantidade}" onchange="atualizarQuantidadeDireta(${index}, this.value)">
      </td>
      <td>R$ ${item.preco.toFixed(2)}</td>
      <td>R$ ${subtotal.toFixed(2)}</td>
      <td>
        <button onclick="alterarQuantidade(${index}, -1)">-</button>
        <button onclick="alterarQuantidade(${index}, 1)">+</button>
      </td>
    `;
    corpoCarrinho.appendChild(tr);
  });

  totalEl.textContent = `Total: R$ ${total.toFixed(2)}`;
}

function alterarQuantidade(index, delta) {
  carrinho[index].quantidade += delta;
  if (carrinho[index].quantidade <= 0) {
    carrinho.splice(index, 1);
  }
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarCarrinho();
}

function atualizarQuantidadeDireta(index, valor) {
  const novaQuantidade = parseInt(valor);
  if (isNaN(novaQuantidade) || novaQuantidade < 1) {
    carrinho[index].quantidade = 1;
  } else {
    carrinho[index].quantidade = novaQuantidade;
  }
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarCarrinho();
}

function irParaCupom() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  window.location.href = '../cupom/cupom.html';
}

// CORREÇÃO: UNIFICAR window.onload para evitar sobrescrita
window.onload = () => {
  // Mostrar painel do admin se logado como adm
  const usuario = localStorage.getItem("usuarioLogado");
  if (usuario === "adm") {
    const painel = document.getElementById("painel-adm");
    if (painel) painel.style.display = "block";
  }

  // Mostrar nome do usuário no header
  const usuarioLogado = localStorage.getItem('usuario');
  if (usuarioLogado) {
    let userDisplay = document.getElementById('userLogged');
    if (!userDisplay) {
      userDisplay = document.createElement('div');
      userDisplay.id = 'userLogged';
      userDisplay.style.marginLeft = 'auto';
      userDisplay.style.color = '#333';
      const header = document.querySelector('header');
      if (header) {
        header.appendChild(userDisplay);
      }
    }
    userDisplay.textContent = `Olá, ${usuarioLogado}`;
  }

  atualizarCarrinho();
  loadProducts(); // manter chamada para carregar produtos
};
