import { normalizeWhatsApp } from './adapters/whatsapp.js';
import { normalizeIfood } from './adapters/ifood.js';
import { normalize99Delivery } from './adapters/delivery99.js';
import { normalizeKeeta } from './adapters/keeta.js';
import { validateOrderDTO } from './OrderDTO.js';
import { InMemoryOrderQueue } from './queue/InMemoryOrderQueue.js';

const adapters = {
  whatsapp: normalizeWhatsApp,
  ifood: normalizeIfood,
  '99delivery': normalize99Delivery,
  keeta: normalizeKeeta
};

export const orderQueue = new InMemoryOrderQueue({ maxRetries: 3 });

export function authenticateIngestion({ source, headers = {}, credentials = {} }) {
  const apiKey = headers['x-api-key'];
  const signature = headers['x-hmac-signature'];
  const expectedKey = credentials[source]?.apiKey;
  const expectedSignature = credentials[source]?.signature;
  return Boolean((expectedKey && apiKey === expectedKey) || (expectedSignature && signature === expectedSignature));
}

export async function ingestOrder({ source, payload, headers = {}, credentials = {} }) {
  if (!adapters[source]) {
    return { status: 400, errors: [`unsupported source: ${source}`] };
  }
  if (!authenticateIngestion({ source, headers, credentials })) {
    return { status: 401, errors: ['invalid API key or HMAC signature'] };
  }
  const order = adapters[source](payload);
  const errors = validateOrderDTO(order);
  if (errors.length) {
    return { status: 400, errors };
  }
  const job = orderQueue.enqueue(order);
  return { status: 202, data: { jobId: job.id, order } };
}
