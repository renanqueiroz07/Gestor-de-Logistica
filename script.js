/* ── STEP INTERATIVO ── */
function activateStep(el) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
}

/* ── RANGE SLIDERS ── */
function updateRange(input, labelId) {
  const val = input.value;
  const pct = ((val - 1) / 29 * 100).toFixed(0) + '%';
  input.style.setProperty('--pct', pct);
  const lbl = document.getElementById(labelId);
  if (lbl) lbl.textContent = val;
}

/* ── TABS DO FORMULÁRIO ── */
function switchTab(btn, tab) {
  document.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-empresa').style.display = tab === 'empresa' ? '' : 'none';
  document.getElementById('tab-motoboy').style.display = tab === 'motoboy' ? '' : 'none';
}

/* ── MODAL ── */
function openModal() { document.getElementById('modalOverlay').classList.add('open'); }
function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }
document.getElementById('modalOverlay').addEventListener('click', function(e) { if(e.target===this) closeModal(); });

function getFormType() {
  const activeTab = document.querySelector('.form-tab.active');
  return activeTab && activeTab.textContent.toLowerCase().includes('estabelecimento') ? 'empresa' : 'motoboy';
}

function handleFormSubmit(event) {
  event.preventDefault();
  const type = getFormType();
  let message = '';

  if (type === 'empresa') {
    const empresa = {
      responsavel: document.getElementById('nomeResponsavel').value,
      estabelecimento: document.getElementById('nomeEstabelecimento').value,
      segmento: document.getElementById('segmentoEmpresa').value,
      cidade: document.getElementById('cidadeEmpresa').value,
      telefone: document.getElementById('telefoneEmpresa').value,
      email: document.getElementById('emailEmpresa').value,
      demanda: document.getElementById('demandaEmpresa').value,
    };
    message = `Obrigado, ${empresa.responsavel}! Sua solicitação para ${empresa.estabelecimento} foi recebida. Nossa equipe entrará em contato pelo WhatsApp ${empresa.telefone} ou e-mail ${empresa.email} em até 2 horas úteis para ajustar sua demanda de ${empresa.demanda}.`;
  } else {
    const motoboy = {
      nome: document.getElementById('nomeMotoboy').value,
      cpf: document.getElementById('cpfMotoboy').value,
      telefone: document.getElementById('telefoneMotoboy').value,
      cidade: document.getElementById('cidadeMotoboy').value,
      cnh: document.getElementById('cnhMotoboy').value,
    };
    message = `Obrigado, ${motoboy.nome}! Seu cadastro de motoboy foi enviado com sucesso. Nós vamos analisar seu perfil com CNH ${motoboy.cnh} e entrar em contato pelo número ${motoboy.telefone} em até 2 horas úteis.`;
  }

  const modalTitle = document.querySelector('#modalOverlay .modal-box h3');
  const modalText = document.querySelector('#modalOverlay .modal-box p');
  if (modalTitle) modalTitle.textContent = 'Solicitação enviada!';
  if (modalText) modalText.textContent = message;

  openModal();
  event.target.reset();
}

const contactForm = document.getElementById('contactForm');
if (contactForm) contactForm.addEventListener('submit', handleFormSubmit);

/* ── BAR CHART ── */
const horas = ['11h','12h','13h','14h','15h','16h','17h','18h','19h','20h','21h','22h'];
const vals  = [12,28,45,38,52,67,85,92,78,65,48,30];
const maxV  = Math.max(...vals);
const chart = document.getElementById('barChart');
if (chart) {
  horas.forEach((h, i) => {
    const col = document.createElement('div');
    col.className = 'bar-chart-col';
    const pct = (vals[i] / maxV * 65).toFixed(0);
    const isNow = i === 9;
    col.innerHTML = `
      <div class="bar-chart-bar" style="height:${pct}px; background:${isNow ? 'var(--red)' : '#ddd9d0'}"></div>
      <div class="bar-chart-label" style="color:${isNow ? 'var(--red)':'var(--ink3)'}">${h}</div>
    `;
    chart.appendChild(col);
  });
}

/* ── SCROLL REVEAL ── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.modelo-card, .plano-card, .feature-item, .step, .kpi, .testi-card').forEach(el => {
  el.style.opacity='0'; el.style.transform='translateY(16px)';
  el.style.transition='opacity 0.45s ease, transform 0.45s ease';
  obs.observe(el);
});

/* ── TOGGLE DIAS CONFIG ── */
document.querySelectorAll('.day-toggle input').forEach(cb => {
  cb.addEventListener('change', () => {
    const row = cb.closest('.day-config-row');
    row.classList.toggle('inactive', !cb.checked);
  });
});

// Recuperar tema global configurado no dashboard.
let dashboardThemeSettings = {};
try {
  dashboardThemeSettings = JSON.parse(localStorage.getItem('dashboardThemeSettings') || '{}');
} catch {
  dashboardThemeSettings = {};
}
const savedTheme = dashboardThemeSettings.theme || localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
document.documentElement.classList.toggle('dark-mode', savedTheme === 'dark');
document.documentElement.classList.toggle('light-mode', savedTheme !== 'dark');
