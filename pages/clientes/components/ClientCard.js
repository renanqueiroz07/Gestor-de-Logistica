export function clientCardTemplate(client, selected=false){
  return `
    <div class="client-card" data-id="${client.id}">
      <div style="width:44px;height:44px;border-radius:10px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-weight:700">${client.name.split(' ')[0][0]||''}</div>
      <div style="flex:1">
        <div class="client-name">${client.name}</div>
        <div class="client-meta">${client.email || ''} • ${client.phone || ''}</div>
      </div>
      <div style="text-align:right">
        <div class="client-meta">Pedidos: ${client.orders ? client.orders.length : 0}</div>
        <div class="client-meta">${client.status}</div>
      </div>
    </div>
  `;
}
