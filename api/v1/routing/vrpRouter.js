function distanceKm(a, b) {
  const lat = (a.lat - b.lat) * 111;
  const lng = (a.lng - b.lng) * 111 * Math.cos((a.lat + b.lat) * Math.PI / 360);
  return Math.sqrt(lat * lat + lng * lng);
}

export function scoreDriver(order, driver, options = {}) {
  const distance = distanceKm(driver.location, order.pickup);
  const loadPenalty = driver.activeDeliveries * (options.loadWeight || 1.6);
  const capacityPenalty = order.items.length > driver.capacity ? 100 : 0;
  const slaPenalty = order.slaMinutes < 30 ? 4 : 0;
  return distance + loadPenalty + capacityPenalty + slaPenalty;
}

export function assignBestDriver(order, drivers, options = {}) {
  const available = drivers.filter(driver => driver.status === 'available');
  const ranked = available
    .map(driver => ({ driver, score: scoreDriver(order, driver, options) }))
    .sort((a, b) => a.score - b.score);
  return ranked[0] || null;
}

export function buildSimplifiedVrpRoute(driver, orders) {
  let current = driver.location;
  const remaining = [...orders];
  const waypoints = [];
  let totalDistanceKm = 0;

  while (remaining.length) {
    remaining.sort((a, b) => distanceKm(current, a.delivery) - distanceKm(current, b.delivery));
    const next = remaining.shift();
    const legDistance = distanceKm(current, next.delivery);
    totalDistanceKm += legDistance;
    waypoints.push({
      orderId: next.externalId,
      address: next.delivery.address,
      distanceKm: Number(legDistance.toFixed(2)),
      etaMinutes: Math.max(6, Math.round((legDistance / 28) * 60))
    });
    current = next.delivery;
  }

  return {
    driverId: driver.id,
    strategy: 'nearest-neighbor-vrp-simplified',
    totalDistanceKm: Number(totalDistanceKm.toFixed(2)),
    waypoints
  };
}
