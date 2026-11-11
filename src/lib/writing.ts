import { getCollection, type CollectionEntry } from 'astro:content';

export type Essay = CollectionEntry<'writing'> & {
  title: string;
  words: number;
  minutes: number;
};

/** Curly quotes and apostrophes for titles typed with straight ones. */
export function smartQuotes(s = '') {
  return s
    .replace(/(^|[\s([{\u2014-])"/g, '$1\u201C')
    .replace(/"/g, '\u201D')
    .replace(/(^|[\s([{\u2014-])'/g, '$1\u2018')
    .replace(/'/g, '\u2019')
    .replace(/\.\.\./g, '\u2026');
}

function wordCount(text = '') {
  const clean = text
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_>`\[\]()!-]/g, ' ');
  return clean.split(/\s+/).filter(Boolean).length;
}

export async function getEssays(): Promise<Essay[]> {
  const all = await getCollection('writing', ({ data }) => !data.draft);
  return all
    .map((e) => {
      const words = wordCount(e.body);
      return {
        ...e,
        title: smartQuotes((e.data.title ?? e.id.replace(/-/g, ' ')).trim()),
        data: { ...e.data, summary: e.data.summary && smartQuotes(e.data.summary) },
        words,
        minutes: Math.max(1, Math.round(words / 230)),
      };
    })
    .sort((a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0));
}

export function formatDate(d?: Date, style: 'long' | 'short' = 'long') {
  if (!d) return '';
  return d.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    day: 'numeric',
  });
}

export function toRoman(n: number) {
  const map: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let out = '';
  for (const [v, s] of map) while (n >= v) { out += s; n -= v; }
  return out;
}

/** A safe, readable file name for downloads, e.g. "The Deposition of Ivan Illyich". */
export function fileTitle(title: string) {
  return title.replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, ' ').trim().slice(0, 120) || 'essay';
}
