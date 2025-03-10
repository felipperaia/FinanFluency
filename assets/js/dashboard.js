// Seleção de elementos do DOM
const totalRecebimentosEl = document.getElementById('totalRecebimentos');
const totalPagamentosEl = document.getElementById('totalPagamentos');
const saldoTotalEl = document.getElementById('saldoTotal');
const transactionForm = document.getElementById('transactionForm');

// Variáveis para os gráficos
let chartRP = null;
let chartAtrasos = null;

// Função para criar/atualizar gráficos
function createCharts(data) {
    const ctxRecebimentosPagamentos = document.getElementById('chartRecebimentosPagamentos');
    const ctxAtrasos = document.getElementById('chartAtrasos');

    // Destruir gráficos existentes
    if(chartRP) chartRP.destroy();
    if(chartAtrasos) chartAtrasos.destroy();

    // Gráfico de Recebimentos vs Pagamentos
    chartRP = new Chart(ctxRecebimentosPagamentos, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Recebimentos',
                data: data.recebimentos,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderWidth: 1
            },
            {
                label: 'Pagamentos',
                data: data.pagamentos,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$' + value.toFixed(2);
                        }
                    }
                }
            }
        }
    });

    // Gráfico de Atrasos
    chartAtrasos = new Chart(ctxAtrasos, {
        type: 'doughnut',
        data: {
            labels: ['Sem Atraso', 'Atrasados'],
            datasets: [{
                data: [data.qtdSemAtraso, data.qtdAtrasados],
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.raw + ' transações';
                        }
                    }
                }
            }
        }
    });
}

// Função para atualizar os cards de estatísticas
function updateStats(data) {
    totalRecebimentosEl.textContent = `R$${data.totalRecebimentos.toFixed(2)}`;
    totalPagamentosEl.textContent = `R$${data.totalPagamentos.toFixed(2)}`;
    saldoTotalEl.textContent = `R$${data.saldo.toFixed(2)}`;
}

// Função principal para buscar dados do dashboard
async function fetchDashboardData() {
    try {
        const response = await fetch('/api/finance/summary');
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        updateStats(data);
        createCharts(data);

    } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        alert('Falha ao atualizar dashboard: ' + error.message);
    }
}

// Event listener para o formulário
transactionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        type: transactionForm.type.value,
        value: parseFloat(transactionForm.value.value),
        description: transactionForm.description.value,
        date: transactionForm.date.value
    };

    try {
        const response = await fetch('/api/finance/transaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        if (response.ok) {
            transactionForm.reset();
            await fetchDashboardData();
            alert('Transação adicionada com sucesso!');
        } else {
            alert(`Erro: ${result.error || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Erro ao enviar transação:', error);
        alert('Erro de conexão com o servidor');
    }
});

// Atualização automática a cada 30 segundos
setInterval(fetchDashboardData, 30000);

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    fetchDashboardData();
});