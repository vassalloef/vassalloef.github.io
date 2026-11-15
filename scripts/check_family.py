#!/usr/bin/env python3
"""Validate the direct-ancestor graph and its unlisted generated pages."""
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]


def validate_family(family):
    people = family['people']
    reached = set()

    def walk(person_id, depth, path):
        assert person_id not in path, f'Ancestor cycle at {person_id}'
        assert depth <= 7, f'{person_id}: maximum is seven generations before the root'
        assert person_id in people, f'Missing person: {person_id}'
        person = people[person_id]
        assert person.get('name', '').strip(), f'{person_id}: name is required'
        if 'birthCountry' in person:
            assert re.fullmatch(r'[A-Z]{2}', person['birthCountry']), f'{person_id}: use a two-letter country code'
        if 'birthPlace' in person:
            assert person['birthPlace'].strip() and person.get('birthCountry'), f'{person_id}: birthplace needs a known country'
        for field in ('birthYear', 'deathYear', 'age'):
            if field in person:
                assert type(person[field]) is int and person[field] >= 0, f'{person_id}: invalid {field}'
        if 'deathYear' in person:
            assert 'birthYear' in person and person['deathYear'] >= person['birthYear'], f'{person_id}: invalid lifespan'
        parents = [person[relation] for relation in ('mother', 'father') if person.get(relation)]
        assert len(parents) == len(set(parents)), f'{person_id}: duplicate parents'
        reached.add(person_id)
        for parent in parents:
            walk(parent, depth + 1, path | {person_id})

    walk(family['root'], 0, set())
    assert reached == set(people), 'Only the root and direct ancestors belong in family.json'
    return reached


class FamilyPage(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.people, self.ids, self.links, self.robots, self.lang = [], [], [], '', ''
        self.flags, self.controls = [], []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'html':
            self.lang = a.get('lang')
        if a.get('name') == 'robots':
            self.robots = a.get('content', '')
        if 'id' in a:
            self.ids.append(a['id'])
        if 'data-person' in a:
            self.people.append(a['data-person'])
        if tag == 'button' and 'data-birthplace' in a:
            self.flags.append((a.get('data-country'), a['data-birthplace']))
            assert a.get('aria-label') and a.get('aria-controls'), 'Birthplace needs an accessible name and tooltip'
        if a.get('aria-controls'):
            self.controls.append(a['aria-controls'])
        if tag in ('a', 'link', 'script', 'img'):
            self.links.append(a.get('href') or a.get('src') or '')


def check_output(output, family):
    for lang, prefix in [('en', ''), ('es', 'es/')]:
        html = (output / prefix / 'family/index.html').read_text()
        page = FamilyPage(html)
        assert page.lang == lang
        assert {'noindex', 'nofollow', 'noarchive'} <= set(page.robots.replace(' ', '').split(','))
        assert set(page.people) == set(family['people']), 'Missing or unexpected relatives'
        assert len(page.ids) == len(set(page.ids)), 'Duplicate tree IDs'
        assert set(page.controls) <= set(page.ids), 'Missing controlled tooltip'
        countries = json.loads((ROOT / 'data/family_copy.json').read_text())[lang]['countries']
        expected_flags = sorted((person['birthCountry'], ', '.join(filter(None, [person.get('birthPlace'), countries.get(person['birthCountry'], person['birthCountry'])]))) for person in family['people'].values() if person.get('birthCountry'))
        assert sorted(set(page.flags)) == sorted(set(expected_flags)), 'Missing or invented birthplace/nationality'
        assert 'livereload' not in html and 'localhost' not in html
        for person in family['people'].values():
            assert person['name'] in html
        for link in page.links:
            parsed = urlparse(link)
            if parsed.scheme or parsed.netloc:
                continue
            if parsed.path:
                local = output / parsed.path.lstrip('/')
                if parsed.path.endswith('/'):
                    local /= 'index.html'
                assert local.exists(), f'Missing family page asset: {link}'
            elif parsed.fragment:
                assert parsed.fragment in page.ids
    # Do not reveal the route through any public page, sitemap, or robots file.
    for path in output.rglob('*'):
        if not path.is_file() or path.suffix not in ('.html', '.xml', '.txt') or 'family' in path.parts:
            continue
        text = path.read_text()
        if path.suffix == '.html':
            links = FamilyPage(text).links
            assert not any('/family/' in link for link in links), f'Unlisted route linked by {path}'
        else:
            assert '/family/' not in text, f'Unlisted route exposed by {path}'
    print('Family tree: direct ancestors, both languages, local assets, noindex, and unlisted routes verified.')


if __name__ == '__main__':
    family = json.loads((ROOT / 'data/family.json').read_text())
    validate_family(family)
    if '--data-only' not in sys.argv:
        check_output(ROOT / (sys.argv[1] if len(sys.argv) > 1 else 'public'), family)
