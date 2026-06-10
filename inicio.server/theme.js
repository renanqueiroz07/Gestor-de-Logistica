(function () {
  const THEME_STORAGE_KEY = 'dashboardThemeSettings';
  const fallbackPalette = {
    accent: '#ff6b13',
    accent2: '#073b72',
    warn: '#f59e0b',
    info: '#0b4f93'
  };

  function readSettings() {
    try {
      return JSON.parse(localStorage.getItem(THEME_STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function applyThemeSettings(settings) {
    const theme = settings.theme === 'dark' ? 'dark' : 'light';
    const palette = { ...fallbackPalette, ...(settings.palette || {}) };
    const targets = [document.documentElement, document.body].filter(Boolean);

    targets.forEach(target => {
      target.classList.toggle('light-mode', theme === 'light');
      target.classList.toggle('dark-mode', theme === 'dark');
      target.setAttribute('data-theme', theme);
      target.style.setProperty('--accent', palette.accent);
      target.style.setProperty('--brand', palette.accent);
      target.style.setProperty('--accent2', palette.accent2);
      target.style.setProperty('--warn', palette.warn);
      target.style.setProperty('--info', palette.info);
    });
  }

  window.dashboardTheme = {
    storageKey: THEME_STORAGE_KEY,
    readSettings,
    apply: function (settings) {
      applyThemeSettings(settings || readSettings());
    },
    save: function (settings) {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(settings));
      applyThemeSettings(settings);
    }
  };

  if (document.body) {
    window.dashboardTheme.apply();
  } else {
    document.addEventListener('DOMContentLoaded', () => window.dashboardTheme.apply());
  }
})();
