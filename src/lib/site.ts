import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

export interface SiteSettings {
  name: string;
  eyebrow?: string;
  headline?: string;
  description?: string;
  links?: { label: string; url: string }[];
  sections?: Record<string, { title?: string; blurb?: string }>;
}

let cached: SiteSettings | undefined;

export function getSite(): SiteSettings {
  if (cached && import.meta.env.PROD) return cached;
  const file = path.join(__PROJECT_ROOT__, 'content', 'site.yaml');
  const data = (parse(fs.readFileSync(file, 'utf8')) ?? {}) as Partial<SiteSettings>;
  cached = { name: 'My Site', links: [], sections: {}, ...data } as SiteSettings;
  return cached;
}

export const NAV = [
  { href: '/writing/', label: 'Writing' },
  { href: '/gallery/', label: 'Gallery' },
  { href: '/resume/', label: 'Résumé' },
  { href: '/about/', label: 'About' },
];
