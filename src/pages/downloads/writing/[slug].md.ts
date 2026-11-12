import type { APIRoute, GetStaticPaths } from 'astro';
import { getEssays, formatDate } from '../../../lib/writing';
import { getSite } from '../../../lib/site';
import { getImage } from 'astro:assets';
import { contentImage } from '../../../lib/share';
import { essayImages } from '../../../lib/essay-images';

export const getStaticPaths = (async () => {
  const essays = await getEssays();
  return essays.map((essay) => ({ params: { slug: essay.id }, props: { essay } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props, site }) => {
  const { essay } = props as Awaited<ReturnType<typeof getStaticPaths>>[number]['props'];
  const head = [
    `# ${essay.title}`,
    essay.data.summary ? `\n*${essay.data.summary}*` : '',
    `\n${getSite().name}${essay.data.date ? ` · ${formatDate(essay.data.date)}` : ''}`,
    '\n---\n',
  ].join('\n');
  // Point pictures at full web addresses so they still show once downloaded.
  let body = (essay.body ?? '').trim();
  for (const img of essayImages(body)) {
    const src = contentImage(`writing/${img.file}`);
    if (!src) continue;
    const web = await getImage({ src, width: Math.min(1600, src.width), format: 'jpeg', quality: 85 });
    const url = new URL(web.src, site).href;
    body = body.replace(/\]\(\s*(?:\.\/)?([^)\s]+)\s*\)/g, (m, f) => (decodeURIComponent(f) === img.file ? `](${url})` : m));
  }
  return new Response(`${head}\n${body}\n`, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
