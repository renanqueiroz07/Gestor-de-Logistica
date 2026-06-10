export function reportsTableTemplate(orders=[]){
  return `
    <table class="reports-table">
      <thead><tr><th>#</th><th>Pedido</th><th>Cliente</th><th>Entregador</th><th>Status</th><th>Valor</th><th>Data</th><th>Tempo (min)</th></tr></thead>
      <tbody>
        ${orders.map(o=>`<tr><td>${o.id}</td><td>${o.number}</td><td>${o.client}</td><td>${o.deliverer||'—'}</td><td>${o.status}</td><td>R$ ${o.value.toFixed(2)}</td><td>${o.date}</td><td>${o.timeToDeliver||'—'}</td></tr>`).join('')}
      </tbody>
    </table>
  `;
}
