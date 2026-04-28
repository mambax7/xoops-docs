// apps/docs-4x/astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://xoops.github.io',

	// This version lives at /xoops-docs/4.x/
	// Change to base: '/4.x' when moving to a custom domain (docu.xoops.org)
	base: '/xoops-docs/4.x',

	integrations: [
		starlight({
			title: 'XOOPS 4.x Docs',

			locales: {
				root: { label: 'English', lang: 'en' },
				de:   { label: 'Deutsch',  lang: 'de' },
				fr:   { label: 'Français', lang: 'fr' },
				ar:   { label: 'العربية',  lang: 'ar', dir: 'rtl' },
			},

			sidebar: [
				{
					label: 'Getting Started',
					translations: {
						de: 'Erste Schritte',
						fr: 'Démarrer',
					},
					items: [
						{ slug: 'quick-start' },
						{ slug: 'installation' },
					],
				},
				{
					label: 'Module Development',
					items: [
						{ slug: 'module-guide/introduction' },
					],
				},
				{
					label: 'Migration from 2.7',
					items: [
						{ slug: 'migration/from-2-7' },
					],
				},
			],

			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/XOOPS/xoops-docs' },
			],

			editLink: {
				baseUrl: 'https://github.com/XOOPS/xoops-docs/edit/main/apps/docs-4x/',
			},

			lastUpdated: true,
		}),
	],
});
