const events = [
  ['Carlos M.', 'aceitou rota #RT-8841', 'agora'],
  ['Felipe A.', 'enviou GPS -23.55,-46.63', '10s'],
  ['Rodrigo S.', 'registrou comprovante de entrega', '38s']
];

function updateClock() {
  const clock = document.getElementById('clock');
  if (clock) clock.textContent = new Date().toLocaleTimeString('pt-BR');
}

function renderEvents() {
  document.getElementById('driverEvents').innerHTML = events.map(([driver, action, time]) => `
    <div class="stream-item"><span class="source-pill">${driver}</span><strong>${action}</strong><span class="status-pill">${time}</span></div>
  `).join('');
}

document.getElementById('syncBtn').addEventListener('click', () => {
  events.unshift(['Offline queue', 'sincronizou 3 eventos pendentes', 'agora']);
  renderEvents();
});

setInterval(updateClock, 1000);
updateClock();
renderEvents();
