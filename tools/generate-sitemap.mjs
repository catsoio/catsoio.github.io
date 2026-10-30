import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const origin = 'https://catso.io';
const out = './dist/catsoio/browser';

// Bara sidor som ska synas i sökresultat. Google ignorerar priority/changefreq,
// och ett påhittat lastmod skadar mer än det hjälper, så de lämnas bort.
const routes = [
	'/',
	'/apps/axle',
	'/vera-01',
	'/shopify/apps/ai-search',
	'/hemmafest',
	'/hemmafest/business',
	'/poangjakten/sponsor',
];

// GitHub Pages kan inte göra 301. Utan en fil svarar de här adresserna 404,
// så vi lägger en sida med canonical + meta refresh som sökmotorer följer.
const redirects = {
	'/home': '/',
	'/verkstad': '/apps/axle',
	'/apps/verkstad': '/apps/axle',
	'/verkstad/kom-igang': '/axle/kom-igang',
	'/verkstad/info': '/axle/info',
	'/dacklager': '/apps/axle',
	'/inventory': '/apps/axle',
	'/shopify/ai-search': '/shopify/apps/ai-search',
};

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${origin}${r}</loc></url>`).join('\n')}
</urlset>
`;
await writeFile(join(out, 'sitemap.xml'), sitemap);
console.log('✔ sitemap.xml written');

const stub = (to) => `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<title>Omdirigerar till Catso</title>
<link rel="canonical" href="${origin}${to}">
<meta http-equiv="refresh" content="0; url=${to}">
</head>
<body><a href="${to}">Fortsätt hit</a></body>
</html>
`;

for (const [from, to] of Object.entries(redirects)) {
	const file = join(out, from, 'index.html');
	await mkdir(dirname(file), { recursive: true });
	await writeFile(file, stub(to));
}
console.log(`✔ ${Object.keys(redirects).length} redirect pages written`);
