export function initDelivererMap(containerId) {
  if (typeof L === 'undefined') return null;
  try {
    const map = L.map(containerId).setView([-23.5505, -46.6333], 12);
    return map;
  } catch (error) {
    return null;
  }
}

export function setupDelivererMap(map) {
  if (!map || typeof L === 'undefined') return;
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  map.invalidateSize();
  setTimeout(() => map.invalidateSize(), 200);
}

export function renderDelivererMarkers(map, markers, deliverers) {
  markers.forEach(marker => map.removeLayer(marker));
  markers.length = 0;

  deliverers.forEach(deliverer => {
    if (!deliverer.location) return;
    const marker = L.marker([deliverer.location.lat, deliverer.location.lon], {
      icon: L.divIcon({
        className: 'deliverer-marker',
        html: `<div style="background:${getMarkerColor(deliverer.status)};color:white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;">${deliverer.name.split(' ')[0][0]}</div>`,
        iconSize: [24, 24]
      })
    }).addTo(map).bindPopup(`<strong>${deliverer.name}</strong><br>${deliverer.location.neighborhood || ''}<br>Status: ${deliverer.status}`);
    markers.push(marker);
  });

  if (markers.length > 0) {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.2));
  }
}

function getMarkerColor(status) {
  switch (status) {
    case 'active': return '#00d4aa';
    case 'on_route': return '#6c63ff';
    case 'offline': return '#ff9f43';
    case 'paused': return '#54a0ff';
    default: return '#888';
  }
}
