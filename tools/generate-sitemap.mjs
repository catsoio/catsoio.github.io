import { writeFile } from 'node:fs/promises';

const origin = 'https://catso.io'; 
const now = new Date().toISOString();

const routes = [
	{ path: '/home', priority: '1.0' },
	{ path: '/vera-01', priority: '0.9' },
	{ path: '/hemmafest', priority: '0.7' },
	{ path: '/poangjakten/sponsor', priority: '0.7' },
	{ path: '/privacy', priority: '0.3' },
	{ path: '/terms', priority: '0.3' },
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
	.map((r) => urlXml(r.path, now, r.priority))
	.join('')}
</urlset>`;

await writeFile('./dist/catsoio/browser/sitemap.xml', xml);

console.log('✔ sitemap.xml written');
