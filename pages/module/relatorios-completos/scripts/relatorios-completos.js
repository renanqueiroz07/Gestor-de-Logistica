const reportData = {
  diario: {
    title: 'Resumo Diario',
    subtitle: 'Hoje vs. dia anterior, alertas de variacao e top performers',
    labels: ['06h','08h','10h','12h','14h','16h','18h','20h'],
    values: [38, 54, 81, 136, 118, 144, 171, 159],
    kpis: [['Pedidos hoje','901','+14% vs ontem'], ['SLA no prazo','96,4%','+2,1 p.p.'], ['Receita','R$ 42,8k','+9% vs ontem'], ['Tempo medio','24min','-3min vs ontem']],
    mix: [['Food service',42,'#00d4aa'], ['Farmacias',28,'#6c63ff'], ['Varejo local',18,'#ff9f43'], ['Outros',12,'#54a0ff']],
    ranking: [['Bella Napoli',98], ['FarmaViva Centro',84], ['Mercado Prime',73], ['Sushi Norte',66]],
    insights: [['good','Top performer Carlos M. concluiu 46 entregas com 98% de pontualidade.'], ['risk','Zona Oeste teve aumento de 11% em atrasos entre 18h e 20h.'], ['meta','Receita diaria esta 7% acima da meta operacional.']],
    rows: [['Hoje',901,869,'96,4%','R$ 42.800','31%','Carlos M.',12], ['Ontem',790,742,'94,3%','R$ 39.200','29%','Rodrigo S.',18], ['D-2',812,770,'94,8%','R$ 40.100','30%','Felipe A.',15]]
  },
  semanal: {
    title: 'Resumo Semanal',
    subtitle: 'Comparativo semana a semana, tendencias e metas atingidas',
    labels: ['Seg','Ter','Qua','Qui','Sex','Sab','Dom'],
    values: [620, 690, 735, 768, 890, 1240, 1188],
    kpis: [['Pedidos semana','6.131','+11% WoW'], ['Metas atingidas','6 de 8','75%'], ['SLA medio','95,8%','+1,4 p.p.'], ['Ticket medio','R$ 48,10','+5% WoW']],
    mix: [['Food service',48,'#00d4aa'], ['Farmacias',22,'#6c63ff'], ['Varejo local',20,'#ff9f43'], ['Outros',10,'#54a0ff']],
    ranking: [['Pizzarias',92], ['Farmacias',76], ['Mercados',71], ['Dark kitchens',63]],
    insights: [['good','Sabado superou a meta em 18% com reforco automatico de escala.'], ['meta','Semana atual esta 9% acima da media movel de quatro semanas.'], ['risk','Duas metas de tempo medio nao foram atingidas no turno noturno.']],
    rows: [['Semana atual',6131,5869,'95,8%','R$ 294.900','32%','Equipe Norte',43], ['Semana anterior',5520,5186,'93,9%','R$ 265.400','30%','Equipe Centro',59], ['Media 4 semanas',5344,5065,'94,8%','R$ 251.700','29%','Equipe Sul',51]]
  },
  mensal: {
    title: 'Resumo Mensal',
    subtitle: 'Visao consolidada do mes, evolucao e ranking por categoria',
    labels: ['Sem 1','Sem 2','Sem 3','Sem 4','Sem 5'],
    values: [5210, 5480, 6120, 6640, 7010],
    kpis: [['Pedidos mes','30.460','+16% MoM'], ['Receita mes','R$ 1,47M','+13% MoM'], ['Margem','33,2%','+2,8 p.p.'], ['Churn clientes','1,6%','-0,4 p.p.']],
    mix: [['Food service',45,'#00d4aa'], ['Farmacias',26,'#6c63ff'], ['Varejo local',19,'#ff9f43'], ['Outros',10,'#54a0ff']],
    ranking: [['Food service',96], ['Farmacias',82], ['Varejo local',74], ['Assinaturas especiais',58]],
    insights: [['good','Crescimento mensal sustentado por aumento de recorrencia em clientes ativos.'], ['meta','Meta de margem foi superada em 2,2 pontos percentuais.'], ['risk','Ocorrencias por endereco incompleto concentradas em tres tenants.']],
    rows: [['Mes atual',30460,29125,'95,6%','R$ 1.470.000','33,2%','Food service',210], ['Mes anterior',26280,24770,'94,3%','R$ 1.301.000','30,4%','Farmacias',248], ['Meta mensal',28800,27648,'96,0%','R$ 1.390.000','31,0%','Food service',190]]
  },
  trimestral: {
    title: 'Resumo Trimestral',
    subtitle: 'Analise por trimestre, crescimento percentual e insights estrategicos',
    labels: ['Jan','Fev','Mar'],
    values: [98400, 108200, 121900],
    kpis: [['Pedidos tri','328,5k','+21% QoQ'], ['Receita tri','R$ 15,8M','+18% QoQ'], ['Expansao','42 tenants','+12 novos'], ['Retencao','97,1%','+1,3 p.p.']],
    mix: [['Food service',43,'#00d4aa'], ['Farmacias',29,'#6c63ff'], ['Varejo local',17,'#ff9f43'], ['Outros',11,'#54a0ff']],
    ranking: [['Expansao regional',91], ['SLA premium',86], ['Receita recorrente',80], ['Cross-sell',68]],
    insights: [['good','Crescimento trimestral puxado por redes multiunidade e contratos premium.'], ['meta','Retencao acima da meta reforca previsibilidade de receita.'], ['risk','Custo de cobertura subiu 6% em praca com baixa densidade.']],
    rows: [['Trimestre atual',328500,314376,'95,7%','R$ 15.800.000','34,1%','Expansao regional',1460], ['Trimestre anterior',271400,254845,'93,9%','R$ 13.390.000','31,8%','SLA premium',1712], ['Meta trimestral',310000,297600,'96,0%','R$ 15.100.000','33,0%','Receita recorrente',1350]]
  },
  semestral: {
    title: 'Resumo Semestral',
    subtitle: 'Visao de longo prazo, projecoes e comparativo entre semestres',
    labels: ['S1 M1','S1 M2','S1 M3','S1 M4','S1 M5','S1 M6'],
    values: [86000, 91200, 98400, 105900, 112500, 121900],
    kpis: [['Pedidos semestre','616k','+24% vs S2'], ['Receita','R$ 29,4M','+20% vs S2'], ['Projecao anual','R$ 64,8M','run rate'], ['NPS clientes','72','+8 pontos']],
    mix: [['Food service',44,'#00d4aa'], ['Farmacias',27,'#6c63ff'], ['Varejo local',18,'#ff9f43'], ['Outros',11,'#54a0ff']],
    ranking: [['Receita recorrente',94], ['Crescimento organico',88], ['Eficiência de escala',82], ['Novas pracas',69]],
    insights: [['good','Projecao anual indica superacao de 12% sobre o plano aprovado.'], ['meta','Segundo trimestre acelerou crescimento sem queda de SLA.'], ['risk','Expansao de novas pracas exige monitoramento de margem e cache de roteirizacao.']],
    rows: [['Semestre atual',616000,589512,'95,7%','R$ 29.400.000','33,8%','Receita recorrente',2810], ['Semestre anterior',496800,462024,'93,0%','R$ 24.500.000','30,5%','Crescimento organico',3490], ['Projecao anual',1320000,1267200,'96,0%','R$ 64.800.000','34,2%','Eficiência de escala',5200]]
  }
};

let currentReport = 'diario';

function moneyAware(value) {
  return String(value).replace('.', ',');
}

function renderKpis(data) {
  document.getElementById('kpiGrid').innerHTML = data.kpis.map(([label, value, sub]) => `
    <div class="metric-card">
      <div class="metric-label">${label}</div>
      <div class="metric-value">${value}</div>
      <div class="metric-sub"><span class="${sub.includes('-') ? 'down' : 'up'}">${sub}</span></div>
    </div>
  `).join('');
}

function renderLine(data) {
  const values = data.values;
  const max = Math.max(...values) * 1.12;
  const min = Math.min(...values) * 0.88;
  const points = values.map((value, index) => {
    const x = 44 + index * (552 / (values.length - 1));
    const y = 184 - ((value - min) / (max - min)) * 140;
    return [x, y, value, data.labels[index]];
  });
  const path = points.map(([x, y], index) => `${index ? 'L' : 'M'} ${x} ${y}`).join(' ');
  const area = `${path} L ${points.at(-1)[0]} 190 L ${points[0][0]} 190 Z`;
  document.getElementById('lineChart').innerHTML = `
    <line class="axis" x1="40" y1="190" x2="612" y2="190"></line>
    <line class="axis" x1="40" y1="36" x2="40" y2="190"></line>
    <path class="trend-area" d="${area}"></path>
    <path class="trend-line" d="${path}"></path>
    ${points.map(([x, y, value, label]) => `<circle class="chart-point" cx="${x}" cy="${y}" r="5"></circle><text class="chart-label" x="${x - 12}" y="210">${label}</text><text class="chart-label" x="${x - 18}" y="${y - 12}">${moneyAware(value)}</text>`).join('')}
  `;
}

function renderMix(data) {
  let cursor = 0;
  const stops = data.mix.map(([, value, color]) => {
    const start = cursor;
    cursor += value;
    return `${color} ${start}% ${cursor}%`;
  }).join(', ');
  document.getElementById('donutChart').style.background = `conic-gradient(${stops})`;
  document.getElementById('donutLegend').innerHTML = data.mix.map(([label, value, color]) => `
    <div class="legend-row"><span class="legend-dot" style="background:${color}"></span><strong>${label}</strong><span style="margin-left:auto;color:var(--muted)">${value}%</span></div>
  `).join('');
}

function renderLists(data) {
  document.getElementById('rankingList').innerHTML = data.ranking.map(([label, value]) => `
    <div class="ranking-row"><div class="ranking-head"><span>${label}</span><span>${value}%</span></div><div class="bar-track"><div class="bar-fill" style="width:${value}%"></div></div></div>
  `).join('');
  document.getElementById('insightsList').innerHTML = data.insights.map(([type, text]) => `
    <div class="insight-row"><span class="insight-tag ${type}">${type}</span><span>${text}</span></div>
  `).join('');
}

function renderRows(data) {
  document.getElementById('detailRows').innerHTML = data.rows.map(row => `
    <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
  `).join('');
}

function renderReport(key) {
  currentReport = key;
  const data = reportData[key];
  document.getElementById('trendTitle').textContent = data.title;
  document.getElementById('trendSubtitle').textContent = data.subtitle;
  renderKpis(data);
  renderLine(data);
  renderMix(data);
  renderLists(data);
  renderRows(data);
}

function exportCsv() {
  const rows = [['Periodo','Pedidos','Concluidos','SLA','Receita','Margem','Top performer','Ocorrencias'], ...reportData[currentReport].rows];
  const csv = rows.map(row => row.map(cell => `"${String(cell).replaceAll('"','""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `relatorio_${currentReport}_${new Date().toISOString().slice(0,10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function updateClock() {
  const clock = document.getElementById('clock');
  if (clock) clock.textContent = new Date().toLocaleTimeString('pt-BR');
}

document.querySelectorAll('.tab-btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    renderReport(button.dataset.report);
  });
});

document.getElementById('exportCsv').addEventListener('click', exportCsv);
document.getElementById('exportPdf').addEventListener('click', () => window.print());
setInterval(updateClock, 1000);
updateClock();
const initialReport = new URLSearchParams(window.location.search).get('report');
if (initialReport && reportData[initialReport]) {
  const button = document.querySelector(`[data-report="${initialReport}"]`);
  document.querySelectorAll('.tab-btn').forEach(item => item.classList.remove('active'));
  if (button) button.classList.add('active');
  renderReport(initialReport);
} else {
  renderReport(currentReport);
}
