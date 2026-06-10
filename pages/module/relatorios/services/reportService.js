const sampleOrders = [
  { id:'o1', number:'1001', client:'Loja Alpha', deliverer:'D1', status:'done', value:120.5, date:'2026-05-10', timeToDeliver:25 },
  { id:'o2', number:'1002', client:'Padaria Beta', deliverer:'D2', status:'pending', value:45.0, date:'2026-05-12', timeToDeliver:0 },
  { id:'o3', number:'1003', client:'Loja Alpha', deliverer:'D1', status:'canceled', value:0, date:'2026-04-30', timeToDeliver:0 }
];

export async function fetchOrders(){ return JSON.parse(JSON.stringify(sampleOrders)); }

export function getSummary(list){
  const totalOrders = list.length;
  const completed = list.filter(o=>o.status==='done').length;
  const pending = list.filter(o=>o.status==='pending').length;
  const canceled = list.filter(o=>o.status==='canceled').length;
  const activeDeliverers = Array.from(new Set(list.filter(o=>o.deliverer).map(o=>o.deliverer))).length;
  const monthRevenue = list.reduce((s,o)=> s + (o.status==='done'?o.value:0), 0);
  return { totalOrders, completed, pending, canceled, activeDeliverers, monthRevenue };
}
