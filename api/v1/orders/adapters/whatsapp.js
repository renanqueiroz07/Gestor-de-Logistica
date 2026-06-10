import { createOrderDTO } from '../OrderDTO.js';

export function normalizeWhatsApp(payload) {
  const message = payload.message || payload;
  return createOrderDTO({
    source: 'whatsapp',
    externalId: message.id,
    tenantId: message.tenant_id,
    customerName: message.contact?.name,
    customerPhone: message.contact?.phone,
    pickupName: message.store?.name,
    pickupAddress: message.store?.address,
    pickupLat: message.store?.lat,
    pickupLng: message.store?.lng,
    deliveryAddress: message.delivery?.address,
    deliveryLat: message.delivery?.lat,
    deliveryLng: message.delivery?.lng,
    deliveryNotes: message.delivery?.notes,
    items: message.items,
    total: message.payment?.total,
    paymentMethod: message.payment?.method,
    slaMinutes: message.sla_minutes
  });
}
