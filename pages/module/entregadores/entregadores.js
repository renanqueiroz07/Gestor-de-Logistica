import { initDeliverers, subscribe, searchDeliverers, setStatusFilter, setAvailabilityFilter, setPage, selectDeliverer, saveDeliverer, removeDeliverer, toggleActive, addReview } from './hooks/useDeliverers.js';
import { delivererCardTemplate } from './components/DelivererCard.js';
import { delivererDetailsTemplate } from './components/DelivererDetails.js';
import { initDelivererMap, setupDelivererMap, renderDelivererMarkers } from './components/DelivererMap.js';
import { getDelivererDeliveries, getDelivererActivities, getDelivererReviews } from './services/delivererService.js';
import { formatDateTime } from './utils/format.js';

let map = null;
const markers = [];


const reviewsContainer = document.getElementById('delivererReviews');
const listContainer = document.getElementById('deliverersList');
const detailsContainer = document.getElementById('delivererDetails');
const historyContainer = document.getElementById('delivererHistory');
const activityContainer = document.getElementById('delivererActivity');
const summaryTotal = document.getElementById('summaryTotal');
const summaryActive = document.getElementById('summaryActive');
const summaryOnRoute = document.getElementById('summaryOnRoute');
const summaryOffline = document.getElementById('summaryOffline');
const summaryDelivered = document.getElementById('summaryDelivered');
const delivererSummary = document.getElementById('delivererSummary');
const paginationContainer = document.getElementById('pagination');
const delivererMapEl = document.getElementById('delivererMap');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const availabilityFilter = document.getElementById('availabilityFilter');
const delivererSaveButton = document.getElementById('delivererSaveButton');
const formName = document.getElementById('fd-name');
const formCity = document.getElementById('fd-city');
const formPhone = document.getElementById('fd-phone');
const formCnh = document.getElementById('fd-cnh');
const formStatus = document.getElementById('fd-status');
const formAvailability = document.getElementById('fd-availability');

function initMap() {
  if (!delivererMapEl || typeof L === 'undefined') return;
  map = initDelivererMap('delivererMap');
  if (map) setupDelivererMap(map);
}

function renderSummary(summary) {
  if (!summaryTotal) return;
  summaryTotal.textContent = summary.total;
  summaryActive.textContent = summary.active;
  summaryOnRoute.textContent = summary.onRoute;
  summaryOffline.textContent = summary.offline;
  summaryDelivered.textContent = summary.deliveredToday;
}

function renderDelivererList(state) {
  if (!listContainer) return;
  const start = (state.page - 1) * state.pageSize;
  const pageItems = state.filtered.slice(start, start + state.pageSize);
  listContainer.innerHTML = pageItems.map(deliverer => delivererCardTemplate(deliverer, state.selectedId === deliverer.id)).join('');
  bindListEvents();
}

function bindListEvents() {
  document.querySelectorAll('.deliverer-card').forEach(card => {
    card.onclick = () => selectDeliverer(card.dataset.id);
  });
}

function renderPagination(state) {
  if (!paginationContainer) return;
  const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
  paginationContainer.innerHTML = '';
  for (let page = 1; page <= totalPages; page += 1) {
    const btn = document.createElement('button');
    btn.className = `page-btn${page === state.page ? ' active' : ''}`;
    btn.textContent = page;
    btn.onclick = () => setPage(page);
    paginationContainer.appendChild(btn);
  }
}

function renderDetails(deliverer) {
  if (!detailsContainer) return;
  detailsContainer.innerHTML = delivererDetailsTemplate(deliverer);
  bindDetailActions(deliverer);
}

function bindDetailActions(deliverer) {
  if (!deliverer) return;
  const toggleButton = document.getElementById('toggleActiveButton');
  const deleteButton = document.getElementById('deleteDelivererButton');
  const assignButton = document.getElementById('assignRideButton');
  const viewButton = document.getElementById('viewProfileButton');
  const submitBtn = document.getElementById('submitReviewButton');
  const reviewTextEl = document.getElementById('reviewText');
  const reviewRatingEl = document.getElementById('reviewRating');
  const reviewAuthorEl = document.getElementById('reviewAuthor');
  if (toggleButton) toggleButton.onclick = () => toggleActive(deliverer.id);
  if (deleteButton) deleteButton.onclick = () => removeDeliverer(deliverer.id);
  if (assignButton) assignButton.onclick = () => { showNotif(); };
  if (viewButton) viewButton.onclick = () => { window.alert(`${deliverer.name} — perfil (placeholder)`); };
  if (submitBtn) submitBtn.onclick = () => {
    const payload = {
      reviewer: reviewAuthorEl ? reviewAuthorEl.value.trim() : 'Cliente',
      rating: reviewRatingEl ? reviewRatingEl.value : 5,
      comment: reviewTextEl ? reviewTextEl.value.trim() : ''
    };
    if (!payload.comment) return;
    addReview(deliverer.id, payload);
    if (reviewTextEl) reviewTextEl.value = '';
    if (reviewAuthorEl) reviewAuthorEl.value = '';
    if (reviewRatingEl) reviewRatingEl.value = '5';
  };
}

function renderHistory(deliveries) {
  if (!historyContainer) return;
  if (!deliveries || !deliveries.length) {
    historyContainer.innerHTML = `<div style="font-size:13px;color:var(--muted)">Nenhuma entrega registrada. Selecione um entregador para ver o histórico.</div>`;
    return;
  }

  // Render table-like list
  historyContainer.innerHTML = `
    <div class="history-table">
      <div class="history-row history-header">
        <div>ID</div>
        <div>Data / Hora</div>
        <div>Destino</div>
        <div>Valor</div>
        <div>Status</div>
      </div>
      ${deliveries.map(d => {
        const statusText = d.status === 'delivered' ? 'Entregue' : d.status === 'cancelled' ? 'Cancelado' : 'Em trânsito';
        const statusClass = d.status === 'delivered' ? 'history-status-delivered' : d.status === 'cancelled' ? 'history-status-cancelled' : 'history-status-transit';
        return `
          <div class="history-row ${statusClass}">
            <div>#${d.id}</div>
            <div>${formatDateTime(d.date)}</div>
            <div>${d.destination}</div>
            <div>R$ ${Number(d.value).toFixed(2).replace('.',',')}</div>
            <div><span class="status-pill ${d.status === 'delivered' ? 'status-active' : d.status === 'cancelled' ? 'status-offline' : 'status-route'}">${statusText}</span></div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderReviews(selected) {
  if (!reviewsContainer) return;
  const list = selected ? getDelivererReviews(selected.id) : [];
  if (!list || !list.length) {
    reviewsContainer.innerHTML = `<div style="font-size:12px;color:var(--muted)">Nenhuma avaliação disponível.</div>`;
    return;
  }
  reviewsContainer.innerHTML = list.map(r => `
    <div class="review-item">
      <div class="review-avatar">${(r.reviewer || 'Anônimo').split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
      <div class="review-body">
        <div class="review-meta"><div class="review-name">${r.reviewer}</div><div class="review-stars">${'★'.repeat(r.rating)}</div></div>
        <div class="review-text">${r.comment}</div>
        <div style="font-size:11px;color:var(--muted)">${formatDateTime(r.time)}</div>
      </div>
    </div>
  `).join('');
}

function timeAgoOrTime(iso) {
  try {
    const then = new Date(iso);
    const diff = Date.now() - then.getTime();
    const mins = Math.round(diff / 60000);
    if (mins < 60) return `Há ${mins} min`;
    return then.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return iso;
  }
}

function renderActivities(activities) {
  if (!activityContainer) return;
  if (!activities || !activities.length) {
    activityContainer.innerHTML = `<div style="font-size:13px;color:var(--muted)">Nenhuma atividade recente nas últimas 24h.</div>`;
    return;
  }

  const dotClass = type => ({ success: 'dot-success', warning: 'dot-warning', info: 'dot-info' }[type] || 'dot-info');

  activityContainer.innerHTML = activities.map(a => `
    <div class="timeline-item">
      <div class="timeline-dot ${dotClass(a.type)}"></div>
      <div class="timeline-body">
        <div class="timeline-message">${a.message}</div>
        <div class="timeline-time">${timeAgoOrTime(a.time)}</div>
      </div>
    </div>
  `).join('');
}

function updateMapMarkers(deliverers) {
  if (!map) return;
  renderDelivererMarkers(map, markers, deliverers);
}

function populateForm() {
  formName.value = '';
  formCity.value = '';
  formPhone.value = '';
  formCnh.value = '';
  formStatus.value = 'active';
  formAvailability.value = 'available';
}

function handleSaveDeliverer() {
  const payload = {
    name: formName.value.trim(),
    city: formCity.value.trim(),
    phone: formPhone.value.trim(),
    cnh: formCnh.value.trim(),
    status: formStatus.value,
    availability: formAvailability.value
  };
  if (!payload.name || !payload.city) return;
  saveDeliverer(payload);
  populateForm();
}

function toggleForm() {
  const form = document.getElementById('newOrderForm');
  if (form) form.classList.toggle('visible');
}

function showNotif() {
  const notification = document.getElementById('notification');
  const body = document.getElementById('notif-body');
  if (!notification || !body) return;
  body.textContent = 'Novo pedido recebido — atualize o roteamento para o entregador.';
  notification.classList.add('show');
  setTimeout(() => notification.classList.remove('show'), 4000);
}

function updateClock() {
  const clock = document.getElementById('clock');
  if (!clock) return;
  const now = new Date();
  clock.textContent = now.toLocaleTimeString('pt-BR');
}

function renderMapSummary(summary) {
  if (!delivererSummary) return;
  delivererSummary.innerHTML = `
    <div class="deliverer-summary-card">
      <div class="metric-label">Total</div>
      <div class="metric-value">${summary.total}</div>
    </div>
    <div class="deliverer-summary-card">
      <div class="metric-label">Ativos</div>
      <div class="metric-value">${summary.active}</div>
    </div>
    <div class="deliverer-summary-card">
      <div class="metric-label">Em rota</div>
      <div class="metric-value">${summary.onRoute}</div>
    </div>
    <div class="deliverer-summary-card">
      <div class="metric-label">Offline</div>
      <div class="metric-value">${summary.offline}</div>
    </div>
  `;
}

function renderUI(state) {
  renderSummary(state.summary);
  renderDelivererList(state);
  renderPagination(state);
  renderDetails(state.selected);
  renderMapSummary(state.summary);
  if (map) updateMapMarkers(state.deliverers);
}

window.toggleForm = toggleForm;
window.showNotif = showNotif;
window.setNav = function(el) {
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  if (el) el.classList.add('active');
};

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  initDeliverers();
  updateClock();
  setInterval(updateClock, 1000);

  if (searchInput) {
    searchInput.addEventListener('input', event => searchDeliverers(event.target.value));
  }
  if (statusFilter) {
    statusFilter.addEventListener('change', event => setStatusFilter(event.target.value));
  }
  if (availabilityFilter) {
    availabilityFilter.addEventListener('change', event => setAvailabilityFilter(event.target.value));
  }
  if (delivererSaveButton) {
    delivererSaveButton.addEventListener('click', handleSaveDeliverer);
  }

  subscribe(state => {
    renderUI(state);
    renderHistory(state.selected ? getDelivererDeliveries(state.selected.id) : []);
    renderActivities(state.selected ? getDelivererActivities(state.selected.id) : []);
    renderReviews(state.selected);
  });
});
