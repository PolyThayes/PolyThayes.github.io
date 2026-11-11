import type { APIRoute, GetStaticPaths } from 'astro';
import { getEssays, formatDate } from '../../../lib/writing';
import { getSite } from '../../../lib/site';

export const getStaticPaths = (async () => {
  const essays = await getEssays();
  return essays.map((essay) => ({ params: { slug: essay.id }, props: { essay } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { essay } = props as Awaited<ReturnType<typeof getStaticPaths>>[number]['props'];
  const head = [
    `# ${essay.title}`,
    essay.data.summary ? `\n*${essay.data.summary}*` : '',
    `\n${getSite().name}${essay.data.date ? ` · ${formatDate(essay.data.date)}` : ''}`,
    '\n---\n',
  ].join('\n');
  return new Response(`${head}\n${(essay.body ?? '').trim()}\n`, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
