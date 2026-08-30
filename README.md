# Your personal site

A Hugo site using the Congo theme, with a custom "editorial" color scheme
(warm charcoal, brass, oxblood — no grey-and-white minimalism), custom
typography (Fraunces + Newsreader + IBM Plex Mono), a bespoke homepage,
and a contact-sheet-style photo gallery.

It costs $0 to run and hosts for free on GitHub Pages.

## 1. Put this on GitHub

1. Create a free account at [github.com](https://github.com) if you don't have one.
2. Create a new repository named exactly `yourusername.github.io`
   (replace `yourusername` with your actual GitHub username — this exact
   naming pattern is what makes GitHub host it for free at that address).
3. Upload **all the files and folders in this bundle** to that repository.
   On the repo's page, use "Add file" → "Upload files," drag everything in
   (including the hidden `.github` folder — see the note below), and commit.

   > **Note on the `.github` folder:** some file managers hide folders that
   > start with a dot. If your computer hides it, turn on "show hidden
   > files" before uploading, or use GitHub's upload screen and drag the
   > `.github` folder in directly — it should still appear even if your
   > OS file browser doesn't show it by default. This folder is what makes
   > the site auto-build and publish itself.

4. In the repository, go to **Settings → Pages**. Under "Build and
   deployment," set **Source** to **GitHub Actions**.
5. Go to the **Actions** tab and confirm the "Deploy Hugo site to GitHub
   Pages" workflow runs (it triggers automatically after your upload, or
   you can click "Run workflow" manually). It takes about a minute.
6. Once it finishes, your site is live at `https://yourusername.github.io/`.

Every time you upload new/changed files afterward, the site rebuilds and
republishes automatically — nothing else to run.

## 2. Add your own content

Everything you'll actually edit is plain text in the `content/` folder:

- `content/about.md` — your bio. Replace the sample text.
- `content/resume.md` — your résumé. Replace the sample sections.
- `content/writing/` — one file per piece of writing. Two samples are
  included; edit them, delete them, or add new `.md` files the same way
  (copy an existing one as a starting point).
- `content/gallery/_index.md` and the six sample `.jpg` files next to it —
  see below.

Each file starts with a `---`-delimited block (front matter) with a title
and sometimes a date — leave that part alone unless you know what a field
does; everything below the second `---` is what shows up on the page.

## 3. Add your photos to the gallery

Delete the six sample `.jpg` files in `content/gallery/` (they're
placeholders — plain color blocks, not real photos) and drop your own
image files into that same folder. Rebuild (just re-upload / commit), and
they'll appear automatically in the gallery grid — no template editing
required.

If you want captions other than the filename, add a `resources:` block to
`content/gallery/_index.md` — there's a commented-out example already in
that file showing the format the six sample images use.

### Downloadable albums (optional)

If you set up shareable albums elsewhere — for example, Synology Photos
on your NAS — you can link to them from the gallery page. Uncomment and
fill in the `album_url` (and optionally `album_label`) lines at the top of
`content/gallery/_index.md`. A small callout box linking to that album
will appear automatically.

## 4. Before you publish for real

Open `hugo.toml` and update:
- `baseURL` — change `yourusername` to your actual GitHub username (or
  your custom domain, if you add one later).
- `title` and `[params.author] name` — currently set to "Nikhil Gupta,"
  change if needed.

## 5. Preview changes before publishing (optional)

If you ever want to see changes before they go live, and you're
comfortable installing one tool: install [Hugo](https://gohugo.io)
(extended version), open a terminal in this folder, and run:

```
hugo server
```

Then open `http://localhost:1313` in your browser. This step is entirely
optional — GitHub will build and publish the site for you regardless.

## 6. Custom domain (optional, ~$12/year)

Buy a domain from any registrar, then follow GitHub's guide for
["Configuring a custom domain for your GitHub Pages site"](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
Not required to get started.
