import { createOrderDTO } from '../OrderDTO.js';

export function normalize99Delivery(payload) {
  return createOrderDTO({
    source: '99delivery',
    externalId: payload.event_id || payload.order_id,
    tenantId: payload.client_id,
    customerName: payload.receiver?.name,
    customerPhone: payload.receiver?.phone,
    pickupName: payload.pickup?.name,
    pickupAddress: payload.pickup?.address,
    pickupLat: payload.pickup?.location?.lat,
    pickupLng: payload.pickup?.location?.lng,
    deliveryAddress: payload.dropoff?.address,
    deliveryLat: payload.dropoff?.location?.lat,
    deliveryLng: payload.dropoff?.location?.lng,
    deliveryNotes: payload.dropoff?.instructions,
    items: payload.packages || [],
    total: payload.fare?.total,
    paymentMethod: payload.payment_type,
    slaMinutes: payload.sla_minutes
  });
}
