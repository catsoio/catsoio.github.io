import { MODULER, modulBySlug } from './axle-moduler.data';
import { axleModulSeo } from '../../seo/seo.consts';

describe('Axle modulsidor', () => {
	it('har unika adresser och varje relaterad sida finns', () => {
		const slugs = MODULER.map((m) => m.slug);
		expect(new Set(slugs).size).toBe(slugs.length);
		for (const m of MODULER) {
			expect(m.related.length).toBeGreaterThan(0);
			for (const r of m.related) {
				expect(r).not.toBe(m.slug);
				expect(modulBySlug(r)).toBeDefined();
			}
		}
	});

	it('har titel och beskrivning inom gränserna som check-seo kräver, och inga dubbletter', () => {
		const titles = new Set<string>();
		const descriptions = new Set<string>();
		for (const m of MODULER) {
			expect(m.seoTitle.length).toBeGreaterThanOrEqual(15);
			expect(m.seoTitle.length).toBeLessThanOrEqual(70);
			expect(m.seoDescription.length).toBeGreaterThanOrEqual(70);
			expect(m.seoDescription.length).toBeLessThanOrEqual(180);
			expect(titles.has(m.seoTitle)).toBe(false);
			expect(descriptions.has(m.seoDescription)).toBe(false);
			titles.add(m.seoTitle);
			descriptions.add(m.seoDescription);
		}
	});

	it('har innehåll på varje sida och ett canonical per adress', () => {
		for (const m of MODULER) {
			expect(m.blocks.length).toBeGreaterThanOrEqual(3);
			expect(m.faqs.length).toBeGreaterThanOrEqual(3);
			expect(axleModulSeo(m).canonical).toBe(`https://catso.io/axle/${m.slug}`);
		}
	});
});
