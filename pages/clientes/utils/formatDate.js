export function formatDate(d){ if(!d) return ''; try{ const dt = new Date(d); return dt.toLocaleDateString(); }catch(e){ return d; } }
