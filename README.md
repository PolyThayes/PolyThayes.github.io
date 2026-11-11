# Your personal site

Built with [Astro](https://astro.build) and published free on GitHub Pages.
Every time a change lands on the `main` branch, GitHub rebuilds and
republishes the site automatically, usually within two minutes. You never
have to run anything yourself.

**Everything you'll ever edit lives in the `content/` folder.** You can
leave the `src/` folder alone; it holds the design and code.

```
content/
├── site.yaml            ← your name, tagline, contact links
├── about.md             ← the About page
├── resume.md            ← the Résumé page
├── writing/
│   ├── _index.md        ← intro text at the top of the Writing page
│   └── *.md             ← one file per essay
└── gallery/
    ├── _index.md        ← intro text at the top of the Gallery page
    ├── coast/           ← one folder per album…
    │   ├── album.md     ← …with an optional title/description/captions file
    │   └── *.jpg        ← …and the photos themselves
    └── on-the-road/
public/files/            ← downloadable files (e.g. your résumé PDF)
```

---

## Editing on GitHub (no software needed)

1. Go to the repository on github.com and open the `content` folder.
2. Click a file, then the **pencil icon** (✏️) to edit it.
3. When you're done, click **Commit changes**.
4. Wait a minute or two, then refresh your site.

To **add** a file: open the folder, then **Add file → Create new file**
(for text) or **Add file → Upload files** (for photos).

You can watch the publish progress in the **Actions** tab. A green tick
means it's live. A red ✗ means something in a file couldn't be read; see
*If something breaks* below.

---

## Your name, tagline & links → `content/site.yaml`

Change the words after each colon. Keep the quotation marks. To remove a
contact link, delete both its `- label:` and `url:` lines. For an email
link, use `mailto:you@example.com` as the url.

## About page → `content/about.md`

Everything below the second `---` is the page text. The `intro:` line at
the top is shown large, in italics.

**To add a portrait:** upload a photo into the `content` folder (next to
`about.md`), then change the line `# portrait: "./portrait.jpg"` to
`portrait: "./your-photo-name.jpg"` (remove the `#`).

## Résumé page → `content/resume.md`

Write it as plain text. A few simple markers give it structure:

| You type…                   | It becomes…                          |
| --------------------------- | ------------------------------------ |
| `## Education`              | a section label                      |
| `### Job Title, Company`    | a job heading                        |
| `**Month Year – Present**`  | the date line under a job            |
| `---` (on its own line)     | a small ornamental divider           |

**To offer a PDF download:** upload your PDF into `public/files/`, then in
`resume.md` change `# pdf: "resume.pdf"` to `pdf: "your-file-name.pdf"`
(remove the `#`). A **Download PDF** button appears automatically.

## Writing

**To add an essay:** create a new `.md` file in `content/writing/` (any
name; it becomes the web address). Start it with:

```markdown
---
title: "The Title of the Essay"
date: 2026-11-10
summary: "One line shown under the title."
---

Your essay starts here. Leave a blank line between paragraphs.
```

- `date` is written year-month-day. Essays are listed newest first.
- Add `draft: true` to hide an essay until it's ready.
- `## A heading` makes a section heading, `*italic*` and `**bold**` work,
  `> text` makes a block quote, and `---` makes a ❦ section break.

Each essay automatically gets:

- **A reader view** with a progress bar, minutes-left counter, page
  colours (Ink, Paper, Sepia), text sizes, and a *Focus* mode that dims
  everything but the paragraph you're reading.
- **Downloads:** PDF (via the browser's "Save as PDF"), EPUB for e-readers,
  and Markdown/plain text.

## Gallery & albums

**To add an album:** create a new folder inside `content/gallery/` and
upload your photos into it. That's all: the album appears with its own
page, a full-screen viewer, per-photo download buttons, and a
**Download all** (.zip) button.

- On GitHub: open `content/gallery`, choose **Add file → Upload files**,
  and drag the whole folder (e.g. `iceland-2026`) from your computer onto
  the page. GitHub keeps it as a folder.
- The folder name becomes the album's address (`/gallery/iceland-2026/`)
  and, until you give it a title, its name.
- Photos appear in **file-name order**, so number them if order matters
  (`01-…`, `02-…`).
- Formats: **JPG, PNG, WebP, AVIF**. iPhone **HEIC** photos must be
  exported as JPG first (Photos app → File → Export).

**To add a title, date, description and captions,** add a file called
`album.md` in the album's folder. Copy the one from `content/gallery/coast/`
as a starting point:

```markdown
---
title: "Iceland"
date: 2026-07-01
location: "Reykjavík to Vík"
description: "Ten days of weather."
cover: "04-glacier.jpg"
captions:
  01-arrival.jpg: "Landing at 2am, still light out."
  04-glacier.jpg: "Sólheimajökull."
---

Optional longer intro shown on the album page.
```

Other optional lines: `download: false` turns off downloads for that
album, and `hidden: true` hides the album entirely.

**About photo sizes:** visitors see automatically resized, fast-loading
copies, but the *download* buttons serve your original files. GitHub has
limits: keep single photos under ~25 MB and the whole site under ~1 GB.
Exporting at "high quality JPG, 3000–4000 px on the long side" is a good
balance.

**Replace the sample photos:** the six images in `coast/` and
`on-the-road/` are placeholders. Delete them, or the folders, whenever
you like.

---

## If something breaks

If the Actions tab shows a red ✗, click it, then click **build** to see
the message. It's nearly always one of these:

- **A missing quotation mark** at the top of a file, e.g.
  `title: "My Essay` without the closing `"`.
- **An apostrophe inside single quotes.** Use double quotes around titles:
  `title: "Kierkegaard's Leap"`.
- **A date not written as year-month-day** (`2026-11-10`).
- **A misspelled photo name** in `cover:` or `captions:` in `album.md`.
  These won't break the build; the caption just won't show.

The previous version of the site stays online until the fix is committed.

---

## Previewing on your own computer (optional)

You don't need this, but if you'd like to see changes before publishing:

1. Install **Node.js** (the "LTS" version) from [nodejs.org](https://nodejs.org).
2. Open Terminal in this folder and run `npm install` (first time only).
3. Run `npm run dev` and open <http://localhost:4321>. The page refreshes
   as you save files.

## Changing the look

The colours are listed at the very top of `src/styles/global.css` (for
example `--brass` and `--oxblood`). Changing a hex value there changes it
everywhere on the site.

## Custom domain (optional)

Buy a domain from any registrar, follow GitHub's guide to
[configuring a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site),
then change the `site:` line in `astro.config.mjs` to your new address.
