function loadUsers() {
  fetch('http://localhost:3000/users.csv')
      .then(response => response.text())
      .then(csvText => {
          const users = parseCSV(csvText);
          usersTable.innerHTML = '';
          users.forEach(user => {
              addUserToTable(user);
          });
      })
      .catch(error => console.error('Erro ao carregar usuários:', error));
}

function mostrarSenha(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}

function logar() {
  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const email = document.getElementById("email").value.trim();
  const msg = document.getElementById("mensagem");

  if (usuario === "adm" && senha === "adm0000" && email === "adm.padaria@gmail.com") {
    msg.style.color = "green";
    msg.textContent = "Login de administrador bem-sucedido! Redirecionando...";
    setTimeout(() => {
      window.location.href = "../admin/admin.html"; // Página do painel admin
    }, 1000);
    return;
  }

  // Código para login normal (usuarios comuns)
  const dados = JSON.parse(localStorage.getItem("usuarios")) || [];
  const user = dados.find(u => u.usuario === usuario && u.email === email);

  if (!user) {
    msg.style.color = "red";
    msg.textContent = "Usuário não cadastrado. Cadastre-se.";
    return;
  }

  if (user.senha !== senha) {
    msg.style.color = "red";
    msg.textContent = "Senha incorreta.";
    return;
  }

  msg.style.color = "green";
  msg.textContent = "Login bem-sucedido! Redirecionando...";

  setTimeout(() => {
    window.location.href = "../principal/index.html"; // Página principal comum
  }, 1000);
}


// Aguarda o DOM estar carregado para adicionar os eventos
document.addEventListener('DOMContentLoaded', () => {
  const btnCadastro = document.getElementById('btnCadastro');
  if (btnCadastro) {
    btnCadastro.addEventListener('click', () => {
      window.location.href = '../cadastro/cadastro.html';
    });
  }

  const btnRecuperar = document.getElementById('btnRecuperar');
  if (btnRecuperar) {
    btnRecuperar.addEventListener('click', (e) => {
      e.preventDefault(); // evita o href '#'
      window.location.href = '../recuperar/recuperar.html';
    });
  }
});
