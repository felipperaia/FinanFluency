const transactionsTableBody = document.querySelector('#transactionsTable tbody');

async function fetchTransactions() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.');
    }

    const response = await fetch('/api/finance/transactions', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // Envia o token para filtrar os dados do usuário ativo
      }
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    transactionsTableBody.innerHTML = '';

    data.forEach((transaction) => {
      const row = document.createElement('tr');

      const tdType = document.createElement('td');
      tdType.textContent = transaction.type;
      row.appendChild(tdType);

      const tdValue = document.createElement('td');
      tdValue.textContent = `R$${transaction.value.toFixed(2)}`;
      row.appendChild(tdValue);

      const tdDescription = document.createElement('td');
      tdDescription.textContent = transaction.description;
      row.appendChild(tdDescription);

      const tdDate = document.createElement('td');
      tdDate.textContent = new Date(transaction.date).toLocaleDateString('pt-BR');
      row.appendChild(tdDate);

      const tdActions = document.createElement('td');
      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('actions-btn');
      deleteBtn.textContent = 'Excluir';
      deleteBtn.addEventListener('click', () => deleteTransaction(transaction._id));

      tdActions.appendChild(deleteBtn);
      row.appendChild(tdActions);

      transactionsTableBody.appendChild(row);
    });

  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    alert('Falha ao buscar transações: ' + error.message);
  }
}

async function deleteTransaction(id) {
  if (!confirm('Deseja realmente excluir esta transação?')) return;

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.');
    }
    
    const response = await fetch(`/api/finance/transaction/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // Envia o token para autenticação na exclusão
      }
    });

    if (response.ok) {
      alert('Transação excluída com sucesso!');
      fetchTransactions();
    } else {
      const result = await response.json();
      alert(`Erro ao excluir transação: ${result.error || 'Erro desconhecido'}`);
    }
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
    alert('Erro ao excluir transação: ' + error.message);
  }
}

fetchTransactions();
