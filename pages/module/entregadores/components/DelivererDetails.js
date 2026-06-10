import { formatStatusLabel, formatAvailabilityLabel, formatDateTime, getInitials } from '../utils/format.js';

export function delivererDetailsTemplate(deliverer) {
  if (!deliverer) {
    return `<div class="detail-empty">Selecione um entregador para ver detalhes.</div>`;
  }

  const statusClass = {
    active: 'status-active',
    on_route: 'status-route',
    offline: 'status-offline',
    paused: 'status-paused'
  }[deliverer.status] || 'status-active';

  const ratingValue = Number(deliverer.rating || 0).toFixed(1);
  const ratingStars = '★'.repeat(Math.round(deliverer.rating || 0)) + '☆'.repeat(5 - Math.round(deliverer.rating || 0));

  return `
    <div class="deliverer-detail-card">
      <div class="detail-header">
        <div class="detail-avatar">${getInitials(deliverer.name)}</div>
        <div class="detail-main">
          <div class="detail-name">${deliverer.name}</div>
          <div class="detail-sub">${deliverer.city} · ${deliverer.location?.neighborhood || 'Sem bairro'}</div>
          <div class="detail-status-row">
            <span class="status-pill ${statusClass}">${formatStatusLabel(deliverer.status)}</span>
            <span class="detail-tag">${formatAvailabilityLabel(deliverer.availability)}</span>
          </div>
        </div>
      </div>

      <div class="detail-grid">
        <div>
          <div class="detail-label">Telefone</div>
          <div class="detail-value">${deliverer.phone || '-'}</div>
        </div>
        <div>
          <div class="detail-label">Veículo</div>
          <div class="detail-value">${deliverer.vehicle || 'Não informado'}</div>
        </div>
        <div>
          <div class="detail-label">Placa</div>
          <div class="detail-value">${deliverer.plate || '-'}</div>
        </div>
        <div>
          <div class="detail-label">Avaliação</div>
          <div class="detail-value detail-rating">${ratingStars} <span class="rating-score">${ratingValue}/5</span></div>
        </div>
      </div>

      <div class="detail-meta">
        <div>
          <div class="detail-label">Última atualização</div>
          <div class="detail-value">${formatDateTime(deliverer.lastUpdate)}</div>
        </div>
      </div>

      <div class="deliverer-actions">
        <button class="btn-primary" id="assignRideButton">Atribuir Corrida</button>
        <button class="btn-secondary" id="viewProfileButton">Ver Perfil</button>
        <button class="btn-chip" id="toggleActiveButton">Ativar/Desativar</button>
        <button class="btn-chip" id="deleteDelivererButton">Excluir</button>
      </div>

      <div class="review-form">
        <input id="reviewAuthor" class="form-input" placeholder="Seu nome (opcional)" />
        <textarea id="reviewText" class="form-input" placeholder="Escreva uma avaliação rápida..."></textarea>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <select id="reviewRating" class="form-input" style="width:110px">
            <option value="5">★★★★★</option>
            <option value="4">★★★★</option>
            <option value="3">★★★</option>
            <option value="2">★★</option>
            <option value="1">★</option>
          </select>
          <button class="btn-primary" id="submitReviewButton">Enviar avaliação</button>
        </div>
      </div>
    </div>
  `;
}
