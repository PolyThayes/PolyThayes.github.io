import fs from 'node:fs';
import type { APIRoute, GetStaticPaths } from 'astro';
import { getAlbums, originalPath } from '../../../../lib/gallery';

const TYPES: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', avif: 'image/avif',
};

export const getStaticPaths = (async () => {
  const albums = await getAlbums();
  return albums
    .filter((a) => a.download)
    .flatMap((a) => a.photos.map((p) => ({ params: { album: a.slug, file: p.slug }, props: { photo: p } })));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { photo } = props as Awaited<ReturnType<typeof getStaticPaths>>[number]['props'];
  const ext = photo.slug.split('.').pop()!;
  return new Response(fs.readFileSync(originalPath(photo)), {
    headers: { 'Content-Type': TYPES[ext] ?? 'application/octet-stream' },
  });
};
