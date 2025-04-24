// Elementos
const totalRecebimentosEl = document.getElementById('totalRecebimentos');
const totalPagamentosEl = document.getElementById('totalPagamentos');
const saldoTotalEl = document.getElementById('saldoTotal');
const transactionForm = document.getElementById('transactionForm');
let chartRP, chartAtrasos;

// Navbar toggle
function initNavbar() {
  const toggler = document.querySelector('.navbar-toggler');
  const links = document.querySelector('.navbar-links');
  toggler.addEventListener('click', () => {
    const exp = toggler.getAttribute('aria-expanded') === 'true';
    toggler.setAttribute('aria-expanded', !exp);
    links.classList.toggle('open');
  });
}

// Gráficos
function createCharts(data) {
  const ctx1 = document.getElementById('chartRecebimentosPagamentos');
  const ctx2 = document.getElementById('chartAtrasos');
  if (chartRP) chartRP.destroy(); if (chartAtrasos) chartAtrasos.destroy();
  chartRP = new Chart(ctx1, { type: 'bar', data: { labels: data.labels, datasets: [{ label: 'Recebimentos', data: data.recebimentos, borderWidth: 1 }, { label: 'Pagamentos', data: data.pagamentos, borderWidth: 1 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { callback: v => `R$${v.toFixed(2)}` } } } } });
  chartAtrasos = new Chart(ctx2, { type: 'doughnut', data: { labels: ['Sem Atraso', 'Atrasados'], datasets: [{ data: [data.qtdSemAtraso, data.qtdAtrasados], hoverOffset: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.raw} transações` } } } } });
}

// Stats
function updateStats(data) { totalRecebimentosEl.textContent = `R$${data.totalRecebimentos.toFixed(2)}`; totalPagamentosEl.textContent = `R$${data.totalPagamentos.toFixed(2)}`; saldoTotalEl.textContent = `R$${data.saldo.toFixed(2)}`; }

// Fetch
async function fetchDashboardData() {
  try {
    const token = localStorage.getItem('token'); if (!token) throw new Error('Token não encontrado.');
    const res = await fetch('/api/finance/summary', { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
    if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
    const data = await res.json(); updateStats(data); createCharts(data);
  } catch (err) { console.error(err); alert('Falha ao atualizar dashboard: ' + err.message); }
}

// Form
transactionForm.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = { type: transactionForm.type.value, value: parseFloat(transactionForm.value.value), description: transactionForm.description.value, date: transactionForm.date.value };
  try {
    const token = localStorage.getItem('token'); if (!token) throw new Error('Token não encontrado.');
    const res = await fetch('/api/finance/transaction', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(formData) });
    const result = await res.json(); if (res.ok) { transactionForm.reset(); await fetchDashboardData(); alert('Transação adicionada!'); } else alert(`Erro: ${result.error || 'Desconhecido'}`);
  } catch (err) { console.error(err); alert('Erro de conexão: ' + err.message); }
});

// Auto refresh e init
document.addEventListener('DOMContentLoaded', () => { initNavbar();});