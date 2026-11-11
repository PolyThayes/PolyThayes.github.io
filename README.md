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
    └── iceland-2026/    ← one folder per album…
        ├── album.md     ← …with its settings (title, cover, favourite…)
        └── *.jpg        ← …and the photos themselves
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

## Gallery (the contact sheet)

The Gallery page is laid out like a film contact sheet. **Each album is one
frame on the sheet**, shown as its cover photo with a frame number (1, 1A,
2, 2A …). Click a frame to open that album's page, with a photo grid, a
full-screen viewer, a download button on each photo, and an optional
"Download full album" link.

### Add an album

1. Make a new folder inside `content/gallery/`, e.g. `content/gallery/iceland-2026/`.
   The folder name becomes the web address (`/gallery/iceland-2026/`).
2. Drop your photos into it (JPG, PNG, WebP or AVIF; export iPhone HEIC
   photos as JPG first). Photos show in file-name order, so number them
   if order matters: `01-…`, `02-…`.
3. Add a text file called `album.md` in the same folder. Copy one from a
   sample album and change the words:

```markdown
---
title: "Iceland"
date: 2026-07-01
description: "Ten days of weather."
cover: "04-glacier.jpg"
mode: color
favorite: true
album_url: "https://your-nas.quickconnect.to/mo/sharing/AbCdEf"
---

Optional: a few sentences about the trip, shown on the album page.
```

That's all. The album appears on the contact sheet automatically, in date
order (newest first). On GitHub you can drag the whole folder onto
**Add file → Upload files** inside `content/gallery`.

Every line is optional except that the folder needs at least one photo.
`cover` is the file name of the photo to show on the sheet; leave it out
to use the first photo. `location:` and per-photo `captions:` also work;
see `sample-color-harbour/album.md` for an example.

### Colour or black-and-white

On the sheet, colour albums sit on warm orange-brown film marked
"PORTRA 400". Black-and-white albums sit on silver-grey film marked
"HP5+". **The site works this out by itself** by measuring how much colour
is in the cover photo. If it guesses wrong (a sepia-toned print can look
like colour, for example), set it yourself in `album.md`:

- `mode: color`
- `mode: bw`

### Mark a favourite

Add `favorite: true` to `album.md`. The frame gets a hand-drawn
grease-pencil circle or box, in red or blue (each album keeps its own).
Remove the line, or write `favorite: false`, to take the mark off.

### Link a Synology share for full-resolution downloads

The site serves web-sized copies of your photos (about 2000 pixels on the
long edge). Each photo's download button gives that size. For the
full-resolution originals, share the album from your NAS:

1. In **Synology Photos**, open the album, click **Share**, turn on
   **Enable share link**, and set the privacy to "Public" (or
   password-protected if you prefer). Allow downloads.
2. Copy the link.
3. Paste it into `album.md` as `album_url: "the link"`, in quotation marks.

A **Download full album** button then appears on the album page. Leave
`album_url` out and the button is hidden.

### ⚠️ Keep big photo files out of the repository

Everything in `content/` is stored in your GitHub repository forever, even
after you delete it. Camera originals (10–40 MB each) will quickly make the
repository slow and can hit GitHub's limits (about 100 MB per file, 1 GB
per site).

- **Before uploading, export photos at about 2500 px on the long edge,
  JPG quality ~85.** That's typically 0.5–1.5 MB each, and the site
  can't show more detail than that anyway.
- **Keep the originals on your NAS** and link them with `album_url`.

### The sample albums

`sample-color-harbour`, `sample-color-market` and `sample-bw-streets`
are generated placeholders, so you can see the layout. **To remove them,
delete those three folders** in `content/gallery/`. Nothing else
refers to them.

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

Every colour is defined once, at the very top of `src/styles/global.css`.
The palette is taken from a dark Paris hotel bar: espresso and walnut
backgrounds, cognac leather accents, lamp-glow gold and cream highlights,
and olive-umber panels. Each line has a comment saying what it's for.
Change a hex value there and it changes everywhere on the site.

## Custom domain (optional)

Buy a domain from any registrar, follow GitHub's guide to
[configuring a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site),
then change the `site:` line in `astro.config.mjs` to your new address.
