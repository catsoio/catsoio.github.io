// Kontrollerar den byggda sajten innan den publiceras: varje sida i sitemap ska gå att indexera och
// ha rätt titel, beskrivning, canonical och en h1, interna länkar ska leda till sidor som finns,
// och 404.html ska vara noindex. Körs efter bygget (postbuild) och stoppar bygget vid fel.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const origin = 'https://catso.io';
const root = './dist/catsoio/browser';
const errors = [];
const fail = (page, msg) => errors.push(`${page}: ${msg}`);

const fileOf = (path) => {
	const clean = path.split('#')[0].split('?')[0];
	for (const f of [join(root, clean), join(root, clean, 'index.html')])
		if (existsSync(f) && statSync(f).isFile()) return f;
	return null;
};
const attr = (html, re) => re.exec(html)?.[1];
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urls.length) fail('sitemap.xml', 'inga adresser');

const titles = new Map();
const descriptions = new Map();
const linked = new Set();

for (const url of urls) {
	if (!url.startsWith(origin)) {
		fail(url, 'sitemap-adress utanför catso.io');
		continue;
	}
	const path = url.slice(origin.length) || '/';
	const file = fileOf(path);
	if (!file) {
		fail(path, 'finns i sitemap men saknas i bygget');
		continue;
	}
	const html = readFileSync(file, 'utf8');
	const title = decode(attr(html, /<title>([^<]*)<\/title>/) ?? '');
	const desc = decode(attr(html, /<meta name="description" content="([^"]*)"/) ?? '');
	const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
	const robots = attr(html, /<meta name="robots" content="([^"]*)"/) ?? '';
	const h1 = (html.match(/<h1[\s>]/g) ?? []).length;

	if (title.length < 15 || title.length > 70) fail(path, `titeln är ${title.length} tecken (15–70): "${title}"`);
	if (desc.length < 70 || desc.length > 180) fail(path, `beskrivningen är ${desc.length} tecken (70–180)`);
	if (canonical !== `${origin}${path}`) fail(path, `canonical är ${canonical}, väntade ${origin}${path}`);
	if (/noindex/i.test(robots)) fail(path, 'ligger i sitemap men är noindex');
	if (h1 !== 1) fail(path, `${h1} h1-rubriker, ska vara exakt en`);
	if (titles.has(title)) fail(path, `samma titel som ${titles.get(title)}`);
	if (descriptions.has(desc)) fail(path, `samma beskrivning som ${descriptions.get(desc)}`);
	titles.set(title, path);
	descriptions.set(desc, path);

	for (const m of html.matchAll(/<a\b[^>]*\shref="(\/[^"#?]*)/g)) linked.add(`${path} -> ${m[1]}`);
}

for (const edge of linked) {
	const [from, to] = edge.split(' -> ');
	if (!fileOf(to)) fail(from, `länk till ${to} som inte finns`);
}

const notFound = join(root, '404.html');
if (!existsSync(notFound)) fail('404.html', 'saknas');
else if (!/noindex/i.test(readFileSync(notFound, 'utf8'))) fail('404.html', 'saknar noindex');

const robots = readFileSync(join(root, 'robots.txt'), 'utf8');
if (!robots.includes('Sitemap: https://catso.io/sitemap.xml')) fail('robots.txt', 'pekar inte på sitemap');

// Sidor som är byggda men inte i sitemap ska vara noindex eller omdirigeringar.
const walk = (dir) =>
	readdirSync(dir).flatMap((n) => {
		const p = join(dir, n);
		return statSync(p).isDirectory() ? walk(p) : p.endsWith('index.html') ? [p] : [];
	});
const inSitemap = new Set(urls.map((u) => u.slice(origin.length) || '/'));
for (const f of walk(root)) {
	const norm = '/' + relative(root, f).replace(/(^|\/)index\.html$/, '');
	if (inSitemap.has(norm)) continue;
	const html = readFileSync(f, 'utf8');
	const robots = attr(html, /<meta name="robots" content="([^"]*)"/) ?? '';
	const stub = /http-equiv="refresh"/.test(html);
	if (!stub && !/noindex/i.test(robots) && !/\/hemmafest\/(privacy|terms)$/.test(norm))
		fail(norm, 'byggd sida som är indexerbar men inte i sitemap');
}

if (errors.length) {
	console.error(`\n✘ SEO-kontrollen hittade ${errors.length} fel:\n  ` + errors.join('\n  '));
	process.exit(1);
}
console.log(`✔ SEO-kontrollen: ${urls.length} sidor i sitemap, ${linked.size} interna länkar kontrollerade`);
