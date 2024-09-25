// scripts/admin_scripts2.js

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
            // Armazenar o token no localStorage
            localStorage.setItem('authToken', data.token);
            document.getElementById('admin-section').style.display = 'block';
            document.getElementById('login-btn').style.display = 'none';
            document.getElementById('logout-btn').style.display = 'inline-block';
            carregarContatos();
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
    fetch('https://empresarialweb.com.br/backend/projetom/logout.php', {
        method: 'POST',
        headers: {
            'Authorization': localStorage.getItem('authToken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.sucesso) {
            localStorage.removeItem('authToken');
            document.getElementById('admin-section').style.display = 'none';
            document.getElementById('login-btn').style.display = 'inline-block';
            document.getElementById('logout-btn').style.display = 'none';
            document.getElementById('contactsBody').innerHTML = '';
        } else {
            alert(data.mensagem);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao tentar logout.');
    });
});

// Carregar contatos
function carregarContatos() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Autenticação inválida. Faça login novamente.');
        window.location.href = '/admin/contatos.html';
        return;
    }

    fetch('https://empresarialweb.com.br/backend/projetom/api.php', {
        method: 'GET',
        headers: {
            'Authorization': token
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
            alert(data.mensagem);
            if (data.mensagem === 'Autenticação inválida.') {
                window.location.href = '/admin/contatos.html';
            }
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao carregar contatos.');
    });
}

// Adicionar contato
document.getElementById('add-contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;
    const descricao = document.getElementById('descricao').value;

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Autenticação inválida. Faça login novamente.');
        return;
    }

    fetch('https://empresarialweb.com.br/backend/projetom/api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
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

// Deletar contato
function deletarContato(id) {
    if (confirm('Tem certeza que deseja deletar este contato?')) {
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Autenticação inválida. Faça login novamente.');
            return;
        }

        fetch('https://empresarialweb.com.br/backend/projetom/api.php', {
            method: 'DELETE',
            headers: {
                'Authorization': token,
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

// Editar contato
function editarContato(id) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Autenticação inválida. Faça login novamente.');
        return;
    }

    fetch(`https://empresarialweb.com.br/backend/projetom/api.php?id=${id}`, {
        method: 'GET',
        headers: {
            'Authorization': token
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

// Salvar edição de contato
document.getElementById('edit-contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const nome = document.getElementById('edit-nome').value;
    const email = document.getElementById('edit-email').value;
    const telefone = document.getElementById('edit-telefone').value;
    const cidade = document.getElementById('edit-cidade').value;
    const estado = document.getElementById('edit-estado').value;
    const descricao = document.getElementById('edit-descricao').value;

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Autenticação inválida. Faça login novamente.');
        return;
    }

    fetch('https://empresarialweb.com.br/backend/projetom/api.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
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

// Ordenar tabela
let sortOrder = {};
function sortTable(n) {
    let table = document.getElementById("contactsTable");
    let rows = Array.from(table.rows).slice(1);
    let isAscending = !sortOrder[n];

    rows.sort((row1, row2) => {
        let cell1 = row1.cells[n].innerText.toLowerCase();
        let cell2 = row2.cells[n].innerText.toLowerCase();

        // Verificação se a coluna é Data
        if (n === 6) {
            // Converter para timestamp para comparação
            let partes1 = cell1.split('/');
            let partes2 = cell2.split('/');
            cell1 = new Date(partes1[2], partes1[1]-1, partes1[0], partes1[3].split(':')[0], partes1[3].split(':')[1]).getTime();
            cell2 = new Date(partes2[2], partes2[1]-1, partes2[0], partes2[3].split(':')[0], partes2[3].split(':')[1]).getTime();
        }

        if (cell1 < cell2) return isAscending ? -1 : 1;
        if (cell1 > cell2) return isAscending ? 1 : -1;
        return 0;
    });

    rows.forEach(row => table.appendChild(row));
    sortOrder[n] = isAscending;
}

// Pesquisar na tabela
function searchTable() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let rows = document.querySelectorAll("table tbody tr");

    rows.forEach(row => {
        let rowText = row.innerText.toLowerCase();
        row.style.display = rowText.includes(input) ? "" : "none";
    });
}

// Verificar autenticação no carregamento da página
window.onload = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
        document.getElementById('admin-section').style.display = 'block';
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'inline-block';
        carregarContatos();
    }
};
