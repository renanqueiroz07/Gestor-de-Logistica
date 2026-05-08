/*
  Comportamentos JavaScript do dashboard principal.
  Este arquivo controla o relógio em tempo real, estado da navegação,
  notificações, lista de pedidos, detalhes de rota e o formulário de novo pedido.
  Agora inclui mapa interativo com Leaflet para rotas dinâmicas.
*/

// Inicialização do mapa Leaflet
let map;
let markers = [];
let routes = [];
let routeLayers = {};
let hubLocation = [-23.5505, -46.6333]; // São Paulo como exemplo
const routeColors = {
  'Rota A': '#00d4aa',
  'Rota B': '#6c63ff',
  'Rota C': '#ff9f43'
};

function initMap() {
  map = L.map('map').setView(hubLocation, 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Adicionar marcador do HUB
  L.marker(hubLocation, {
    icon: L.divIcon({
      className: 'hub-marker',
      html: '<div style="background:#00d4aa;color:white;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-weight:bold;">HUB</div>',
      iconSize: [30, 30]
    })
  }).addTo(map).bindPopup('Centro de Distribuição');

  // Criar rotas fixas A/B/C no mapa
  createRouteLayers();

  // Carregar pedidos existentes no mapa
  loadOrdersOnMap();
}

function createRouteLayers() {
  const routesDefinition = {
    'Rota A': [
      hubLocation,
      getCoordinatesFromAddress('Rua Oscar Freire, 254'),
      getCoordinatesFromAddress('Alameda Santos, 811'),
      getCoordinatesFromAddress('Rua Bela Cintra, 306')
    ],
    'Rota B': [
      hubLocation,
      getCoordinatesFromAddress('Av. Rebouças, 1400'),
      getCoordinatesFromAddress('Rua da Consolação, 88')
    ],
    'Rota C': [
      hubLocation,
      getCoordinatesFromAddress('Av. Paulista, 327')
    ]
  };

  Object.entries(routesDefinition).forEach(([name, points]) => {
    const layer = L.polyline(points, {
      color: routeColors[name],
      weight: 4,
      opacity: 0.7,
      dashArray: '8 6'
    });
    routeLayers[name] = layer;
    if (name === 'Rota A') {
      layer.addTo(map);
    }
  });

  showRoute('Rota A');
}

function showRoute(routeName) {
  Object.entries(routeLayers).forEach(([name, layer]) => {
    if (routeName === 'Todas' || routeName === name) {
      if (!map.hasLayer(layer)) layer.addTo(map);
    } else {
      if (map.hasLayer(layer)) map.removeLayer(layer);
    }
  });

  if (routeName !== 'Todas') {
    routes.forEach(r => {
      if (map.hasLayer(r)) map.removeLayer(r);
    });
  }

  if (routeName === 'Todas') {
    const group = L.featureGroup(Object.values(routeLayers));
    if (group.getBounds().isValid()) {
      map.fitBounds(group.getBounds(), { padding: [60, 60], maxZoom: 15 });
    }
  } else if (routeLayers[routeName]) {
    map.fitBounds(routeLayers[routeName].getBounds(), { padding: [60, 60], maxZoom: 15 });
  }
}

function toggleMapBtn(el, route) {
  document.querySelectorAll('.panel-actions .btn-sm').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  showRoute(route);
}


// Carregar marcadores dos pedidos no mapa
function loadOrdersOnMap() {
  // Limpar marcadores existentes
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  ordersData.forEach((order, index) => {
    // Simular coordenadas baseadas no endereço (em produção, usar geocoding API)
    const coords = getCoordinatesFromAddress(order.addr);
    if (coords) {
      const marker = L.marker(coords, {
        icon: L.divIcon({
          className: 'order-marker',
          html: `<div style="background:${getStatusColor(order.status)};color:white;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;">${index + 1}</div>`,
          iconSize: [20, 20]
        })
      }).addTo(map).bindPopup(`
        <b>${order.client}</b><br>
        ${order.addr}<br>
        Status: ${order.statusLabel}<br>
        Valor: ${order.value}
      `);
      markers.push(marker);
    }
  });
}

// Simular geocoding (substituir por API real)
function getCoordinatesFromAddress(address) {
  // Coordenadas fictícias baseadas em endereços de SP
  const addressMap = {
    'Rua Oscar Freire, 254': [-23.5605, -46.6533],
    'Alameda Santos, 811': [-23.5705, -46.6433],
    'Rua Bela Cintra, 306': [-23.5505, -46.6433],
    'Av. Rebouças, 1400': [-23.5405, -46.6233],
    'Rua da Consolação, 88': [-23.5505, -46.6333],
    'Rua Haddock Lobo, 620': [-23.5605, -46.6333],
    'Av. Paulista, 327': [-23.5705, -46.6333]
  };
  return addressMap[address] || [hubLocation[0] + (Math.random() - 0.5) * 0.1, hubLocation[1] + (Math.random() - 0.5) * 0.1];
}

// Obter cor baseada no status
function getStatusColor(status) {
  const colors = {
    'pending': '#ff9f43',
    'route': '#6c63ff',
    'transit': '#00d4aa',
    'done': '#28a745'
  };
  return colors[status] || '#6c757d';
}

// Calcular e otimizar rotas
function optimizeRoutes() {
  // Limpar rotas existentes
  routes.forEach(route => map.removeLayer(route));
  routes = [];

  // Agrupar pedidos por status
  const pendingOrders = ordersData.filter(o => o.status === 'pending' || o.status === 'route');
  if (pendingOrders.length === 0) return;

  // Algoritmo simples de roteamento: ordenar por distância do hub
  const sortedOrders = pendingOrders.sort((a, b) => {
    const distA = getDistance(hubLocation, getCoordinatesFromAddress(a.addr));
    const distB = getDistance(hubLocation, getCoordinatesFromAddress(b.addr));
    return distA - distB;
  });

  // Criar rota otimizada
  const routePoints = [hubLocation];
  sortedOrders.forEach(order => {
    const coords = getCoordinatesFromAddress(order.addr);
    if (coords) routePoints.push(coords);
  });
  routePoints.push(hubLocation); // Retorno ao hub

  const route = L.polyline(routePoints, {
    color: '#00d4aa',
    weight: 3,
    opacity: 0.7
  }).addTo(map);

  routes.push(route);

  if (routePoints.length > 1) {
    map.fitBounds(route.getBounds(), { padding: [60, 60], maxZoom: 15 });
  }

  // Adicionar marcador do entregador em movimento
  animateDelivery(routePoints);
}


// Calcular distância entre dois pontos (fórmula de Haversine)
function getDistance(coord1, coord2) {
  const R = 6371; // Raio da Terra em km
  const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
  const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Animar movimento do entregador
function animateDelivery(routePoints) {
  if (routePoints.length < 2) return;

  let currentIndex = 0;
  const deliveryMarker = L.marker(routePoints[0], {
    icon: L.divIcon({
      className: 'delivery-marker',
      html: '<div style="background:#ff4757;color:white;border-radius:50%;width:15px;height:15px;display:flex;align-items:center;justify-content:center;">🚚</div>',
      iconSize: [15, 15]
    })
  }).addTo(map);

  const moveNext = () => {
    currentIndex = (currentIndex + 1) % routePoints.length;
    deliveryMarker.setLatLng(routePoints[currentIndex]);
    setTimeout(moveNext, 3000); // Mover a cada 3 segundos
  };

  moveNext();
}

// Função de atualização do relógio no topo
function updateClock() {
  const d = new Date();
  document.getElementById('clock').textContent = d.toLocaleTimeString('pt-BR');
}
setInterval(updateClock, 1000);
updateClock();

// Alterna o estado ativo da navegação lateral
function setNav(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
}

function goToOrders(el) {
  setNav(el);
  const ordersPanel = document.getElementById('ordersPanel');
  if (ordersPanel) {
    ordersPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Simula e exibe a notificação de novo pedido
function showNotif() {
  const names = ['Pizzaria Roma','Sushi Bar Yamamoto','Café & Bistrô Central','Burguer Factory','Deli Premium'];
  const name = names[Math.floor(Math.random()*names.length)];
  const val = (Math.random()*900+200).toFixed(0);
  const items = Math.floor(Math.random()*20+5);
  document.getElementById('notif-body').textContent = `${name} — ${items} itens — R$ ${val},00`;
  document.getElementById('notification').classList.add('show');
}
function dismissNotif() {
  document.getElementById('notification').classList.remove('show');
}
function acceptOrder() {
  dismissNotif();
  const count = parseInt(document.getElementById('orders-count').textContent, 10);
  document.getElementById('orders-count').textContent = count + 1;
  addOrderToList({
    num: '#' + (48 + Math.floor(Math.random()*10)),
    client: 'Novo Cliente',
    addr: 'Av. Paulista, 1000',
    status: 'route',
    statusLabel: 'Roteado',
    value: 'R$' + (Math.random()*500+200).toFixed(0),
    time: 'agora'
  });
  // Recarregar mapa e painel após novo pedido
  loadOrdersOnMap();
  optimizeRoutes();
  updateRouteStops();
}

// Dados de exemplo usados para preencher o painel de pedidos
const ordersData = [
  { num:'#4721', client:'Pizzaria Roma', addr:'Rua Oscar Freire, 254', status:'transit', statusLabel:'Em trânsito', value:'R$1.240', time:'10min' },
  { num:'#4720', client:'Sushi Bar Yamamoto', addr:'Alameda Santos, 811', status:'transit', statusLabel:'Em trânsito', value:'R$890', time:'22min' },
  { num:'#4719', client:'Café Blend', addr:'Rua Bela Cintra, 306', status:'route', statusLabel:'Roteado', value:'R$340', time:'35min' },
  { num:'#4718', client:'Burguer Factory', addr:'Av. Rebouças, 1400', status:'transit', statusLabel:'Em trânsito', value:'R$720', time:'40min' },
  { num:'#4717', client:'Deli Central', addr:'Rua da Consolação, 88', status:'pending', statusLabel:'Pendente', value:'R$290', time:'45min' },
  { num:'#4716', client:'Restaurante Bella', addr:'Rua Haddock Lobo, 620', status:'done', statusLabel:'Entregue', value:'R$1.100', time:'1h' },
  { num:'#4715', client:'Temaki House', addr:'Av. Paulista, 327', status:'done', statusLabel:'Entregue', value:'R$560', time:'2h' },
];

let currentFilter = 'all';
function filterOrders(el, f) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  currentFilter = f;
  renderOrders();
}
function addOrderToList(order) {
  ordersData.unshift(order);
  renderOrders();
}
// Renderiza a lista filtrada de pedidos no painel de pedidos
function renderOrders() {
  const list = document.getElementById('ordersList');
  const filtered = currentFilter === 'all'
    ? ordersData
    : ordersData.filter(o => (
      currentFilter === 'transit' ? o.status === 'transit'
      : currentFilter === 'pending' ? o.status === 'pending'
      : currentFilter === 'done' ? o.status === 'done'
      : o.status === 'route'
    ));
  list.innerHTML = filtered.map((o, i) => `
    <div class="order-item ${i===0?'selected':''}" onclick="selectOrder(this)">
      <div>
        <div class="order-num">${o.num}</div>
        <div style="width:1px;height:1px"></div>
      </div>
      <div style="flex:1">
        <div class="order-client">${o.client}</div>
        <div class="order-addr">${o.addr}</div>
        <div class="order-time">${o.time} atrás</div>
      </div>
      <div class="order-status">
        <span class="status-pill s-${o.status}">${o.statusLabel}</span>
        <span class="order-value">${o.value}</span>
      </div>
    </div>
  `).join('');
}
function selectOrder(el) {
  document.querySelectorAll('.order-item').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
}
renderOrders();
updateRouteStops();

function updateRouteStops() {
  const routeOrders = ordersData.filter(o => o.status === 'route' || o.status === 'transit' || o.status === 'pending');
  const stops = [
    { n:'Hub central', d:'Saída agora', eta:'00min', color:'var(--accent)', done:true }
  ];

  routeOrders.forEach((order, index) => {
    stops.push({
      n: order.client,
      d: order.addr,
      eta: order.status === 'transit' ? `+${10 + index * 5}min` : `+${20 + index * 7}min`,
      color: order.status === 'transit' ? 'var(--accent)' : 'var(--warn)',
      done: order.status === 'transit'
    });
  });

  const stopsContainer = document.getElementById('routeStops');
  const previewText = document.getElementById('routePreviewText');

  if (routeOrders.length === 0) {
    stopsContainer.innerHTML = `<div class="stop-item"><div class="stop-info"><div class="stop-name">Nenhuma rota ativa</div><div class="stop-detail">Adicione um pedido para criar a primeira rota.</div></div></div>`;
    if (previewText) previewText.textContent = 'Sem rotas ativas. Adicione um pedido para ver a rota no dashboard.';
    return;
  }

  stopsContainer.innerHTML = stops.map((s, i) => `
    <div class="stop-item">
      <div class="stop-line">
        <div class="stop-circle" style="background:${s.done ? s.color : 'rgba(255,255,255,0.06)'};color:${s.done ? '#0d0f14' : 'var(--muted)'}">${i+1}</div>
        ${i < stops.length-1 ? '<div class="stop-connector"></div>' : ''}
      </div>
      <div class="stop-info">
        <div class="stop-name" style="color:${s.done ? 'var(--text)' : 'var(--muted)'}">${s.n}</div>
        <div class="stop-detail">${s.d}</div>
      </div>
      <div class="stop-eta" style="color:${s.done ? 'var(--accent)' : 'var(--muted)'}">${s.eta}</div>
    </div>
  `).join('');

  if (previewText) {
    previewText.textContent = `Rota com ${routeOrders.length} parada(s) gerada automaticamente para o próximo despacho.`;
  }
}

// Dados do gráfico sparkline para pedidos por hora
const hours = [6,8,12,19,14,22,31,28,35,47,42,38];
const labels = ['08','09','10','11','12','13','14','15','16','17','18','19'];
const max = Math.max(...hours);
const sbContainer = document.getElementById('sparkbars');
const slContainer = document.getElementById('sparklabels');
sbContainer.innerHTML = hours.map((h, i) => `<div class="sparkbar ${i===hours.length-1?'active':''}" style="height:${Math.round(h/max*100)}%" title="${h} pedidos"></div>`).join('');
slContainer.innerHTML = labels.map(l => `<div class="spark-label">${l}</div>`).join('');

// Lista de cartões de entregadores exibidos no painel de entregadores
const drivers = [
  { name:'Carlos M.', status:'Em rota · Zona Norte', count:12, color:'#00d4aa', initials:'CM', rating:'4.9', review:'Entrega rápida e comunicação excelente.' },
  { name:'Ana L.', status:'Em rota · Centro', count:9, color:'#6c63ff', initials:'AL', rating:'4.8', review:'Chegou antes do previsto e cuidadosa com os pedidos.' },
  { name:'Paulo R.', status:'Disponível', count:7, color:'#ff9f43', initials:'PR', rating:'4.7', review:'Cliente elogiou a simpatia e o cuidado nas entregas.' },
  { name:'Bruna S.', status:'Pausa', count:5, color:'#54a0ff', initials:'BS', rating:'4.6', review:'Atendimento impecável e entrega no prazo.' },
];
document.getElementById('driversList').innerHTML = drivers.map(d => `
  <div class="driver-card">
    <div class="driver-avatar" style="background:${d.color}22;color:${d.color}">${d.initials}</div>
    <div>
      <div class="driver-name">${d.name}</div>
      <div class="driver-status">${d.status}</div>
      <div class="driver-review"><span class="driver-rating">★ ${d.rating}</span> ${d.review}</div>
    </div>
    <div class="driver-deliveries">
      <div class="driver-count">${d.count}</div>
      <div class="driver-label">entregas</div>
    </div>
  </div>
`).join('');

// New order form
function toggleForm() {
  document.getElementById('newOrderForm').classList.toggle('visible');
}
function addOrder() {
  const client = document.getElementById('fi-client').value || 'Novo Cliente';
  const addr = document.getElementById('fi-addr').value || 'Endereço não informado';
  const items = document.getElementById('fi-items').value || '?';
  const value = document.getElementById('fi-value').value || '0';
  addOrderToList({
    num: '#' + (5000 + Math.floor(Math.random()*1000)),
    client,
    addr,
    status: 'route',
    statusLabel: 'Roteado',
    value: 'R$' + value,
    time: 'agora'
  });
  document.getElementById('fi-client').value = '';
  document.getElementById('fi-addr').value = '';
  document.getElementById('fi-items').value = '';
  document.getElementById('fi-value').value = '';
  document.getElementById('newOrderForm').classList.remove('visible');
  // Atualizar mapa e rotas
  loadOrdersOnMap();
  optimizeRoutes();
}

// Inicializar mapa quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  initMap();
  optimizeRoutes();
});

// Auto-simulate incoming order after 5s
setTimeout(() => showNotif(), 5000);
