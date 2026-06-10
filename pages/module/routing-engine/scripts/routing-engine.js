function updateClock() {
  const clock = document.getElementById('clock');
  if (clock) clock.textContent = new Date().toLocaleTimeString('pt-BR');
}

document.getElementById('reassignBtn').addEventListener('click', () => {
  const refusals = document.getElementById('refusals');
  refusals.textContent = String(Number(refusals.textContent) + 1);
});

setInterval(updateClock, 1000);
updateClock();
