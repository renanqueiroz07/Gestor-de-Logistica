export const supportedSources = ['whatsapp', 'ifood', '99delivery', 'keeta'];

export function createOrderDTO(payload) {
  return {
    externalId: payload.externalId,
    source: payload.source,
    tenantId: payload.tenantId,
    customer: {
      name: payload.customerName,
      phone: payload.customerPhone || '',
      document: payload.customerDocument || ''
    },
    pickup: {
      name: payload.pickupName,
      address: payload.pickupAddress,
      lat: Number(payload.pickupLat),
      lng: Number(payload.pickupLng)
    },
    delivery: {
      address: payload.deliveryAddress,
      lat: Number(payload.deliveryLat),
      lng: Number(payload.deliveryLng),
      notes: payload.deliveryNotes || ''
    },
    items: payload.items || [],
    payment: {
      total: Number(payload.total || 0),
      method: payload.paymentMethod || 'unknown'
    },
    slaMinutes: Number(payload.slaMinutes || 45),
    receivedAt: payload.receivedAt || new Date().toISOString()
  };
}

export function validateOrderDTO(order) {
  const errors = [];
  if (!supportedSources.includes(order.source)) errors.push('source must be one of whatsapp, ifood, 99delivery or keeta');
  if (!order.externalId) errors.push('externalId is required');
  if (!order.tenantId) errors.push('tenantId is required');
  if (!order.customer?.name) errors.push('customer.name is required');
  if (!order.pickup?.address) errors.push('pickup.address is required');
  if (!Number.isFinite(order.pickup?.lat) || !Number.isFinite(order.pickup?.lng)) errors.push('pickup coordinates are required');
  if (!order.delivery?.address) errors.push('delivery.address is required');
  if (!Number.isFinite(order.delivery?.lat) || !Number.isFinite(order.delivery?.lng)) errors.push('delivery coordinates are required');
  if (!Array.isArray(order.items) || order.items.length === 0) errors.push('items must contain at least one item');
  return errors;
}
