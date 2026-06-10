import * as service from '../services/reportService.js';

let state = { orders: [], summary: {}, filters: { q:'', status:'all', from:null, to:null } };
const listeners = [];

export function subscribe(cb){ listeners.push(cb); cb(state); }

export async function initReports(){
  state.orders = await service.fetchOrders();
  state.summary = service.getSummary(state.orders);
  notify();
}

function notify(){ listeners.forEach(l=>l(state)); }

export function setFilters(f){ state.filters = {...state.filters, ...f}; applyFilters(); }

export async function exportFiltered(){ const filtered = applyFilters(); return { orders: filtered }; }

function applyFilters(){
  const { q, status, from, to } = state.filters;
  let list = state.orders.slice();
  if(q) list = list.filter(o=> (o.number+ ' '+ o.client + ' ' + (o.deliverer||'')).toLowerCase().includes(q.toLowerCase()));
  if(status && status!=='all') list = list.filter(o=>o.status===status);
  if(from) list = list.filter(o=> new Date(o.date) >= new Date(from));
  if(to) list = list.filter(o=> new Date(o.date) <= new Date(to));
  state.filtered = list;
  state.summary = service.getSummary(list);
  notify();
  return list;
}
