import { createOrderDTO } from '../OrderDTO.js';

export function normalizeKeeta(payload) {
  const order = payload.order || payload;
  return createOrderDTO({
    source: 'keeta',
    externalId: order.id,
    tenantId: order.store_id,
    customerName: order.user?.name,
    customerPhone: order.user?.phone,
    pickupName: order.store?.name,
    pickupAddress: order.store?.address,
    pickupLat: order.store?.geo?.lat,
    pickupLng: order.store?.geo?.lng,
    deliveryAddress: order.recipient?.address,
    deliveryLat: order.recipient?.geo?.lat,
    deliveryLng: order.recipient?.geo?.lng,
    deliveryNotes: order.recipient?.notes,
    items: order.lines || [],
    total: order.amount_total,
    paymentMethod: order.payment_method,
    slaMinutes: order.sla_minutes
  });
}
