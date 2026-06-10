export function formatStatusLabel(status) {
  return {
    active: 'Ativo',
    on_route: 'Em rota',
    offline: 'Offline',
    paused: 'Pausado'
  }[status] || 'Desconhecido';
}

export function formatAvailabilityLabel(value) {
  return {
    available: 'Disponível',
    busy: 'Ocupado',
    unavailable: 'Indisponível'
  }[value] || 'Indefinido';
}

export function getInitials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

export function formatDateTime(value) {
  const date = new Date(value);
  return date.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
  });
}
