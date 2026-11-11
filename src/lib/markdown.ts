// Tiny markdown helper for the short notes in album.md files.
// (Paragraphs, *italic*, **bold**, and [links](https://…) — that's all they need.)
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function marked(src: string) {
  return src
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim()
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((para) => {
      let h = esc(para.replace(/\s*\n\s*/g, ' '));
      h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      h = h.replace(/\*(.+?)\*/g, '<em>$1</em>');
      h = h.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, t, u) =>
        /^(https?:|mailto:|\/)/.test(u) ? `<a href="${u.replace(/"/g, '%22')}">${t}</a>` : t,
      );
      return `<p>${h}</p>`;
    })
    .join('\n');
}
