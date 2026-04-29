import { defineCollection } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';
import { deferredDocsLoader } from './deferred-docs-loader';

export const collections = {
	docs: defineCollection({
		loader: deferredDocsLoader(),
		schema: docsSchema(),
	}),
};
