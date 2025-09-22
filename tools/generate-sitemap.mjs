import { writeFile } from 'node:fs/promises';

const origin = 'https://catso.io';
const now = new Date().toISOString();

const routes = [
	'/home',
	'/vera-01',
];

const urlXml = (loc, lastmod, priority = '0.8', changefreq = 'weekly') => `
  <url>
    <loc>${origin}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes
	.map((p) => urlXml(p, now, p === '/' ? '1.0' : '0.8'))
	.join('')}
</urlset>`;

await writeFile('./dist/catsoio.github.io/browser/sitemap.xml', xml);

console.log('✔ sitemap.xml written');
