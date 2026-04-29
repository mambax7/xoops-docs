import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: {
			name: 'starlight-docs-loader',
			load: glob({
				base: './src/content/docs',
				pattern: '**/[^_]*.{markdown,mdown,mkdn,mkd,mdwn,md,mdx}',
				retainBody: false,
			}).load,
		},
		schema: docsSchema(),
	}),
};
