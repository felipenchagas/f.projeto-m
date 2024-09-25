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
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na requisição. Status: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        if (data.sucesso) {
            authToken = data.token; // Salva o token recebido
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
            'Authorization': authToken // Inclui o token no cabeçalho
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao carregar contatos. Status: ' + response.status);
        }
        return response.json();
    })
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

// Função para adicionar contato
document.getElementById('add-contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;
    const descricao = document.getElementById('descricao').value;

    fetch('https://empresarialweb.com.br/backend/projetom/api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken // Inclui o token no cabeçalho
        },
        body: JSON.stringify({ nome, email, telefone, cidade, estado, descricao })
    })
    .then(response => response.json())
    .then(data => {
        if (data.sucesso) {
            alert(data.mensagem);
            document.getElementById('add-contact-form').reset();
            carregarContatos();
            fecharModal('add-contact-modal');
        } else {
            alert(data.mensagem);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao adicionar contato.');
    });
});

// Função para deletar contato
function deletarContato(id) {
    if (confirm('Tem certeza que deseja deletar este contato?')) {
        fetch('https://empresarialweb.com.br/backend/projetom/api.php', {
            method: 'DELETE',
            headers: {
                'Authorization': authToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `id=${id}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.sucesso) {
                alert(data.mensagem);
                carregarContatos();
            } else {
                alert(data.mensagem);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao deletar contato.');
        });
    }
}

// Função para editar contato
function editarContato(id) {
    fetch(`https://empresarialweb.com.br/backend/projetom/api.php?id=${id}`, {
        method: 'GET',
        headers: {
            'Authorization': authToken // Inclui o token no cabeçalho
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.sucesso && data.dados.length > 0) {
            const contato = data.dados[0];
            document.getElementById('edit-id').value = contato.id;
            document.getElementById('edit-nome').value = contato.nome;
            document.getElementById('edit-email').value = contato.email;
            document.getElementById('edit-telefone').value = contato.telefone;
            document.getElementById('edit-cidade').value = contato.cidade;
            document.getElementById('edit-estado').value = contato.estado;
            document.getElementById('edit-descricao').value = contato.descricao;
            abrirModal('edit-contact-modal');
        } else {
            alert('Contato não encontrado.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao buscar contato.');
    });
}

// Função para salvar edição de contato
document.getElementById('edit-contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const nome = document.getElementById('edit-nome').value;
    const email = document.getElementById('edit-email').value;
    const telefone = document.getElementById('edit-telefone').value;
    const cidade = document.getElementById('edit-cidade').value;
    const estado = document.getElementById('edit-estado').value;
    const descricao = document.getElementById('edit-descricao').value;

    fetch('https://empresarialweb.com.br/backend/projetom/api.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken // Inclui o token no cabeçalho
        },
        body: JSON.stringify({ id, nome, email, telefone, cidade, estado, descricao })
    })
    .then(response => response.json())
    .then(data => {
        if (data.sucesso) {
            alert(data.mensagem);
            document.getElementById('edit-contact-form').reset();
            carregarContatos();
            fecharModal('edit-contact-modal');
        } else {
            alert(data.mensagem);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao editar contato.');
    });
});

// Funções para abrir e fechar modais
function abrirModal(id) {
    document.getElementById(id).style.display = 'block';
}

function fecharModal(id) {
    document.getElementById(id).style.display = 'none';
}

// Fechar modais ao clicar no 'x'
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        fecharModal(btn.parentElement.parentElement.id);
    });
});

// Função para ordenar a tabela
let sortOrder = {};
function sortTable(n) {
    let table = document.getElementById("contactsTable");
    let rows = Array.from(table.rows).slice(1);
    let isAscending = !sortOrder[n];

    rows.sort((row1, row2) => {
        let cell1 = row1.cells[n].innerText.toLowerCase();
        let cell2 = row2.cells[n].innerText.toLowerCase();

        if (n === 6) { // Se for a coluna de Data
            let partes1 = cell1.split('/');
            let partes2 = cell2.split('/');
            cell1 = new Date(partes1[2], partes1[1] - 1, partes1[0]).getTime();
            cell2 = new Date(partes2[2], partes2[1] - 1, partes2[0]).getTime();
        }

        if (cell1 < cell2) return isAscending ? -1 : 1;
        if (cell1 > cell2) return isAscending ? 1 : -1;
        return 0;
    });

    rows.forEach(row => table.appendChild(row));
    sortOrder[n] = isAscending;
}

// Função para pesquisar na tabela
function searchTable() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let rows = document.querySelectorAll("table tbody tr");

    rows.forEach(row => {
        let rowText = row.innerText.toLowerCase();
        row.style.display = rowText.includes(input) ? "" : "none";
    });
}
