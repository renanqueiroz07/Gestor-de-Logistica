import * as service from '../services/clientService.js';

let state = { clients: [], filtered: [], page:1, pageSize:10, selectedId: null, summary: {total:0,active:0,orders:0,completed:0} };
const listeners = [];

function cloneClient(client) {
  return client ? JSON.parse(JSON.stringify(client)) : null;
}

function getSelectedClient() {
  return state.clients.find(client => client.id === state.selectedId) || null;
}

function snapshot() {
  const selected = getSelectedClient();
  return {
    ...state,
    clients: state.clients.map(cloneClient),
    filtered: state.filtered.map(cloneClient),
    selected: cloneClient(selected)
  };
}

function emit(){
  const next = snapshot();
  listeners.forEach(listener => listener(next));
}

export async function initClients(){
  state.clients = await service.fetchClients();
  applyFilters();
}

function applyFilters(){
  state.filtered = state.clients.slice();
  if (state.selectedId && !state.clients.some(client => client.id === state.selectedId)) {
    state.selectedId = null;
  }
  state.summary = service.getSummary(state.clients);
  emit();
}

export function subscribe(cb){
  listeners.push(cb);
  cb(snapshot());
  return () => {
    const index = listeners.indexOf(cb);
    if (index >= 0) listeners.splice(index, 1);
  };
}
export function searchClients(q){ state.filtered = state.clients.filter(c=> !q || (c.name+ ' '+(c.email||'')+' '+(c.phone||'')).toLowerCase().includes(q.toLowerCase())); emit(); }
export function setStatusFilter(status){ if(status==='all'){ applyFilters(); return;} state.filtered = state.clients.filter(c=>c.status===status); emit(); }
export function setPage(p){ state.page = p; emit(); }
export function selectClient(id){ state.selectedId = id; emit(); }

export async function saveClient(payload){ if(payload.id){ await service.updateClient(payload); } else { await service.addClient(payload); } state.clients = await service.fetchClients(); applyFilters(); }
export async function removeClient(id){ await service.deleteClient(id); state.clients = await service.fetchClients(); applyFilters(); }

export async function addOrder(clientId, order){ await service.addOrder(clientId, order); state.clients = await service.fetchClients(); applyFilters(); }
export async function updateOrder(clientId, order){ await service.updateOrder(clientId, order); state.clients = await service.fetchClients(); applyFilters(); }
export async function deleteOrder(clientId, orderId){ await service.deleteOrder(clientId, orderId); state.clients = await service.fetchClients(); applyFilters(); }
