import { initClients, subscribe, searchClients, setStatusFilter, setPage, selectClient, saveClient, removeClient, addOrder, updateOrder, deleteOrder } from './hooks/useClients.js';
import { clientCardTemplate } from './components/ClientCard.js';
import { clientDetailsTemplate } from './components/ClientDetails.js';

const listEl = document.getElementById('clientList');
const paginationEl = document.getElementById('pagination');
const metricsEl = document.getElementById('clientsMetrics');
const clientsBadge = document.getElementById('clientsBadge');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const btnNew = document.getElementById('btnNewClient');
const detailsEl = document.getElementById('clientDetails');
const ordersEl = document.getElementById('clientOrders');

function renderList(state){
  const start = (state.page-1)*state.pageSize;
  const pageItems = state.filtered.slice(start, start+state.pageSize);
  listEl.innerHTML = pageItems.map(c=>clientCardTemplate(c, state.selectedId===c.id)).join('');
  bindList();
}

function bindList(){
  document.querySelectorAll('.client-card').forEach(el=> el.onclick = ()=> selectClient(el.dataset.id));
}

function renderPagination(state){
  const total = Math.max(1, Math.ceil(state.filtered.length/state.pageSize));
  paginationEl.innerHTML = '';
  for(let p=1;p<=total;p++){ const btn=document.createElement('button'); btn.className = `page-btn${p===state.page?' active':''}`; btn.textContent=p; btn.onclick=()=> setPage(p); paginationEl.appendChild(btn);} 
}

function renderMetrics(summary){
  metricsEl.innerHTML = `
    <div class="metric-card"><div class="metric-label">Total de clientes</div><div class="metric-value">${summary.total}</div></div>
    <div class="metric-card"><div class="metric-label">Clientes ativos</div><div class="metric-value">${summary.active}</div></div>
    <div class="metric-card"><div class="metric-label">Total de pedidos</div><div class="metric-value">${summary.orders}</div></div>
    <div class="metric-card"><div class="metric-label">Pedidos concluídos</div><div class="metric-value">${summary.completed}</div></div>
  `;
}

function renderDetails(client){
  detailsEl.innerHTML = client ? clientDetailsTemplate(client) : '<div style="color:var(--muted)">Selecione um cliente para ver detalhes</div>';
}

btnNew && (btnNew.onclick = ()=> { selectClient(null); detailsEl.innerHTML = '<div style="color:var(--muted)">Preencha o formulário ao lado para criar cliente.</div>'; });

if (searchInput) searchInput.addEventListener('input', e => searchClients(e.target.value));
if (statusFilter) statusFilter.addEventListener('change', e => setStatusFilter(e.target.value));

document.addEventListener('DOMContentLoaded', ()=>{
  initClients();
  subscribe(state=>{
    renderMetrics(state.summary);
    renderList(state);
    renderPagination(state);
    renderDetails(state.selected);
    if(clientsBadge) clientsBadge.textContent = state.summary.total;
  });
});

export { addOrder, updateOrder, deleteOrder, saveClient, removeClient };
