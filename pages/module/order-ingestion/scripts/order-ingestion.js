const stream = [
  ['whatsapp', '#WA-8841', 'queued'],
  ['ifood', '#IFOOD-5520', 'validated'],
  ['keeta', '#KTA-1120', 'processing'],
  ['99delivery', '#99-7719', 'retrying']
];

function updateClock() {
  const clock = document.getElementById('clock');
  if (clock) clock.textContent = new Date().toLocaleTimeString('pt-BR');
}

function renderStream() {
  document.getElementById('streamList').innerHTML = stream.map(([source, id, status]) => `
    <div class="stream-item"><span class="source-pill">${source}</span><strong>${id}</strong><span class="status-pill">${status}</span></div>
  `).join('');
}

document.getElementById('simulateOrder').addEventListener('click', () => {
  const sources = ['whatsapp', 'ifood', '99delivery', 'keeta'];
  stream.unshift([sources[Math.floor(Math.random() * sources.length)], `#SIM-${Math.floor(Math.random() * 9000)}`, 'queued']);
  document.getElementById('queuedCount').textContent = String(Number(document.getElementById('queuedCount').textContent) + 1);
  renderStream();
});

setInterval(updateClock, 1000);
updateClock();
renderStream();
