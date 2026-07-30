const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.main-nav');
menuButton?.addEventListener('click', () => {
  const open = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
});
navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

const themeToggle = document.querySelector('.theme-toggle');
const setTheme = (dark) => {
  document.body.classList.toggle('dark-mode', dark);
  themeToggle?.setAttribute('aria-pressed', String(dark));
  if (themeToggle) themeToggle.innerHTML = `<i class="fa-solid fa-${dark ? 'sun' : 'moon'}"></i>`;
};
setTheme(localStorage.getItem('istools-theme') === 'dark');
themeToggle?.addEventListener('click', () => {
  const dark = !document.body.classList.contains('dark-mode');
  localStorage.setItem('istools-theme', dark ? 'dark' : 'light');
  setTheme(dark);
});

document.querySelector('[data-copy-hash]')?.addEventListener('click', async (event) => {
  const button = event.currentTarget;
  const hash = document.getElementById('download-hash')?.textContent?.trim();
  if (!hash) return;
  try {
    await navigator.clipboard.writeText(hash);
    button.innerHTML = '<i class="fa-solid fa-check"></i> Copiado';
    setTimeout(() => { button.innerHTML = '<i class="fa-regular fa-copy"></i> Copiar'; }, 1800);
  } catch {
    window.prompt('Copie o SHA-256:', hash);
  }
});
