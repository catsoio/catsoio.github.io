export interface RouteSEO {
	/** Visible page title (without the site name suffix) */
	title: string;
	/** Meta description */
	description?: string;
	/** e.g., "index,follow" or "noindex,nofollow" */
	robots?: string;
	/** Optional absolute canonical URL; if omitted we build it from origin + current path */
	canonical?: string;
	og?: {
		title?: string;
		description?: string;
		type?: string; // website, article, product, etc.
		image?: string; // relative (/assets/...) or absolute
	};
	twitter?: {
		card?: 'summary' | 'summary_large_image' | 'app' | 'player';
		title?: string;
		description?: string;
		image?: string; // relative or absolute
	};
	/** JSON‑LD object for structured data */
	jsonLd?: any;
}

export interface DefaultSeo {
	siteName: string; // e.g., "Catso"
	origin: string; // e.g., "https://catso.io" (no trailing slash)
	defaultDescription: string;
	defaultImage: string; // relative or absolute
	locale?: string; // e.g., "en_US" or "sv_SE"
}
