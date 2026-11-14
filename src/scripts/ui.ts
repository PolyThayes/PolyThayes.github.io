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

// ── The evolution line ────────────────────────────────────────────────
// Always shown, fully painted. On the first visit it paints itself in from
// the left (gilt → Impressionism → De Stijl → Pollock → pixels). While the
// next page loads it starts again from the left and creeps forward, then
// finishes the moment the new page arrives.
const calm = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const line = () => document.querySelector<SVGElement>('.nav-progress .timeline-rule');
const EASE = 'cubic-bezier(0.6, 0, 0.2, 1)';
let creeping: Animation | undefined;

function paintIn(duration = 1400) {
  const el = line();
  if (!el || calm()) return;
  el.animate([{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration, easing: EASE });
}

/** Finish the line from wherever it has got to. */
function finishLine() {
  const el = line();
  if (!el || !creeping) return;
  const from = getComputedStyle(el).clipPath || 'inset(0 100% 0 0)';
  creeping.cancel();
  creeping = undefined;
  el.animate([{ clipPath: from }, { clipPath: 'inset(0 0 0 0)' }], { duration: 450, easing: 'ease-out' });
}

let firstLoad = true;
document.addEventListener('astro:page-load', () => {
  if (firstLoad) paintIn(1600);
  firstLoad = false;
  finishLine(); // safety net: never leave the line half-painted
});

document.addEventListener('astro:before-preparation', () => {
  const el = line();
  if (!el || calm()) return;
  creeping = el.animate([{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 22% 0 0)' }], {
    duration: 2600,
    easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)',
    fill: 'forwards',
  });
});

document.addEventListener('astro:after-swap', () => {
  document.documentElement.classList.add('js');
  finishLine();
});
// A cancelled navigation (e.g. pressing Esc) also finishes the line.
window.addEventListener('pageshow', finishLine);
