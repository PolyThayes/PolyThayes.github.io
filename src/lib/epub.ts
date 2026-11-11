import { zipSync, strToU8 } from 'fflate';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const NAMED: Record<string, string> = {
  nbsp: '#160', mdash: '#8212', ndash: '#8211', hellip: '#8230', lsquo: '#8216', rsquo: '#8217',
  ldquo: '#8220', rdquo: '#8221', copy: '#169', eacute: '#233', middot: '#183',
};

/** Make Astro's rendered HTML acceptable as XHTML for e-readers. */
function toXhtml(html: string) {
  return html
    .replace(/<(br|hr|img|input|meta|link|source|wbr)(\s[^>]*?)?\s*\/?>/gi, (_m, tag, attrs = '') => `<${tag}${attrs} />`)
    .replace(/&([a-z]+);/gi, (m, name) => {
      const lower = name.toLowerCase();
      if (['amp', 'lt', 'gt', 'quot', 'apos'].includes(lower)) return m;
      return NAMED[lower] ? `&${NAMED[lower]};` : '';
    })
    .replace(/<img\b[^>]*>/gi, ''); // images aren't bundled; drop them
}

export function buildEpub(opts: {
  id: string;
  title: string;
  author: string;
  date?: Date;
  summary?: string;
  html: string;
  site: string;
}) {
  const { id, title, author, date, summary, html, site } = opts;
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
${toXhtml(html)}
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
    },
    { level: 9 },
  );
}
