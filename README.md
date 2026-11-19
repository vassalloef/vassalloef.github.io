My personal website

## Local development

Run `sh scripts/preview.sh` and open `http://localhost:1313/`. The unlisted,
English-only reading list is at `/papers/`.
Run `sh scripts/build.sh` to build and validate production output. Hugo is
located by the existing helper; no npm install is needed.

## Reading list

The page reads the public Zotero group **6771640**, configured in
`data/reading.json`. Save papers directly into that group using Zotero Connector
or Add Item by Identifier. Edit tags and remove papers in Zotero. Allow Zotero
to sync, then use **Refresh** on the reading page. A website rebuild is needed
only when changing its code or configuration, not when changing the library.

Use Zotero's **Public, Closed Membership** group type, allow anyone to read,
restrict editing to group admins, and keep **No group file storage** selected.
No passwords, API keys, scheduled jobs, or paid services are used by this page.
The public library can be read independently of the website; keep private notes
in your personal Zotero library.

The list shows the authors' original abstracts, with local KaTeX math rendering.
Imported arXiv category tags are mapped to category codes; other tags become
custom labels. Categories match **any** selection, while labels match **all**
selections. Categories expand on demand, and each paper's abstract is hidden
until its own Show abstract button is selected. Search, filters, sort order,
and individually opened abstracts are carried in the URL. Duplicate arXiv IDs (ignoring
version suffixes) are shown once with their combined labels and latest metadata.

API pagination is followed for libraries larger than 100 entries. Successful
snapshots are cached in the visitor's browser; refresh uses Zotero's library
version for conditional requests. If Zotero is unavailable, the last successful
copy is shown with a notice. The first visit requires an internet connection.

The reading page is excluded from navigation, page listings, and sitemaps, and
asks search engines not to index it. It has no language switch or Spanish route.
This is an unlisted public page, not authenticated access; anyone with the URL
can open it, and the underlying Zotero group is also public.

Run `node --test scripts/papers.test.mjs` for data, filtering, pagination, cache,
and rate-limit tests. Node is needed for these tests only, not for Hugo builds.
KaTeX 0.19.1 is vendored in `static/vendor/katex/`, with its MIT license and
upstream provenance. Category names follow Zotero's official arXiv translator.

Publication uses the existing GitHub Pages workflow after approval of the local
preview. The separate paper recommendation process is not part of this page.
