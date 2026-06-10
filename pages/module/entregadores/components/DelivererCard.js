import { getInitials, formatStatusLabel, formatAvailabilityLabel } from '../utils/format.js';

export function delivererCardTemplate(deliverer, selected) {
  const statusClass = {
    active: 'status-active',
    on_route: 'status-route',
    offline: 'status-offline',
    paused: 'status-paused'
  }[deliverer.status] || 'status-active';

  return `
    <div class="deliverer-card${selected ? ' selected' : ''}" data-id="${deliverer.id}">
      <div class="deliverer-avatar">${getInitials(deliverer.name)}</div>
      <div class="deliverer-info">
        <div class="deliverer-name">${deliverer.name}</div>
        <div class="deliverer-meta">${deliverer.city} · ${deliverer.phone}</div>
        <div class="deliverer-tags">
          <span class="status-pill ${statusClass}">${formatStatusLabel(deliverer.status)}</span>
          <span class="status-pill">${formatAvailabilityLabel(deliverer.availability)}</span>
          <span class="status-pill">${deliverer.activeOrders} pedidos</span>
        </div>
      </div>
    </div>
  `;
}
