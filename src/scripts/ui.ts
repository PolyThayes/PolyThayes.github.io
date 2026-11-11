// Site-wide behaviour: scroll reveals, sticky header, mobile menu, and the
// little brass loading line that runs during page transitions.

let observer: IntersectionObserver | undefined;

function setupReveals() {
  observer?.disconnect();
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          observer?.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  els.forEach((el) => observer!.observe(el));
}

function setupHeader() {
  const onScroll = () => document.documentElement.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.removeEventListener('scroll', (window as any).__hdr);
  (window as any).__hdr = onScroll;
  window.addEventListener('scroll', onScroll, { passive: true });
}

function setupMenu() {
  const header = document.querySelector('.site-header');
  const btn = header?.querySelector<HTMLButtonElement>('.menu-btn');
  const menu = header?.querySelector<HTMLElement>('.mobile-menu');
  if (!header || !btn || !menu) return;
  const close = () => {
    header.classList.remove('menu-open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => (menu.hidden = true), 450);
  };
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => header.classList.add('menu-open')));
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else close();
  });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') close();
  });
}

document.addEventListener('astro:page-load', () => {
  document.documentElement.classList.add('js');
  setupReveals();
  setupHeader();
  setupMenu();
});

document.addEventListener('astro:before-preparation', () => {
  const html = document.documentElement;
  html.classList.remove('nav-done');
  html.classList.add('is-navigating');
});

document.addEventListener('astro:after-swap', () => {
  const html = document.documentElement;
  html.classList.add('js', 'is-navigating');
  requestAnimationFrame(() => {
    html.classList.remove('is-navigating');
    html.classList.add('nav-done');
  });
});
