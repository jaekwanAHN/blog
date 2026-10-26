"""Check production HTML, discovery, and indexing policy. Python stdlib only.

Run after `pnpm build` and `pnpm start`: python3 scripts/check-seo.py [base URL]
"""
import concurrent.futures
from html.parser import HTMLParser
import json
from pathlib import Path
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

BASE = (sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3000').rstrip('/')
SITE = 'https://ajkblog.vercel.app'


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.meta = {}
        self.canonicals = []
        self.h1 = 0
        self.lang = None
        self.schema = []
        self.script = None
        self.in_title = False
        self.title = ''
        self.links = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'html':
            self.lang = attrs.get('lang')
        elif tag == 'meta':
            self.meta[attrs.get('name', attrs.get('property'))] = attrs.get('content', '')
        elif tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonicals.append(attrs['href'])
        elif tag == 'h1':
            self.h1 += 1
        elif tag == 'title':
            self.in_title = True
        elif tag == 'a':
            self.links.append(attrs.get('href', ''))
        elif tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.script = ''

    def handle_data(self, data):
        if self.script is not None:
            self.script += data
        if self.in_title:
            self.title += data

    def handle_endtag(self, tag):
        if tag == 'script' and self.script is not None:
            self.schema.append(json.loads(self.script))
            self.script = None
        if tag == 'title':
            self.in_title = False


def fetch(path):
    try:
        with urllib.request.urlopen(BASE + path, timeout=30) as response:
            return response.status, response.read().decode(), response.geturl()
    except urllib.error.HTTPError as error:
        return error.code, error.read().decode(), error.geturl()


# Independent inventory prevents a missing sitemap entry from hiding a missing post.
posts = json.loads(subprocess.check_output(['node', '-e', '''
const fs=require('fs'), matter=require('gray-matter');
console.log(JSON.stringify(fs.readdirSync('content/posts').filter(f=>/\\.mdx?$/.test(f)).map(f=>({slug:f.replace(/\\.mdx?$/,''),...matter(fs.readFileSync('content/posts/'+f,'utf8')).data}))));
'''], text=True))
# Pre-encoded static params can work via local fallback but become 404 on Vercel.
# Validate build output as well as HTTP so local fallback cannot hide this regression.
if urllib.parse.urlsplit(BASE).hostname in ('localhost', '127.0.0.1'):
    routes = json.loads(Path('.next/prerender-manifest.json').read_text())['routes']
    tags = {tag.strip() for post in posts if not post.get('draft') for tag in post.get('tags', []) if tag.strip()}
    expected_tag_routes = {'/tags/' + tag for tag in tags}
    actual_tag_routes = {route for route in routes if route.startswith('/tags/')}
    assert actual_tag_routes == expected_tag_routes, 'static tag params must be raw values, not percent-encoded URLs'

for attempt in range(30):
    try:
        if fetch('/')[0] == 200:
            break
    except (OSError, urllib.error.URLError):
        pass
    time.sleep(1)
else:
    raise AssertionError('Server did not become ready')

status, xml, _ = fetch('/sitemap.xml')
assert status == 200, 'sitemap status'
urls = [node.text for node in ET.fromstring(xml).findall('{*}url/{*}loc')]
assert len(urls) == len(set(urls)), 'duplicate sitemap URLs'
expected = {SITE + '/blog/' + p['slug'] for p in posts if not p.get('draft') and not p.get('noindex')}
assert {url for url in urls if '/blog/' in url} == expected, 'sitemap post inventory mismatch'
status, robots, _ = fetch('/robots.txt')
assert status == 200 and 'Sitemap: ' + SITE + '/sitemap.xml' in robots, 'robots sitemap discovery'
assert 'Disallow: /\n' not in robots, 'site blocked'


def check(url):
    assert url.startswith(SITE + '/'), url
    path = url[len(SITE):]
    status, html, final = fetch(path)
    assert status == 200 and final == BASE + path, (path, status, final)
    page = Page()
    page.feed(html)
    assert page.lang == 'ko', path + ': lang'
    assert page.title.strip() and page.meta.get('description'), path + ': metadata'
    assert [value.rstrip('/') for value in page.canonicals] == [url.rstrip('/')], (path, page.canonicals)
    assert page.meta.get('og:url', '').rstrip('/') == url.rstrip('/'), path + ': OG URL'
    assert page.meta.get('twitter:title'), path + ': Twitter title'
    image = SITE + ('/social/posts/' + path.split('/')[-1] + '.png' if path.startswith('/blog/') else '/social/index.png')
    assert page.meta.get('og:image') == image, path + ': OG image'
    assert page.meta.get('og:image:width') == '1200' and page.meta.get('og:image:height') == '630', path + ': OG dimensions'
    assert page.meta.get('og:image:alt'), path + ': OG image alt'
    assert page.meta.get('twitter:card') == 'summary_large_image', path + ': Twitter card'
    assert page.meta.get('twitter:image') == image, path + ': Twitter image'
    assert page.h1 == 1, (path, 'H1', page.h1)
    assert 'noindex' not in page.meta.get('robots', ''), path + ': unexpectedly noindex'
    if '/blog/' in path:
        schema = next(s for s in page.schema if s.get('@type') == 'BlogPosting')
        post = next(p for p in posts if p['slug'] == path.split('/')[-1])
        assert schema['headline'] == post['title'] and schema['url'] == url, path + ': schema'
        assert schema['datePublished'].startswith(post['date']), path + ': published date'
        assert schema['author']['name'] == 'AhnJaeKwan', path + ': author'
        assert schema['image'] == [image], path + ': article image'
        assert page.meta['og:type'] == 'article', path + ': article metadata'
        assert '/' in page.links, path + ': navigation'
    return page.title


with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    titles = list(pool.map(check, urls))
assert len(titles) == len(set(titles)), 'duplicate page titles'
for post in posts:
    if post.get('draft'):
        assert fetch('/blog/' + post['slug'])[0] == 404, 'draft exposed'
    elif post.get('noindex'):
        status, html, _ = fetch('/blog/' + post['slug'])
        page = Page()
        page.feed(html)
        assert status == 200 and 'noindex' in page.meta.get('robots', ''), 'noindex policy'
for path in ['/blog/nonexistent-seo-check', '/page/02', '/page/9999', '/tags/nonexistent-seo-check']:
    assert fetch(path)[0] == 404, path + ': must be 404'
assert fetch('/page/1')[2] == BASE + '/', '/page/1 redirect'
# Verify the actual public assets, including readable noindex posts.
images = ['/social/index.png'] + ['/social/posts/' + p['slug'] + '.png' for p in posts if not p.get('draft')]
for image in images:
    with urllib.request.urlopen(BASE + image, timeout=30) as response:
        assert response.status == 200 and response.headers.get_content_type() == 'image/png', image
        data = response.read()
        assert data[:8] == b'\x89PNG\r\n\x1a\n', image + ': PNG signature'
        assert int.from_bytes(data[16:20], 'big') == 1200 and int.from_bytes(data[20:24], 'big') == 630, image + ': PNG dimensions'
print(f'PASS: {len(urls)} sitemap URLs, {len(posts)} post policies, metadata/schema, and invalid routes')
print(f'PASS: {len(images)} social images and OG/Twitter metadata')
