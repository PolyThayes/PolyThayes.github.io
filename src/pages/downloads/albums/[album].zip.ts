import fs from 'node:fs';
import { zipSync } from 'fflate';
import type { APIRoute, GetStaticPaths } from 'astro';
import { getAlbums, originalPath } from '../../../lib/gallery';

export const getStaticPaths = (async () => {
  const albums = await getAlbums();
  return albums.filter((a) => a.download).map((album) => ({ params: { album: album.slug }, props: { album } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { album } = props as Awaited<ReturnType<typeof getStaticPaths>>[number]['props'];
  const files: Record<string, Uint8Array> = {};
  for (const p of album.photos) files[`${album.slug}/${p.slug}`] = new Uint8Array(fs.readFileSync(originalPath(p)));
  // Photos are already compressed, so store them as-is (fast, same size).
  const zip = zipSync(files, { level: 0 });
  return new Response(zip, { headers: { 'Content-Type': 'application/zip' } });
};
