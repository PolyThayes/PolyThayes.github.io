import type { APIRoute, GetStaticPaths } from 'astro';
import { getEssays } from '../../../lib/writing';
import { getSite } from '../../../lib/site';
import { buildEpub } from '../../../lib/epub';

export const getStaticPaths = (async () => {
  const essays = await getEssays();
  return essays.map((essay) => ({ params: { slug: essay.id }, props: { essay } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props, site }) => {
  const { essay } = props as Awaited<ReturnType<typeof getStaticPaths>>[number]['props'];
  const bytes = buildEpub({
    id: essay.id,
    title: essay.title,
    author: getSite().name,
    date: essay.data.date,
    summary: essay.data.summary,
    html: essay.rendered?.html ?? '',
    site: String(site ?? ''),
  });
  return new Response(bytes, { headers: { 'Content-Type': 'application/epub+zip' } });
};
