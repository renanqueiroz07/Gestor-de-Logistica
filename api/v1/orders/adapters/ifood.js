import { createOrderDTO } from '../OrderDTO.js';

export function normalizeIfood(payload) {
  return createOrderDTO({
    source: 'ifood',
    externalId: payload.orderId,
    tenantId: payload.merchant?.id,
    customerName: payload.customer?.name,
    customerPhone: payload.customer?.phone?.number,
    pickupName: payload.merchant?.name,
    pickupAddress: payload.merchant?.address,
    pickupLat: payload.merchant?.latitude,
    pickupLng: payload.merchant?.longitude,
    deliveryAddress: payload.delivery?.deliveryAddress?.formattedAddress,
    deliveryLat: payload.delivery?.deliveryAddress?.coordinates?.latitude,
    deliveryLng: payload.delivery?.deliveryAddress?.coordinates?.longitude,
    deliveryNotes: payload.delivery?.deliveryAddress?.complement,
    items: (payload.items || []).map(item => ({ sku: item.id, name: item.name, quantity: item.quantity })),
    total: payload.total?.orderAmount,
    paymentMethod: payload.payments?.methods?.[0]?.method,
    slaMinutes: payload.delivery?.deliveryTimeInMinutes
  });
}
