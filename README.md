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

### The picture shown when you share a link

When someone sends a link to your site by text, iMessage, WhatsApp or
Slack, a preview card appears with a photo. You choose that photo in
`site.yaml`:

```yaml
share_image: "8N3A6128.jpg"
share_image_alt: "Portrait of Nikhil Gupta"
share_image_position: "top"
```

- `share_image` is any photo inside the `content` folder, written as its
  path from there, e.g. `"8N3A6128.jpg"` or `"gallery/Taiwan Film/3Taiwan.jpg"`.
- `share_image_alt` describes the photo for people using screen readers.
- `share_image_position` decides which part survives when the photo is
  cropped to a wide preview: `"top"`, `"center"`, `"bottom"`, or
  `"attention"` (the site picks the busiest part).

This photo is used for the home, About, Gallery and Résumé pages, and
for essays. **Album pages use their own cover photo** automatically.
Messaging apps remember previews for a while, so a change can take a day
or so to show in a chat where the link was already shared.

## About page → `content/about.md`

Everything below the second `---` is the page text. The `intro:` line at
the top is shown large, in italics.

**To add a portrait:** upload a photo into the `content` folder (next to
`about.md`), then change the line `# portrait: "./portrait.jpg"` to
`portrait: "./your-photo-name.jpg"` (remove the `#`).

## Résumé page → `content/resume.md` and `content/resume-acting.md`

The Résumé page is a two-sided sheet of paper. Your professional résumé is
on the front (`resume.md`) and your acting résumé is on the back
(`resume-acting.md`). Visitors turn it over by clicking the page, the
turned-up corner, or the **Professional / Acting** switch above it. The
link `yoursite/resume/#acting` opens straight onto the acting side.

Write both as plain text. A few simple markers give it structure:

| You type…                   | It becomes…                          |
| --------------------------- | ------------------------------------ |
| `## Education`              | a section label                      |
| `### Job Title, Company`    | a job heading                        |
| `**Month Year – Present**`  | the date line under a job            |
| `---` (on its own line)     | a small ornamental divider           |
| `\| Role \| Play \| Company \|` | a row in a credits table (see the acting file) |

At the top of each file:

- `label:` is the word on the switch ("Professional", "Acting").
- `subtitle:` is the line under the page title.
- `pdf:` adds a download button for that side, labelled with the
  `label:` word, e.g. **Professional résumé (PDF)**. Put the PDF in
  `public/files/` and write its file name, e.g. `pdf: "acting-resume.pdf"`.
- Acting side only: `headshot: "./headshot.jpg"` (photo in the `content`
  folder) and `stats:` (Height, Hair, Eyes… add or remove lines freely).

**Only want one résumé?** Delete `content/resume-acting.md` and the page
goes back to a single sheet with no switch.

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
- **Optional preview photo:** put a photo in `content/writing/` and add
  `image: "./photo-name.jpg"` (and `image_alt: "what it shows"`). That
  photo is used when the essay's link is shared. Without it, the
  signature photo from `site.yaml` is used.
- Don't paste the school header (name, teacher, course, date) into the
  essay. The title and date come from the lines at the top.
- The file name becomes the web address, so **don't rename an essay file
  once its link has been shared**. Changing the `title:` line is fine.
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
2, 2A …). Frames sit in strips of six (three on tablets, two on phones),
and each new album adds a frame, so the sheet grows into more rows as you
add albums. Unused spots at the end of the last strip show as blank film.
Click a frame to open that album's page, with a photo grid, a
full-screen viewer, a download button on each photo, and an optional
"Download full album" link.

### Step 1: Shrink your photos first (2 minutes)

Camera and phone photos are far bigger than a website needs. Shrink them
before uploading so the site stays fast and GitHub doesn't fill up.
**Aim for about 2500 pixels on the long side, as JPG.** That makes each
photo roughly 0.5–1.5 MB.

**With Photos (Mac or iPhone library):**
1. Select the photos, then choose **File → Export → Export [n] Photos…**
2. Set **Photo Kind: JPEG**, **JPEG Quality: High**, **Size: Custom**,
   **Max: 2500 pixels**, **Width & Height**.
3. Click **Export** and pick a new folder on your Desktop.

**With Preview (for photos already in a folder):**
1. In Finder, select all the photos and open them in **Preview**.
2. In Preview's sidebar, press **⌘A** to select them all.
3. Choose **Tools → Adjust Size…**, set the larger of **Width/Height** to
   **2500 pixels**, keep **Scale proportionally** ticked, and click **OK**.
4. Choose **File → Export Selected Images…**, set **Format: JPEG**, and
   save them into a new folder. (Exporting keeps your originals untouched.)

iPhone HEIC photos are converted to JPG by either method.

### Step 2: Name and order them

Photos appear in file-name order, so rename them with numbers if the order
matters: `01-arrival.jpg`, `02-harbour.jpg`… (In Finder, select them all,
right-click → **Rename…** → **Format** gives you numbered names in one go.)
Avoid Finder copies like `photo 2.jpg`.

### Step 3: Add the album

1. Make a folder for the album, e.g. `iceland-2026`. The folder name
   becomes the web address (`/gallery/iceland-2026/`).
2. Put your shrunk photos in it.
3. Add a text file called `album.md` in the same folder. The easiest way
   is to copy `album.md` from a sample album and change the words:

```markdown
---
title: "Iceland"
date: 2026-07-01
description: "Ten days of weather."
cover: "04-glacier.jpg"
album_url: "https://your-nas.quickconnect.to/mo/sharing/AbCdEf"
---

Optional: a few sentences about the trip, shown on the album page.
```

Every line is optional. `cover` is the photo shown on the contact sheet
and in link previews (it uses the first photo if you leave it out; the
`.jpg` on the end is optional). `date` decides the order on the sheet
(newest first). `location:` also works.

### Captions (optional)

To give photos a caption, add a `captions:` list to `album.md`. Each line
is the photo's file name (with or without `.jpg`), a colon, and the
caption in quotation marks. Indent each line with two spaces:

```yaml
captions:
  3Taiwan: "Pingxi line, just after the rain"
  "11Fleet Week": "Blue Angels over the harbour"
```

(Put quotation marks around a file name that has a space in it.)

Captions show under the photo in the full-screen viewer and are read
aloud by screen readers. Photos without a caption are described as
"Photo 7 of 23, Album title".

### What visitors download

Each photo's download button gives a JPG about 2000 pixels on the long
side (roughly 1920–2000 px for your current albums), saved with a tidy
name like `italy-bnw-07.jpg`: the album's web address plus the photo's
number. Full-resolution originals stay on your NAS, linked with
`album_url`.

Each album page also has a **Copy link** button, which copies the
album's address so it can be pasted into a message.

### Step 4: Upload it

**On github.com:** open your repository, go into `content` → `gallery`,
choose **Add file → Upload files**, and drag the whole album folder onto
the page. GitHub keeps it as a folder. Click **Commit changes**.

**Or with GitHub Desktop:** drag the folder into
`Documents/GitHub/PolyThayes.github.io/content/gallery/` in Finder, then
in GitHub Desktop write a short summary ("Add Iceland album"), click
**Commit to main**, then **Push origin**.

The album appears on the contact sheet automatically about two minutes
later.

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
grease-pencil circle or box, in red.
Remove the line, or write `favorite: false`, to take the mark off.

Use it sparingly, as a photographer would on a real contact sheet: a mark
on one frame in five or six looks deliberate, while marks everywhere stop
meaning anything.

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

- **Before uploading, shrink photos to about 2500 px on the long edge as
  JPG** (see Step 1 above). That's typically 0.5–1.5 MB each, and the site
  can't show more detail than that anyway.
- **Keep the originals on your NAS** and link them with `album_url`.


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
The palette is bottle-green velvet and gilt, like a private library:
deep emerald backgrounds, antique-gold accents, cream text, and emerald
hover panels. The section titles hang in four different historical
picture frames (`src/components/FramedTitle.astro`). Each line has a comment saying what it's for.
Change a hex value there and it changes everywhere on the site.

## Custom domain (optional)

Buy a domain from any registrar, follow GitHub's guide to
[configuring a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site),
then change the `site:` line in `astro.config.mjs` to your new address.
