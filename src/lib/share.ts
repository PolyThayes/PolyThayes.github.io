// Link-preview ("share") images: the picture that shows when a page is sent
// by text message, iMessage, WhatsApp, Slack, etc.
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { getSite } from './site';

// Every photo under content/, so site.yaml can name any of them.
const all = import.meta.glob<ImageMetadata>(
  '/content/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' },
);

/** Look up a photo by its path inside the content folder, e.g. "8N3A6128.jpg"
 *  or "gallery/Taiwan Film/1Taiwan.jpg". */
export function contentImage(rel?: string): ImageMetadata | undefined {
  if (!rel) return undefined;
  const clean = rel.trim().replace(/^\.?\//, '').replace(/^content\//, '');
  const want = `/content/${clean}`.toLowerCase();
  const key = Object.keys(all).find((k) => k.toLowerCase() === want);
  return key ? all[key] : undefined;
}

/** The signature photo from site.yaml (share_image). */
export function signatureImage() {
  const site = getSite();
  return {
    src: contentImage(site.share_image),
    alt: site.share_image_alt ?? site.name,
    position: site.share_image_position,
  };
}

/** Crop a photo to the 1200×630 shape link previews use (smaller sources
 *  keep the same shape at their own width, so nothing is blown up). */
export async function shareImage(src: ImageMetadata, position = 'attention') {
  const width = Math.min(1200, src.width, Math.round((src.height * 1200) / 630));
  const height = Math.round((width * 630) / 1200);
  const img = await getImage({
    src,
    width,
    height,
    fit: 'cover',
    // "top", "center", "bottom", or "attention" (let the computer pick the busiest part)
    position: position.trim().toLowerCase() === 'center' ? 'centre' : position.trim().toLowerCase(),
    format: 'jpeg',
    quality: 82,
  });
  return { url: img.src, width, height };
}
