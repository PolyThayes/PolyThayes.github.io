import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import '../styles/lightbox.css';

let boxes: PhotoSwipeLightbox[] = [];

const ICON_DL =
  '<svg class="pswp__icn" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 6v14m0 0-6-6m6 6 6-6M8 25h16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function init() {
  boxes.forEach((b) => b.destroy());
  boxes = [];

  document.querySelectorAll<HTMLElement>('.pswp-gallery').forEach((gallery) => {
    const lb = new PhotoSwipeLightbox({
      gallery,
      children: '.cell > a:first-child',
      pswpModule: () => import('photoswipe'),
      bgOpacity: 0.96,
      showHideAnimationType: 'zoom',
      showAnimationDuration: 450,
      hideAnimationDuration: 380,
      wheelToZoom: true,
      padding: { top: 40, bottom: 90, left: 20, right: 20 },
      imageClickAction: 'zoom',
      tapAction: 'toggle-controls',
      closeTitle: 'Close (Esc)',
      zoomTitle: 'Zoom',
      arrowPrevTitle: 'Previous',
      arrowNextTitle: 'Next',
    });

    lb.on('uiRegister', () => {
      const pswp = lb.pswp!;
      pswp.ui!.registerElement({
        name: 'download',
        order: 8,
        isButton: true,
        tagName: 'a',
        title: 'Download original',
        html: ICON_DL,
        onInit: (el, p) => {
          const a = el as HTMLAnchorElement;
          const update = () => {
            const src = p.currSlide?.data.element as HTMLElement | undefined;
            const url = src?.dataset.download;
            a.style.display = url ? '' : 'none';
            if (url) {
              a.href = url;
              a.download = src?.dataset.filename ?? '';
            }
          };
          p.on('change', update);
          update();
        },
      });

      pswp.ui!.registerElement({
        name: 'caption',
        order: 9,
        isButton: false,
        appendTo: 'root',
        className: 'pswp__caption',
        onInit: (el, p) => {
          const update = () => {
            const src = p.currSlide?.data.element as HTMLElement | undefined;
            const cap = src?.dataset.caption ?? '';
            const album = src?.dataset.album ?? '';
            el.innerHTML = '';
            if (album) {
              const s = document.createElement('span');
              s.className = 'pswp__caption-album';
              s.textContent = album;
              el.append(s);
            }
            if (cap) {
              const s = document.createElement('span');
              s.className = 'pswp__caption-text';
              s.textContent = cap;
              el.append(s);
            }
            el.classList.remove('is-in');
            void el.offsetWidth;
            el.classList.add('is-in');
          };
          p.on('change', update);
          update();
        },
      });
    });

    lb.init();
    boxes.push(lb);
  });

  // "View as slideshow" buttons open the first gallery on the page.
  document.querySelectorAll<HTMLElement>('[data-open-lightbox]').forEach((btn) => {
    btn.addEventListener('click', () => boxes[0]?.loadAndOpen(0));
  });
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', () => {
  boxes.forEach((b) => b.destroy());
  boxes = [];
});
