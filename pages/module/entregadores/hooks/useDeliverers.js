import * as service from '../services/delivererService.js';

const state = {
  deliverers: [],
  filtered: [],
  selectedId: null,
  filters: {
    search: '',
    status: 'all',
    availability: 'all'
  },
  page: 1,
  pageSize: 6,
  summary: {
    total: 0,
    active: 0,
    onRoute: 0,
    offline: 0,
    deliveredToday: 0
  }
};

const listeners = new Set();

function applyFilters() {
  state.filtered = state.deliverers.filter(deliverer => {
    const text = `${deliverer.name} ${deliverer.city} ${deliverer.status} ${deliverer.availability}`.toLowerCase();
    const matchSearch = !state.filters.search || text.includes(state.filters.search.toLowerCase());
    const matchStatus = state.filters.status === 'all' || deliverer.status === state.filters.status;
    const matchAvailability = state.filters.availability === 'all' || deliverer.availability === state.filters.availability;
    return matchSearch && matchStatus && matchAvailability;
  });
}

function refreshState() {
  state.deliverers = service.fetchDeliverers();
  applyFilters();
  state.summary = service.getDelivererSummary();
  if (!state.deliverers.find(d => d.id === state.selectedId)) {
    state.selectedId = state.deliverers.length ? state.deliverers[0].id : null;
  }
}

function notify() {
  listeners.forEach(listener => listener({ ...state, selected: service.getDelivererById(state.selectedId) }));
}

export function subscribe(fn) {
  listeners.add(fn);
  fn({ ...state, selected: service.getDelivererById(state.selectedId) });
  return () => listeners.delete(fn);
}

export function initDeliverers() {
  refreshState();
  notify();
}

export function searchDeliverers(search) {
  state.filters.search = search;
  state.page = 1;
  applyFilters();
  notify();
}

export function setStatusFilter(status) {
  state.filters.status = status;
  state.page = 1;
  applyFilters();
  notify();
}

export function setAvailabilityFilter(value) {
  state.filters.availability = value;
  state.page = 1;
  applyFilters();
  notify();
}

export function setPage(page) {
  state.page = page;
  notify();
}

export function selectDeliverer(id) {
  state.selectedId = id;
  notify();
}

export function saveDeliverer(payload) {
  if (payload.id) {
    service.updateDeliverer(payload.id, payload);
  } else {
    service.addDeliverer(payload);
  }
  refreshState();
  notify();
}

export function removeDeliverer(id) {
  service.deleteDeliverer(id);
  refreshState();
  notify();
}

export function toggleActive(id) {
  service.toggleDelivererActive(id);
  refreshState();
  notify();
}

export function addReview(delivererId, review) {
  service.addDelivererReview(delivererId, review);
  refreshState();
  notify();
}
