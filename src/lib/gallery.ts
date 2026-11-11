import { getCollection } from 'astro:content';
import type { ImageMetadata } from 'astro';
import sharp from 'sharp';

// Every photo inside content/gallery/<album-folder>/ is picked up automatically.
const files = import.meta.glob<ImageMetadata>(
  '/content/gallery/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true, import: 'default' },
);

export type FilmMode = 'color' | 'bw';

export interface Photo {
  album: string;
  folder: string;
  file: string; // original file name, e.g. "IMG 0042.jpg"
  slug: string; // tidy name for downloads, e.g. "img-0042.jpg"
  src: ImageMetadata;
  caption?: string;
  index: number;
}

export interface Album {
  slug: string;
  title: string;
  date?: Date;
  location?: string;
  description?: string;
  body?: string;
  albumUrl?: string;
  favorite: boolean;
  mode: FilmMode;
  modeSource: 'setting' | 'detected';
  frame: string; // contact-sheet frame number: 1, 1A, 2, 2A …
  cover: Photo;
  photos: Photo[];
}

const slugify = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';

const titleCase = (s: string) => s.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export function photoDownloadName(file: string) {
  const dot = file.lastIndexOf('.');
  return slugify(file.slice(0, dot)) + '.jpg';
}

export function originalPath(photo: Photo) {
  return `${__PROJECT_ROOT__}/content/gallery/${photo.folder}/${photo.file}`;
}

/** Frame numbers like a contact sheet: 1, 1A, 2, 2A, 3 … */
export const frameLabel = (i: number) => `${Math.floor(i / 2) + 1}${i % 2 ? 'A' : ''}`;

/**
 * Is this photo colour or black-and-white?
 *
 * We shrink the cover to ~96px and measure each pixel's chroma
 * (brightest RGB channel minus darkest). A true B&W scan has almost none —
 * only JPEG noise, a few points out of 255. We look at the 95th-percentile
 * pixel rather than the average, so a mostly-grey colour photo with one
 * red umbrella is still (correctly) called colour, while a slightly warm-
 * toned B&W print stays B&W. Strongly sepia-toned prints can read as
 * colour — that is what the `mode:` setting is for.
 */
const modeCache = new Map<string, FilmMode>();
export async function detectMode(path: string): Promise<FilmMode> {
  const hit = modeCache.get(path);
  if (hit) return hit;
  let mode: FilmMode = 'color';
  try {
    const { data, info } = await sharp(path)
      .rotate()
      .resize(96, 96, { fit: 'inside' })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const chroma: number[] = [];
    for (let i = 0; i < data.length; i += info.channels) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      chroma.push(Math.max(r, g, b) - Math.min(r, g, b));
    }
    chroma.sort((a, b) => a - b);
    const p95 = chroma[Math.floor(chroma.length * 0.95)] ?? 0;
    mode = p95 < 28 ? 'bw' : 'color';
  } catch {
    mode = 'color';
  }
  modeCache.set(path, mode);
  return mode;
}

let cached: Promise<Album[]> | undefined;

export function getAlbums(): Promise<Album[]> {
  if (!cached || !import.meta.env.PROD) cached = loadAlbums();
  return cached;
}

async function loadAlbums(): Promise<Album[]> {
  const meta = await getCollection('albums');
  const byFolder = new Map<string, { file: string; src: ImageMetadata }[]>();

  for (const [p, src] of Object.entries(files)) {
    const [, , , folder, file] = p.split('/');
    if (!byFolder.has(folder)) byFolder.set(folder, []);
    byFolder.get(folder)!.push({ file, src });
  }

  const albums: Omit<Album, 'frame'>[] = [];
  for (const [folder, items] of byFolder) {
    const entry = meta.find((m) => m.id === folder);
    const data = entry?.data;
    if (data?.hidden) continue;
    const captions = data?.captions ?? {};
    items.sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }));
    const slug = slugify(folder);
    const photos: Photo[] = items.map((it, index) => ({
      album: slug,
      folder,
      file: it.file,
      slug: photoDownloadName(it.file),
      src: it.src,
      caption: captions[it.file],
      index,
    }));
    const cover = photos.find((p) => p.file === data?.cover) ?? photos[0];
    const mode = data?.mode ?? (await detectMode(originalPath(cover)));
    albums.push({
      slug,
      title: data?.title ?? titleCase(folder),
      date: data?.date,
      location: data?.location,
      description: data?.description,
      body: entry?.body?.trim(),
      albumUrl: data?.album_url?.trim() || undefined,
      favorite: data?.favorite ?? false,
      mode,
      modeSource: data?.mode ? 'setting' : 'detected',
      cover,
      photos,
    });
  }

  albums.sort(
    (a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0) || a.title.localeCompare(b.title),
  );
  return albums.map((a, i) => ({ ...a, frame: frameLabel(i) }));
}

/** The large size used in the lightbox and for downloads (~2000px long edge). */
export function largeSize(src: ImageMetadata, longEdge = 2000) {
  const scale = Math.min(1, longEdge / Math.max(src.width, src.height));
  return { width: Math.round(src.width * scale), height: Math.round(src.height * scale) };
}
