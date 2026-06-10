import assert from 'node:assert/strict';
import { initClients, selectClient, subscribe } from '../pages/clientes/hooks/useClients.js';

const states = [];
const unsubscribe = subscribe(state => {
  states.push({
    selectedId: state.selectedId,
    selectedName: state.selected?.name,
    selectedPhone: state.selected?.phone
  });
});

await initClients();

selectClient('c1');
selectClient('c2');
selectClient('c1');

const selectedEvents = states.filter(state => state.selectedId);
assert.deepEqual(
  selectedEvents.slice(-3).map(state => ({ selectedId: state.selectedId, selectedPhone: state.selectedPhone })),
  [
    { selectedId: 'c1', selectedPhone: '+55 11 99999-0001' },
    { selectedId: 'c2', selectedPhone: '+55 11 98888-0002' },
    { selectedId: 'c1', selectedPhone: '+55 11 99999-0001' }
  ],
  'client details must follow the active selection during rapid switching'
);

unsubscribe();
console.log('client state rapid-selection test passed');
