import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Every field is forgiving on purpose: a missing date or title should
// never break the site for someone editing text files by hand.

const writing = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/_*.md'], base: './content/writing' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
      date: z.coerce.date().optional(),
      summary: z.string().optional(),
      draft: z.boolean().optional().default(false),
      // Optional link-preview photo for this essay (a photo in content/writing/).
      image: image().optional(),
      image_alt: z.string().optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './content' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
      intro: z.string().optional(),
      portrait: image().optional(),
      // Which part of the portrait to keep when the frame crops it:
      // "top", "center", "bottom", or a percentage like "20%".
      portrait_position: z.string().optional(),
      // Résumé pages
      label: z.string().optional(),
      headshot: image().optional(),
      stats: z.record(z.string(), z.coerce.string()).optional(),
      pdf: z.string().optional(),
    }),
});

const albums = defineCollection({
  loader: glob({
    pattern: '*/album.md',
    base: './content/gallery',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: z.object({
    title: z.string().optional(),
    date: z.coerce.date().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    cover: z.string().optional(),
    // "color" or "bw". Leave it out and the site decides from the cover photo.
    mode: z.enum(['color', 'bw']).optional(),
    // favorite: true draws a grease-pencil mark around the frame.
    favorite: z.boolean().optional().default(false),
    // A share link (e.g. Synology Photos) for the full-resolution album.
    album_url: z.string().optional(),
    captions: z.record(z.string(), z.string()).optional().default({}),
    hidden: z.boolean().optional().default(false),
  }),
});

// The intro text at the top of the Writing and Gallery pages (_index.md).
const sections = defineCollection({
  loader: glob({
    pattern: '*/_index.md',
    base: './content',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: z.object({
    title: z.string().optional(),
    lede: z.string().optional(),
  }),
});

export const collections = { writing, pages, albums, sections };
