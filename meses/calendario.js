document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0–11

  document.querySelectorAll('.day').forEach(day => {
    const dia = parseInt(day.dataset.dia, 10);
    if (isNaN(dia)) return;

    const dayDate = new Date(currentYear, currentMonth, dia);
    dayDate.setHours(0, 0, 0, 0);

    if (dayDate < today) {
      day.remove(); // ou classList.add('hidden')
    }
  });
});
