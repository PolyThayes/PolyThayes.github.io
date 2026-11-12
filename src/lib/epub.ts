import { zipSync, strToU8 } from 'fflate';
import fs from 'node:fs';
import type { EssayImage } from './essay-images';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const NAMED: Record<string, string> = {
  nbsp: '#160', mdash: '#8212', ndash: '#8211', hellip: '#8230', lsquo: '#8216', rsquo: '#8217',
  ldquo: '#8220', rdquo: '#8221', copy: '#169', eacute: '#233', middot: '#183',
};

const MIME: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' };
const ext = (f: string) => f.split('.').pop()!.toLowerCase();

/** Make Astro's rendered HTML acceptable as XHTML for e-readers.
 *  Images are swapped, in order, for copies bundled inside the EPUB. */
function toXhtml(html: string, images: EssayImage[] = []) {
  let n = 0;
  html = html.replace(/<img\b[^>]*>/gi, () => {
    const img = images[n];
    n += 1;
    return img ? `<figure class="img"><img src="images/img${n}.${ext(img.file)}" alt="${esc(img.alt)}" /></figure>` : '';
  });
  return html
    .replace(/<(br|hr|img|input|meta|link|source|wbr)(\s[^>]*?)?\s*\/?>/gi, (_m, tag, attrs = '') => `<${tag}${attrs} />`)
    .replace(/&([a-z]+);/gi, (m, name) => {
      const lower = name.toLowerCase();
      if (['amp', 'lt', 'gt', 'quot', 'apos'].includes(lower)) return m;
      return NAMED[lower] ? `&${NAMED[lower]};` : '';
    })
    ;
}

export function buildEpub(opts: {
  id: string;
  title: string;
  author: string;
  date?: Date;
  summary?: string;
  html: string;
  site: string;
  images?: EssayImage[];
}) {
  const { id, title, author, date, summary, html, site, images = [] } = opts;
  const bundled = images.filter((i) => MIME[ext(i.file)]);
  const uid = `${site.replace(/\/$/, '')}/writing/${id}/`;
  const modified = new Date().toISOString().replace(/\.\d+Z$/, 'Z');

  const css = `
body { font-family: Georgia, serif; line-height: 1.6; margin: 0 5%; }
h1 { font-weight: normal; font-size: 1.9em; text-align: center; margin: 2em 0 0.4em; line-height: 1.15; }
.sub { text-align: center; font-style: italic; color: #555; }
.by { text-align: center; font-size: 0.8em; letter-spacing: 0.12em; text-transform: uppercase; color: #777; margin-bottom: 3em; }
h2, h3 { font-weight: normal; margin-top: 1.8em; }
p { margin: 0 0 0.9em; text-indent: 0; }
blockquote { margin: 1.4em 1.5em; font-style: italic; }
hr { border: 0; text-align: center; margin: 2em 0; }
hr:after { content: "\\2766"; }
sup { font-size: 0.7em; }
figure.img { margin: 1.5em 0; text-align: center; }
figure.img img { max-width: 100%; height: auto; }
`;

  const chapter = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en" xml:lang="en">
<head><meta charset="utf-8" /><title>${esc(title)}</title><link rel="stylesheet" type="text/css" href="style.css" /></head>
<body>
<section epub:type="chapter">
<h1>${esc(title)}</h1>
${summary ? `<p class="sub">${esc(summary)}</p>` : ''}
<p class="by">${esc(author)}${date ? ` · ${date.getUTCFullYear()}` : ''}</p>
${toXhtml(html, bundled)}
</section>
</body>
</html>`;

  const nav = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en" xml:lang="en">
<head><meta charset="utf-8" /><title>Contents</title></head>
<body><nav epub:type="toc" id="toc"><h1>Contents</h1><ol><li><a href="essay.xhtml">${esc(title)}</a></li></ol></nav></body>
</html>`;

  const opf = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid" xml:lang="en">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="uid">${esc(uid)}</dc:identifier>
    <dc:title>${esc(title)}</dc:title>
    <dc:creator>${esc(author)}</dc:creator>
    <dc:language>en</dc:language>
    ${date ? `<dc:date>${date.toISOString().slice(0, 10)}</dc:date>` : ''}
    ${summary ? `<dc:description>${esc(summary)}</dc:description>` : ''}
    <meta property="dcterms:modified">${modified}</meta>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav" />
    <item id="essay" href="essay.xhtml" media-type="application/xhtml+xml" />
    <item id="css" href="style.css" media-type="text/css" />
    ${bundled.map((img, i) => `<item id="img${i + 1}" href="images/img${i + 1}.${ext(img.file)}" media-type="${MIME[ext(img.file)]}" />`).join('\n    ')}
  </manifest>
  <spine><itemref idref="essay" /></spine>
</package>`;

  const container = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" /></rootfiles>
</container>`;

  // The "mimetype" file must come first and be stored uncompressed.
  return zipSync(
    {
      mimetype: [strToU8('application/epub+zip'), { level: 0 }],
      'META-INF/container.xml': strToU8(container),
      'OEBPS/content.opf': strToU8(opf),
      'OEBPS/nav.xhtml': strToU8(nav),
      'OEBPS/essay.xhtml': strToU8(chapter),
      'OEBPS/style.css': strToU8(css),
      ...Object.fromEntries(
        bundled.map((img, i) => [`OEBPS/images/img${i + 1}.${ext(img.file)}`, [new Uint8Array(fs.readFileSync(img.abs)), { level: 0 }]]),
      ),
    },
    { level: 9 },
  );
}
