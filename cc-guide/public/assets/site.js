(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('[data-theme-toggle]');
  const saved = localStorage.getItem('cc-guide-theme');
  if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;

  function themeName() {
    const explicit = root.dataset.theme;
    const dark = explicit ? explicit === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    return dark ? 'ダーク' : 'ライト';
  }
  function updateThemeLabel() {
    if (themeButton) themeButton.setAttribute('aria-label', `${themeName()}表示を切り替える`);
  }
  themeButton?.addEventListener('click', () => {
    const next = themeName() === 'ダーク' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('cc-guide-theme', next);
    updateThemeLabel();
  });
  updateThemeLabel();

  const navButton = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  navButton?.addEventListener('click', () => {
    const open = nav?.dataset.open !== 'true';
    if (nav) nav.dataset.open = String(open);
    navButton.setAttribute('aria-expanded', String(open));
  });
  nav?.addEventListener('click', () => {
    nav.dataset.open = 'false';
    navButton?.setAttribute('aria-expanded', 'false');
  });

  document.querySelectorAll('[data-copy-target]').forEach((button) => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-copy-target');
      const target = id && document.getElementById(id);
      if (!target) return;
      const value = target.textContent.replace(/^\n|\n$/g, '');
      try {
        await navigator.clipboard.writeText(value);
        button.textContent = 'コピー済み';
        button.dataset.state = 'copied';
        setTimeout(() => { button.textContent = 'コピー'; delete button.dataset.state; }, 1800);
      } catch {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(target);
        selection.removeAllRanges();
        selection.addRange(range);
        button.textContent = '選択しました';
      }
    });
  });

  function measureOverflow() {
    root.dataset.hscroll = String(root.scrollWidth > root.clientWidth + 1);
    root.dataset.viewport = String(root.clientWidth);
  }
  addEventListener('load', measureOverflow);
  addEventListener('resize', measureOverflow);
  measureOverflow();
})();

