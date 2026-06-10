import { DELIVERER_STATUS, DELIVERY_AVAILABILITY } from '../types/index.js';

const deliverers = [
  { id: 'd1', name: 'Carlos M.', city: 'Zona Norte', phone: '(11) 99876-5432', cnh: 'A1234567', vehicle: 'Fiat Toro', plate: 'ABC-1234', rating: 4.8, status: DELIVERER_STATUS.on_route, availability: DELIVERY_AVAILABILITY.busy, activeOrders: 4, deliveredToday: 12, location: { city: 'São Paulo', neighborhood: 'Tucuruvi', lat: -23.5032, lon: -46.6437 }, lastUpdate: '2026-05-15T11:28:00' },
  { id: 'd2', name: 'Ana L.', city: 'Centro', phone: '(11) 98765-4321', cnh: 'B7654321', vehicle: 'Honda HR-V', plate: 'DEF-5678', rating: 4.5, status: DELIVERER_STATUS.active, availability: DELIVERY_AVAILABILITY.available, activeOrders: 1, deliveredToday: 9, location: { city: 'São Paulo', neighborhood: 'República', lat: -23.5421, lon: -46.6358 }, lastUpdate: '2026-05-15T11:22:00' },
  { id: 'd3', name: 'Paulo R.', city: 'Zona Sul', phone: '(11) 99654-3210', cnh: 'C2345678', vehicle: 'Renault Duster', plate: 'GHI-9012', rating: 3.9, status: DELIVERER_STATUS.offline, availability: DELIVERY_AVAILABILITY.unavailable, activeOrders: 0, deliveredToday: 7, location: { city: 'São Paulo', neighborhood: 'Moema', lat: -23.6047, lon: -46.6784 }, lastUpdate: '2026-05-15T10:58:00' },
  { id: 'd4', name: 'Bruna S.', city: 'Zona Oeste', phone: '(11) 95432-1098', cnh: 'D8765432', vehicle: 'Fiat Uno', plate: 'JKL-3456', rating: 4.1, status: DELIVERER_STATUS.paused, availability: DELIVERY_AVAILABILITY.unavailable, activeOrders: 0, deliveredToday: 5, location: { city: 'São Paulo', neighborhood: 'Pinheiros', lat: -23.5658, lon: -46.6865 }, lastUpdate: '2026-05-15T10:45:00' },
  { id: 'd5', name: 'Rafael F.', city: 'Zona Leste', phone: '(11) 95321-0987', cnh: 'E3456789', vehicle: 'Chevrolet Tracker', plate: 'MNO-7890', rating: 4.6, status: DELIVERER_STATUS.active, availability: DELIVERY_AVAILABILITY.available, activeOrders: 2, deliveredToday: 10, location: { city: 'São Paulo', neighborhood: 'Itaquera', lat: -23.5382, lon: -46.4748 }, lastUpdate: '2026-05-15T11:12:00' },
  { id: 'd6', name: 'Carla N.', city: 'Centro', phone: '(11) 99123-4567', cnh: 'F9876543', vehicle: 'Volkswagen Nivus', plate: 'PQR-1122', rating: 4.9, status: DELIVERER_STATUS.on_route, availability: DELIVERY_AVAILABILITY.busy, activeOrders: 3, deliveredToday: 15, location: { city: 'São Paulo', neighborhood: 'Sé', lat: -23.5505, lon: -46.6333 }, lastUpdate: '2026-05-15T11:30:00' }
];

const historyLog = {
  d1: [
    { title: 'Entrega concluída', detail: 'Pedido #4721 entregue em Higienópolis', time: '11:24' },
    { title: 'Saiu para entrega', detail: 'Pedido #4728 em trânsito', time: '11:10' }
  ],
  d2: [
    { title: 'Disponível para novas rotas', detail: 'Aguardando despacho', time: '11:18' }
  ],
  d3: [
    { title: 'Offline', detail: 'Desconectado do aplicativo', time: '10:58' }
  ],
  d4: [
    { title: 'Pausa', detail: 'Pausa programada', time: '10:45' }
  ],
  d5: [
    { title: 'Entrega concluída', detail: 'Pedido #4730 entregue em Tatuapé', time: '11:06' }
  ],
  d6: [
    { title: 'Em rota', detail: 'Pedido #4732 em direção à República', time: '11:28' }
  ]
};

const deliveriesLog = {
  d1: [
    { id: '4721', date: '2026-05-15T11:24:00', destination: 'Higienópolis', value: 35.50, status: 'delivered' },
    { id: '4728', date: '2026-05-15T11:10:00', destination: 'Santana', value: 28.00, status: 'in_transit' }
  ],
  d2: [
    { id: '4719', date: '2026-05-15T11:18:00', destination: 'República', value: 22.00, status: 'delivered' }
  ],
  d3: [],
  d4: [],
  d5: [
    { id: '4730', date: '2026-05-15T11:06:00', destination: 'Tatuapé', value: 30.00, status: 'delivered' }
  ],
  d6: [
    { id: '4732', date: '2026-05-15T11:28:00', destination: 'República', value: 27.50, status: 'in_transit' }
  ]
};

const activitiesLog = {
  d1: [
    { type: 'success', message: 'Entrega concluída (Pedido #4721)', time: '2026-05-15T11:24:00' },
    { type: 'info', message: 'Saiu para entrega (Pedido #4728)', time: '2026-05-15T11:10:00' },
    { type: 'warning', message: 'Atraso no pickup', time: '2026-05-15T10:50:00' }
  ],
  d2: [
    { type: 'info', message: 'Disponível para novas rotas', time: '2026-05-15T11:18:00' }
  ],
  d3: [
    { type: 'warning', message: 'Offline — reconectar', time: '2026-05-15T10:58:00' }
  ],
  d4: [
    { type: 'info', message: 'Pausa programada', time: '2026-05-15T10:45:00' }
  ],
  d5: [
    { type: 'success', message: 'Entrega concluída (Pedido #4730)', time: '2026-05-15T11:06:00' }
  ],
  d6: [
    { type: 'info', message: 'Em rota (Pedido #4732)', time: '2026-05-15T11:28:00' }
  ]
};

const reviewsLog = {
  d1: [
    { reviewer: 'Cliente A', rating: 5, comment: 'Entrega rápida e educada.', time: '2026-05-15T11:24:00' },
    { reviewer: 'Cliente E', rating: 4, comment: 'Boa comunicação.', time: '2026-05-15T10:12:00' }
  ],
  d2: [
    { reviewer: 'Cliente B', rating: 4, comment: 'Chegou no horário.', time: '2026-05-15T11:18:00' }
  ],
  d3: [
    { reviewer: 'Cliente D', rating: 3, comment: 'Atrasou um pouco.', time: '2026-05-15T10:58:00' }
  ],
  d4: [],
  d5: [],
  d6: [
    { reviewer: 'Cliente C', rating: 5, comment: 'Ótimo atendimento ao cliente.', time: '2026-05-15T11:28:00' }
  ]
};

export function fetchDeliverers() {
  return deliverers.map(d => ({ ...d }));
}

export function getDelivererById(id) {
  return deliverers.find(d => d.id === id);
}

export function addDeliverer(payload) {
  const nextId = `d${deliverers.length + 1}`;
  const newDeliverer = {
    id: nextId,
    name: payload.name,
    city: payload.city,
    phone: payload.phone,
    cnh: payload.cnh,
    vehicle: payload.vehicle || 'Não informado',
    plate: payload.plate || '-',
    rating: 0,
    status: payload.status,
    availability: payload.availability,
    activeOrders: 0,
    deliveredToday: 0,
    location: payload.location || { city: payload.city, neighborhood: 'Centro', lat: -23.55, lon: -46.63 },
    lastUpdate: new Date().toISOString()
  };
  deliverers.unshift(newDeliverer);
  historyLog[nextId] = [{ title: 'Entregador cadastrado', detail: `Cadastro de ${payload.name}`, time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }];
  return newDeliverer;
}

export function updateDeliverer(id, updates) {
  const deliverer = deliverers.find(d => d.id === id);
  if (!deliverer) return null;
  Object.assign(deliverer, updates);
  deliverer.lastUpdate = new Date().toISOString();
  return deliverer;
}

export function deleteDeliverer(id) {
  const index = deliverers.findIndex(d => d.id === id);
  if (index !== -1) {
    deliverers.splice(index, 1);
    delete historyLog[id];
    return true;
  }
  return false;
}

export function toggleDelivererActive(id) {
  const deliverer = deliverers.find(d => d.id === id);
  if (!deliverer) return null;
  deliverer.status = deliverer.status === DELIVERER_STATUS.offline ? DELIVERER_STATUS.active : DELIVERER_STATUS.offline;
  deliverer.lastUpdate = new Date().toISOString();
  return deliverer;
}

export function getDelivererSummary() {
  const total = deliverers.length;
  const active = deliverers.filter(d => d.status === DELIVERER_STATUS.active).length;
  const onRoute = deliverers.filter(d => d.status === DELIVERER_STATUS.on_route).length;
  const offline = deliverers.filter(d => d.status === DELIVERER_STATUS.offline).length;
  const deliveredToday = deliverers.reduce((sum, d) => sum + d.deliveredToday, 0);
  return { total, active, onRoute, offline, deliveredToday };
}

export function getDelivererHistory(id) {
  return historyLog[id] || [];
}

export function getDelivererDeliveries(id) {
  return deliveriesLog[id] || [];
}

export function getDelivererActivities(id) {
  return activitiesLog[id] || [];
}

export function getDelivererReviews(id) {
  return reviewsLog[id] || [];
}

export function addDelivererReview(id, review) {
  if (!reviewsLog[id]) reviewsLog[id] = [];
  const entry = { reviewer: review.reviewer || 'Anônimo', rating: Number(review.rating) || 5, comment: review.comment || '', time: new Date().toISOString() };
  reviewsLog[id].unshift(entry);
  return entry;
}
