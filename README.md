# Fabrizio Vassallo's website

A custom bilingual academic site. English lives at `/`; Spanish at `/es/`.
Hugo generates both pages from shared data. There are no theme modules, npm
packages, third-party scripts, remote fonts, or backend services.

## Local preview

From this folder, run:

```sh
sh scripts/preview.sh
```

Open **http://localhost:1313/**. Hugo reloads the browser when content, styles,
or templates change. Stop with Ctrl+C. In the original workspace the downloaded
Hugo binary is in `../.tools/`, which the scripts detect automatically.

On a fresh clone, install the pinned local Hugo binary first (macOS/Linux;
requires curl, tar, and Python 3):

```sh
sh scripts/setup.sh
sh scripts/preview.sh
```

An installed Hugo or explicit `HUGO_BIN` also works. No global installation is
required. Version 0.136.5 matches the original repository's build configuration.

## Build and validate

```sh
sh scripts/build.sh
```

This builds `public/` and checks bilingual metadata, local links, stable anchors,
explanation lengths, and exclusion of development/demo content. Only `public/`
is uploaded by the GitHub Pages workflow. It is generated and ignored by Git.

## Edit content

| File | Purpose |
| --- | --- |
| `data/copy.json` | Interface, biography, research text, and figure labels in EN/ES |
| `data/publications.json` | Shared citation metadata and paired explanations |
| `data/perspectives.json` | Three editable Perspectives: titles, blurbs, and full text in EN/ES |
| `data/news.json` | Verified talks, authored writing, and coverage in “Beyond the papers” |
| `data/pta_guide.json` | Bilingual illustrated PTA walkthrough and figure captions |
| `data/family.json` | Direct ancestors for the unlisted family tree |
| `data/family_copy.json` | English/Spanish family-tree interface |
| `static/files/Fabrizio_Vassallo_CV.pdf` | CV opened for reading in a new tab |
| `static/images/fabrizio-vassallo.webp` | Optimized portrait |
| `assets/site.css` | Responsive visual design |
| `assets/site.js` | Anchors, language state, and coverage highlights |
| `layouts/index.html` | Shared page template |
| `layouts/partials/schematic.html` | Original conceptual SVG illustrations |
| `layouts/partials/perspective-art.html` | Decorative illustrations for the Perspectives cards |
| `layouts/research/pta.html` | PTA guide at `/research/pulsar-timing/` and `/es/research/pulsar-timing/` |
| `static/images/pta/` | Four original paper figures, credited in the guide |

The visual theme uses Argentina-inspired pastel sky blue (`#EDF6FB`), deeper
blues (`#173858` and `#235E87`), and restrained gold (`#B78A2C`) accents. Palette tokens live at the top of `assets/site.css`. Nunito Sans is
self-hosted in `static/fonts/`; its included SIL license permits redistribution.
The font does not make any requests to Google or other third-party services.
Typography uses four roles: 16px body/supporting text and controls, 20px titles,
32px section headings, and a 64px name (48px on smaller screens). These sizes
are defined together in the type-scale block in `assets/site.css`.

Keep publication IDs stable. Records are ordered by first public appearance,
newest first; arXiv dates are used where available. Preserve author order. The
two earlier AMO papers are preserved in `docs/archived-publications.json` and in
the supplied CV, but are intentionally omitted from the homepage.
Add `explanation.en` and `.es` to give a paper an expandable introduction; omit
the field for a complete compact citation. Descriptions must be at most 200 words
per language. Official titles stay in English in both citations.
The three core projects also have `contribution.en` and `.es`, based on
Fabrizio's own account of his role. The PTA record links to the illustrated guide.

Deep links such as `/#paper-antinuclei` open that paper's explanation. The EN/ES
switch carries all open panels in a small `open` query parameter and preserves
the current visible section/paper. Native details controls work without JavaScript;
automatic opening and cross-language state use the small enhancement script.

See `docs/CONTENT_REVIEW.md` for sources, corrections, and draft status.

## Edit Perspectives

The homepage's former research overview is now Perspectives. Edit each entry in
`data/perspectives.json`; keep its `id` stable so shared links continue to work.
Each language has a `title`, a roughly 20-word `summary`, and `paragraphs` totaling
100–150 words. The build checks these bounds and paired translations.

Cards open a reading dialog with Escape/Close, focus return, a copy-link button,
and an equivalent-language link. Direct URLs such as
`/#perspective-statistics` open the corresponding thought. Back/Forward tracks
opening and closing. Without JavaScript, the full text is readable inline.
The old `#research` anchor still leads to this section. The previous overview
copy and schematic partial are retained as unused references.

The initial text is an editable approximation of Fabrizio's voice, grounded in
his supplied statement, current directions, and papers. See
`docs/PERSPECTIVES_REVIEW.md` for the source mapping and scientific boundaries.

## Talks, writing, and coverage

“Beyond the papers” currently includes the Pheno 2026 talk (with slides and a
link back to the antinuclei paper) and Fabrizio's 2023 Radiations feature essay.
Entries use `kind: talk`, `writing`, or `coverage`; authored writing is labeled
as such rather than presented as independent coverage. Writing can omit `paper`.
Talks can include an additional `slides` URL. Entries appear in data-file order.

Copy the structure in `docs/news-example.json` into `data/news.json`, replacing
every sample field with verified details. The `paper` value must match a stable
publication ID with an explanation. Add a headline and summary for both languages,
an ISO date, outlet, URL, and the source language. The page automatically adds the
navigation item, publication badge, return link, and
temporary highlight. English coverage is identified as such on the Spanish page.
The anticipated Phys.org piece is not included until its details are verified.

## PTA guide

The separate illustrated guide preserves the homepage's section order and loads
the larger figures only when opened. Five bilingual sections explain geometry,
rare encounters, learned models, the correlated Earth term, and forecasts.
Chapter links survive language switching. Figures can be opened at full size;
their original labels are English, with translated captions and alt text.
Figure provenance and scientific boundaries are in `docs/RESEARCH_PASS.md`.

To test the interaction without inventing coverage, run a separate **local demo**:

```sh
sh scripts/preview.sh --environment review --port 1314 --baseURL http://localhost:1314/
```

The explicit review environment includes a clearly labeled fixture from
`data/news_demo.json`. It is excluded from default previews and production builds.
Never publish a review build. Production checks reject the fixture.

## Repository and publication

This folder is the cloned Git repository. The redesign is on local branch
`redesign/bilingual-academic`. The previous Blox content, theme configuration, and
workflows are preserved in `archive/hugo-blox/`; that folder is not published.
The original portrait and October 2026 CV remain untouched one level above this
repository. The handoff and temporary work are also outside the repository.

Nothing has been pushed or deployed. The prepared Pages workflow builds pull
requests without deploying them. **A push/merge to `main`, or a manual workflow run
on `main`, publishes the site at the existing domain.** Obtain Fabrizio's explicit
final publication approval before either action. No DNS change is needed for the
existing custom domain, provided the current Pages settings are retained.

## Unlisted family tree

Local previews: `http://localhost:1313/family/` and
`http://localhost:1313/es/family/`. This standalone page has no incoming site
links, is excluded from sitemaps and page lists, and carries `noindex, nofollow,
noarchive`. It is unlisted, **not access-controlled**: anyone with the URL can
read it, and publishing its source to a public repository also exposes the data.
No family-specific route is advertised in robots.txt. The sitemap setting is
documented in [Hugo's sitemap reference](https://gohugo.io/methods/page/sitemap/).

Edit `data/family.json`. Each stable person ID has a name, an optional two-letter
`birthCountry` code (for example `AR`), and an optional `birthPlace` containing
the city and region, without repeating the country. Omit unknown places and
countries; no nationality is inferred from a surname. Dates use optional
`birthYear`, `deathYear`, and explicitly provided `age`. Point `mother` and/or `father` to other person
IDs to add older generations. Omit unknown parents; do not create empty records.
Only direct ancestors are allowed, up to seven generations before Fabrizio
(eight generations including him). Build checks reject cycles, dangling IDs,
disconnected relatives, and ancestors beyond that limit. A shared ancestor can
appear in both branches without duplicating their record.

Years are shown as supplied. Exact ages are not calculated from years alone.
Argentina, Uruguay, and Italy use local SVG flags; additional country codes use
flag emoji. Flags reveal the full birthplace on hover, keyboard focus, or tap,
with localized country names. Escape, another tap, or a click outside dismisses
the tooltip. Native HTML keeps the tree readable without
JavaScript; JavaScript adds rounded connectors, branch filters, pan, and zoom.
The tree is styled separately, leaving the academic pages unchanged.

Perspectives is currently paused: its template is preserved in `layouts/partials/perspectives.html` and its content in `data/perspectives.json`. The homepage has a commented-out partial call where it can be restored. Research cards use `researchTopics` in `data/copy.json` and `layouts/partials/schematic.html`. Publication contribution text is retained in the data but is not rendered in publication entries.
