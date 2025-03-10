const transactionsTableBody = document.querySelector('#transactionsTable tbody');

async function fetchTransactions() {
  try {
    const response = await fetch('/api/finance/transactions');
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
  }
}

async function deleteTransaction(id) {
  if (!confirm('Deseja realmente excluir esta transação?')) return;

  try {
    const response = await fetch(`/api/finance/transaction/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('Transação excluída com sucesso!');
      fetchTransactions();
    } else {
      alert('Erro ao excluir transação');
    }
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
  }
}

fetchTransactions();
