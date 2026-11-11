import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getEssays } from '../lib/writing';
import { getSite } from '../lib/site';

export const GET: APIRoute = async (context) => {
  const site = getSite();
  const essays = await getEssays();
  return rss({
    title: `${site.name} — Writing`,
    description: site.description ?? '',
    site: context.site!,
    items: essays.map((e) => ({
      title: e.title,
      description: e.data.summary,
      pubDate: e.data.date,
      link: `/writing/${e.id}/`,
    })),
  });
};
