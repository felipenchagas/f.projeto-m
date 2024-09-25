// admin/scripts/admin_scripts2.js

let authToken = null;

// Função de login
document.getElementById('login-btn').addEventListener('click', () => {
    const usuario = prompt("Digite o usuário:");
    const senha = prompt("Digite a senha:");

    if (!usuario || !senha) {
        alert('Usuário e senha são obrigatórios.');
        return;
    }

    fetch('https://empresarialweb.com.br/backend/projetom/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario, senha })
    })
    .then(response => response.json())
    .then(data => {
        if (data.sucesso) {
            authToken = data.token.split(' ')[1]; // Salva apenas o valor do token (sem "Bearer ")
            document.getElementById('admin-section').style.display = 'block';
            document.getElementById('login-btn').style.display = 'none';
            document.getElementById('logout-btn').style.display = 'inline-block';
            carregarContatos(); // Função para carregar os contatos usando o token
        } else {
            alert(data.mensagem);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao tentar logar.');
    });
});

// Função de logout
document.getElementById('logout-btn').addEventListener('click', () => {
    authToken = null; // Limpa o token localmente
    document.getElementById('admin-section').style.display = 'none';
    document.getElementById('login-btn').style.display = 'inline-block';
    document.getElementById('logout-btn').style.display = 'none';
    document.getElementById('contactsBody').innerHTML = ''; // Limpa a lista de contatos
});

// Função para carregar contatos
function carregarContatos() {
    fetch('https://empresarialweb.com.br/backend/projetom/api.php', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}` // Inclui o token no cabeçalho
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.sucesso) {
            const contatos = data.dados;
            const tbody = document.getElementById('contactsBody');
            tbody.innerHTML = '';
            contatos.forEach(contato => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${contato.nome}</td>
                    <td>${contato.email}</td>
                    <td>${contato.telefone}</td>
                    <td>${contato.cidade}</td>
                    <td>${contato.estado}</td>
                    <td>${contato.descricao}</td>
                    <td>${new Date(contato.data_envio).toLocaleString('pt-BR')}</td>
                    <td>
                        <button class="edit-btn" onclick="editarContato(${contato.id})"><i class="fas fa-edit"></i> Editar</button>
                        <button class="delete-btn" onclick="deletarContato(${contato.id})"><i class="fas fa-trash-alt"></i> Deletar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            alert('Autenticação inválida.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao carregar contatos.');
    });
}
