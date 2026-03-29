// Smooth page transitions
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-loaded');
});

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('blob:') || href.startsWith('data:')) return;
  e.preventDefault();
  document.body.classList.remove('page-loaded');
  setTimeout(() => { window.location.href = href; }, 220);
});
