#!/usr/bin/env python3
"""Check bilingual content, references, and generated pages without dependencies."""
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / (sys.argv[1] if len(sys.argv) > 1 else 'public')

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids, self.links, self.lang, self.alternates, self.robots = [], [], None, [], ''
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            self.ids.append(a['id'])
        if tag == 'html':
            self.lang = a.get('lang')
        if tag == 'meta' and a.get('name') == 'robots':
            self.robots = a.get('content', '')
        if tag == 'link' and a.get('rel') == 'alternate':
            self.alternates.append(a.get('hreflang'))
        if tag in ('a', 'link', 'script', 'img'):
            self.links.append(a.get('href') or a.get('src') or '')

papers = json.loads((ROOT / 'data/publications.json').read_text())
copy = json.loads((ROOT / 'data/copy.json').read_text())
news = json.loads((ROOT / 'data/news.json').read_text())
perspectives = json.loads((ROOT / 'data/perspectives.json').read_text())
perspective_ids = [item['id'] for item in perspectives]
assert len(perspective_ids) == len(set(perspective_ids)), 'Duplicate perspective IDs'
for item in perspectives:
    assert item['art'] in ('experiments', 'learning', 'statistics')
    for lang in ('en', 'es'):
        text = item[lang]
        assert text['title']
        assert 15 <= len(text['summary'].split()) <= 25, 'Perspective blurb should be about 20 words'
        count = len(' '.join(text['paragraphs']).split())
        assert 100 <= count <= 150, f'{item["id"]}/{lang}: {count} words'
        print(f'{item["id"]}/{lang}: {count} words')
ids = [p['id'] for p in papers]
assert len(ids) == len(set(ids)), 'Duplicate paper IDs'
assert set(copy['en']) == set(copy['es']), 'Unpaired interface translations'
for paper in papers:
    assert paper['authors'] and paper['title'] and paper['year']
    if 'contribution' in paper:
        assert set(paper['contribution']) == {'en', 'es'}
        assert all(paper['contribution'].values())
    if 'explanation' in paper:
        assert set(paper['explanation']) == {'en', 'es'}
        for lang, explanation in paper['explanation'].items():
            count = len(' '.join(explanation['paragraphs']).split())
            assert 50 <= count <= 200, f'{paper["id"]}/{lang}: {count} words'
            print(f'{paper["id"]}/{lang}: {count} words')
for item in news:
    assert not item.get('demo'), 'Demo fixture in real news data'
    assert item.get('kind', 'coverage') in ('talk', 'writing', 'coverage')
    if item.get('slides'):
        assert item['slides'].startswith('https://')
    if item.get('paper'):
        assert item['paper'] in ids, 'News references missing paper'
        assert 'explanation' in next(p for p in papers if p['id'] == item['paper']), 'Coverage needs a paper explanation'
    else:
        assert item.get('kind') == 'writing', 'Unlinked entry must be authored writing'
    assert item['url'].startswith('https://') and (item.get('date') or item.get('year')) and item['outlet']
    for lang in ('en', 'es'):
        assert item[lang]['headline'] and item[lang]['summary']
for lang, path in [('en', OUTPUT / 'index.html'), ('es', OUTPUT / 'es/index.html')]:
    html = path.read_text()
    page = Page(html)
    assert page.lang == lang
    assert set(page.alternates) >= {'en', 'es', 'x-default'}
    assert len(page.ids) == len(set(page.ids)), f'Duplicate HTML IDs in {lang}'
    assert all(p in page.ids for p in ids), f'Missing paper in {lang}'
    assert not any(p in page.ids for p in perspective_ids), f'Paused perspective exposed in {lang}'
    assert 'perspective-reader' not in page.ids and 'perspectives' not in page.ids
    assert 'research' in page.ids
    assert all(f"research-{topic['id']}-title" in page.ids for topic in copy[lang]['researchTopics'])
    assert 'paper-contribution' not in html
    assert len(re.findall(r'<details\s+class=[\"\']?paper-details[\"\'\s>]', html)) == sum('explanation' in p for p in papers)
    assert ('id="news"' in html or 'id=news' in html) == bool(news), 'Empty or missing news section'
    assert 'Demo fixture' not in html and 'news-demo' not in html, 'Demo content in production'
    assert 'livereload' not in html, 'Development script in production'
    assert 'localhost' not in html, 'Local URL in production'
    assert 'GitHub' not in html, 'Removed profile button reappeared'
    for link in page.links:
        parsed = urlparse(link)
        if parsed.scheme or parsed.netloc:
            continue
        if parsed.fragment and not parsed.path:
            assert unquote(parsed.fragment) in page.ids, f'Broken anchor: {link}'
        elif parsed.path:
            local = OUTPUT / unquote(parsed.path).lstrip('/')
            if parsed.path.endswith('/'):
                local /= 'index.html'
            assert local.exists(), f'Missing local asset/page: {link}'
    print(f'{lang}: language metadata, anchors, local links, and production content verified')
# The extended PTA article is paused; its source is retained as a draft.
for prefix in ('', 'es/'):
    assert not (OUTPUT / prefix / 'research/pulsar-timing/index.html').exists(), 'Paused PTA article published'
    homepage = (OUTPUT / prefix / 'index.html').read_text()
    assert 'research/pulsar-timing/' not in homepage, 'Link to paused PTA article published'
assert 'research/pulsar-timing/' not in (OUTPUT / 'sitemap.xml').read_text()
reading = json.loads((ROOT / 'data/reading.json').read_text())
reading_path = OUTPUT / 'papers/index.html'
html = reading_path.read_text()
page = Page(html)
assert page.lang == 'en' and not page.alternates
assert {'noindex', 'nofollow', 'noarchive'} <= set(page.robots.replace(' ', '').split(','))
assert 'class=language-switch' not in html and 'class="language-switch"' not in html
assert len(page.ids) == len(set(page.ids)), 'Duplicate reading-list IDs'
assert {'reading-config', 'paper-search', 'paper-list', 'category-options', 'label-options'} <= set(page.ids)
assert str(reading['groupId']) in html and 'localhost' not in html and 'livereload' not in html
for link in page.links:
    parsed = urlparse(link)
    if parsed.scheme or parsed.netloc:
        continue
    if parsed.fragment and not parsed.path:
        assert unquote(parsed.fragment) in page.ids, f'Broken reading-list anchor: {link}'
    elif parsed.path:
        local = OUTPUT / unquote(parsed.path).lstrip('/')
        if parsed.path.endswith('/'):
            local /= 'index.html'
        assert local.exists(), f'Missing reading-list asset: {link}'
assert not (OUTPUT / 'es/papers/index.html').exists(), 'Unexpected translated reading page'
for other in OUTPUT.rglob('*.html'):
    if other != reading_path:
        assert '/papers/' not in other.read_text(), f'Unlisted reading page linked in {other}'
for sitemap in OUTPUT.rglob('*sitemap*.xml'):
    assert '/papers/' not in sitemap.read_text(), 'Reading list exposed in sitemap'
assert '/papers/' not in (OUTPUT / 'robots.txt').read_text(), 'Reading route disclosed by robots.txt'
print('Reading list: English-only unlisted route, noindex, no public links or sitemap entries, and local assets verified.')
print(f'OK: {len(papers)} papers, six explanations, {len(perspectives)} archived perspectives, bilingual homepage, and no published PTA article.')
