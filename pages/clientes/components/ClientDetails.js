export function clientDetailsTemplate(client){
  if(!client) return '';
  const formattedDate = client.createdAt || '';
  return `
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div>
        <div style="font-weight:700;font-size:16px">${client.name}</div>
        <div style="color:var(--muted)">${client.email} • ${client.phone}</div>
      </div>
      <div style="text-align:right;color:var(--muted)">Cadastrado: ${formattedDate}</div>
    </div>
    <hr style="border:none;border-top:1px solid var(--border);margin:12px 0">
    <div style="font-size:13px">Endereço</div>
    <div style="color:var(--muted);margin-top:6px">${client.address || '—'}</div>
    <div style="margin-top:12px;font-size:13px">Observações</div>
    <div style="color:var(--muted);margin-top:6px">${client.notes || '—'}</div>
  `;
}
