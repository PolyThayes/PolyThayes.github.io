import fs from 'node:fs';
import path from 'node:path';

export interface EssayImage {
  file: string; // file name inside content/writing
  alt: string;
  abs: string; // absolute path on disk
}

/** Photos an essay includes with ![description](./photo.jpg), in order. */
export function essayImages(body = ''): EssayImage[] {
  const dir = path.join(__PROJECT_ROOT__, 'content', 'writing');
  return [...body.matchAll(/!\[([^\]]*)\]\(\s*(?:\.\/)?([^)\s]+)\s*\)/g)]
    .map((m) => ({ alt: m[1], file: decodeURIComponent(m[2]), abs: path.join(dir, decodeURIComponent(m[2])) }))
    .filter((i) => !/^https?:/.test(i.file) && fs.existsSync(i.abs));
}
