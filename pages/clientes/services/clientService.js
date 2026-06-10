let DB = [
  { id: 'c1', name: 'ACME Ltda', email:'acme@acme.com', phone:'+55 11 99999-0001', status:'active', orders:[], address:'Rua A, 123', createdAt:'2024-01-02', notes:'' },
  { id: 'c2', name: 'Beta Comércio', email:'beta@ex.com', phone:'+55 11 98888-0002', status:'inactive', orders:[], address:'Av B, 456', createdAt:'2024-02-12', notes:'' },
  { id: 'c3', name: 'Café Tradição', email:'contato@cafetradicao.com.br', phone:'+55 11 97777-3333', status:'active', orders:[], address:'Rua das Flores, 87', createdAt:'2024-03-18', notes:'Cliente frequente de entregas matinais.' },
  { id: 'c4', name: 'Mercado Central', email:'vendas@mercadocentral.com.br', phone:'+55 11 96666-4444', status:'active', orders:[], address:'Av. São João, 1120', createdAt:'2024-04-05', notes:'Solicita relatórios de performance semanais.' },
  { id: 'c5', name: 'Padaria Pão Quente', email:'pedidos@paoque.com.br', phone:'+55 11 95555-5555', status:'active', orders:[], address:'Rua do Sol, 230', createdAt:'2024-05-10', notes:'Entrega prioritária às 8h30.' }
];

export async function fetchClients(){ await new Promise(r=>setTimeout(r,60)); return JSON.parse(JSON.stringify(DB)); }
export function getSummary(clients){ return { total: clients.length, active: clients.filter(c=>c.status==='active').length, orders: clients.reduce((s,c)=>s+(c.orders?c.orders.length:0),0), completed: clients.reduce((s,c)=>s + (c.orders? c.orders.filter(o=>o.status==='delivered').length:0),0) }; }

export async function addClient(payload){ payload.id = 'c'+(Math.random()*100000|0); DB.unshift(payload); }
export async function updateClient(payload){ DB = DB.map(c=> c.id===payload.id? {...c,...payload}: c); }
export async function deleteClient(id){ DB = DB.filter(c=>c.id!==id); }

export async function addOrder(clientId, order){ const c = DB.find(d=>d.id===clientId); if(!c.orders) c.orders = []; order.id = 'o'+(Math.random()*100000|0); c.orders.push(order); }
export async function updateOrder(clientId, order){ const c = DB.find(d=>d.id===clientId); if(!c) return; c.orders = c.orders.map(o=> o.id===order.id? {...o,...order}: o); }
export async function deleteOrder(clientId, orderId){ const c = DB.find(d=>d.id===clientId); if(!c) return; c.orders = c.orders.filter(o=>o.id!==orderId); }
