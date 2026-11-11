import { getCollection } from 'astro:content';
import type { ImageMetadata } from 'astro';

// Every photo inside content/gallery/<album-folder>/ is picked up automatically.
const files = import.meta.glob<ImageMetadata>(
  '/content/gallery/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true, import: 'default' },
);

export interface Photo {
  album: string;
  folder: string;
  file: string; // original file name, e.g. "IMG 0042.jpg"
  slug: string; // url-safe download name, e.g. "img-0042.jpg"
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
  download: boolean;
  cover: Photo;
  photos: Photo[];
  entry?: Awaited<ReturnType<typeof getCollection<'albums'>>>[number];
}

const slugify = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';

const titleCase = (s: string) =>
  s.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export function photoDownloadName(file: string) {
  const dot = file.lastIndexOf('.');
  return slugify(file.slice(0, dot)) + file.slice(dot).toLowerCase();
}

export async function getAlbums(): Promise<Album[]> {
  const meta = await getCollection('albums');
  const byFolder = new Map<string, { file: string; src: ImageMetadata }[]>();

  for (const [p, src] of Object.entries(files)) {
    const [, , , folder, file] = p.split('/');
    if (!byFolder.has(folder)) byFolder.set(folder, []);
    byFolder.get(folder)!.push({ file, src });
  }

  const albums: Album[] = [];
  for (const [folder, items] of byFolder) {
    const entry = meta.find((m) => m.id === folder);
    if (entry?.data.hidden) continue;
    const captions = entry?.data.captions ?? {};
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
    const cover = photos.find((p) => p.file === entry?.data.cover) ?? photos[0];
    albums.push({
      slug,
      title: entry?.data.title ?? titleCase(folder),
      date: entry?.data.date,
      location: entry?.data.location,
      description: entry?.data.description,
      body: entry?.body?.trim(),
      download: entry?.data.download ?? true,
      cover,
      photos,
      entry,
    });
  }

  return albums.sort(
    (a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0) || a.title.localeCompare(b.title),
  );
}

export function originalPath(photo: Photo) {
  return `${__PROJECT_ROOT__}/content/gallery/${photo.folder}/${photo.file}`;
}
