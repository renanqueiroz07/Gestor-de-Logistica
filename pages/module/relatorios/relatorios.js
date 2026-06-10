import { subscribe, initReports, setFilters, exportFiltered } from './hooks/useReports.js';
import { reportsTableTemplate } from './components/ReportsTable.js';
import { summaryCard } from './components/SummaryCard.js';
import { exportCsv } from './utils/exportCsv.js';

const metricsEl = document.getElementById('reportsMetrics');
const reportsTables = document.getElementById('reportsTables');
const btnExport = document.getElementById('btnExport');
const filterQuery = document.getElementById('filterQuery');
const filterStatus = document.getElementById('filterStatus');
const filterFrom = document.getElementById('filterFrom');
const filterTo = document.getElementById('filterTo');

function renderMetrics(summary){
  metricsEl.innerHTML = `
    ${summaryCard('Total de pedidos', summary.totalOrders)}
    ${summaryCard('Pedidos concluídos', summary.completed)}
    ${summaryCard('Pedidos pendentes', summary.pending)}
    ${summaryCard('Pedidos cancelados', summary.canceled)}
    ${summaryCard('Entregadores ativos', summary.activeDeliverers)}
    ${summaryCard('Faturamento mensal', 'R$ '+(summary.monthRevenue||0).toLocaleString())}
  `;
}

function renderTables(data){
  reportsTables.innerHTML = reportsTableTemplate(data.orders);
}

filterQuery && filterQuery.addEventListener('input', () => applyFilters());
filterStatus && filterStatus.addEventListener('change', () => applyFilters());
filterFrom && filterFrom.addEventListener('change', () => applyFilters());
filterTo && filterTo.addEventListener('change', () => applyFilters());

function applyFilters(){
  const f = { q: filterQuery.value, status: filterStatus.value, from: filterFrom.value, to: filterTo.value };
  setFilters(f);
}

btnExport && btnExport.addEventListener('click', async ()=>{
  const data = await exportFiltered();
  exportCsv(data.orders, `relatorios_pedidos_${new Date().toISOString().slice(0,10)}.csv`);
});

document.addEventListener('DOMContentLoaded', ()=>{
  initReports();
  subscribe(state=>{
    renderMetrics(state.summary);
    renderTables(state);
  });
});
