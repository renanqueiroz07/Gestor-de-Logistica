function updateClock() {
  const clock = document.getElementById('clock');
  if (clock) clock.textContent = new Date().toLocaleTimeString('pt-BR');
}

const THEME_STORAGE_KEY = window.dashboardTheme?.storageKey || 'dashboardThemeSettings';
const defaultPalette = {
  accent: '#ff6b13',
  accent2: '#073b72',
  warn: '#f59e0b',
  info: '#0b4f93'
};

const themeButtons = document.querySelectorAll('.seg-btn');
const colorInputs = {
  accent: document.getElementById('colorAccent'),
  accent2: document.getElementById('colorAccent2'),
  warn: document.getElementById('colorWarn'),
  info: document.getElementById('colorInfo')
};

function getSavedSettings() {
  if (window.dashboardTheme) return window.dashboardTheme.readSettings();

  try {
    return JSON.parse(localStorage.getItem(THEME_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function getCurrentPalette() {
  return Object.fromEntries(
    Object.entries(colorInputs).map(([key, input]) => [key, input?.value || defaultPalette[key]])
  );
}

function setActiveThemeButton(theme) {
  themeButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.theme === theme);
  });
}

function applyTheme(theme) {
  document.documentElement.classList.toggle('light-mode', theme === 'light');
  document.documentElement.classList.toggle('dark-mode', theme === 'dark');
  document.body.classList.toggle('light-mode', theme === 'light');
  document.body.classList.toggle('dark-mode', theme === 'dark');
  setActiveThemeButton(theme);
}

function applyPalette(palette) {
  [document.documentElement, document.body].forEach(root => {
    root.style.setProperty('--accent', palette.accent);
    root.style.setProperty('--brand', palette.accent);
    root.style.setProperty('--accent2', palette.accent2);
    root.style.setProperty('--warn', palette.warn);
    root.style.setProperty('--info', palette.info);
  });
}

let activeTheme = 'light';

function hydrateSettings() {
  const saved = getSavedSettings();
  activeTheme = saved.theme || 'light';
  const palette = { ...defaultPalette, ...(saved.palette || {}) };

  Object.entries(colorInputs).forEach(([key, input]) => {
    if (input) input.value = palette[key];
  });

  applyTheme(activeTheme);
  applyPalette(palette);
}

document.querySelectorAll('.seg-btn').forEach(button => {
  button.addEventListener('click', () => {
    activeTheme = button.dataset.theme;
    applyTheme(activeTheme);
    const palette = getCurrentPalette();
    if (window.dashboardTheme) {
      window.dashboardTheme.save({ theme: activeTheme, palette });
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ theme: activeTheme, palette }));
    }
  });
});

document.getElementById('saveSettings').addEventListener('click', () => {
  const palette = getCurrentPalette();
  applyTheme(activeTheme);
  applyPalette(palette);
  if (window.dashboardTheme) {
    window.dashboardTheme.save({ theme: activeTheme, palette });
  } else {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ theme: activeTheme, palette }));
  }

  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
});

setInterval(updateClock, 1000);
updateClock();
hydrateSettings();
