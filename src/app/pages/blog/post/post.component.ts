import { Component, inject, OnInit, signal } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DEFAULT_SEO } from '../../../seo/defaults.token';

@Component({
	selector: 'app-post',
	standalone: true,
	imports: [],
	templateUrl: './post.component.html',
	styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
	private route = inject(ActivatedRoute);
	private titleSrv = inject(Title);
	private meta = inject(Meta);
	private defaults = inject(DEFAULT_SEO);

	post = signal<any>(null);

	ngOnInit() {
		this.route.data.subscribe(({ post }) => {
			this.post.set(post);
			const title = `${post.title}`;
			const desc = post.excerpt ?? this.defaults.defaultDescription;
			const img = post.ogImage ?? this.defaults.defaultImage;
			this.titleSrv.setTitle(`${title} • ${this.defaults.siteName}`);
			this.meta.updateTag({ name: 'description', content: desc });
			this.meta.updateTag({ property: 'og:title', content: title });
			this.meta.updateTag({ property: 'og:description', content: desc });
			this.meta.updateTag({ property: 'og:type', content: 'article' });
			this.meta.updateTag({ property: 'og:image', content: img });
			this.meta.updateTag({
				name: 'twitter:card',
				content: 'summary_large_image',
			});
			this.meta.updateTag({ name: 'twitter:image', content: img });
		});
	}
}
