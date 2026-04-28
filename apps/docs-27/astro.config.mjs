// apps/docs-27/astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	// Where the final site is hosted — used for canonical URLs and sitemaps
	site: 'https://xoops.github.io',

	// GitHub Pages serves this repo at /xoops-docs/
	// This version lives at /xoops-docs/2.7/
	// Change to base: '/2.7' when moving to a custom domain (docu.xoops.org)
	base: '/xoops-docs/2.7',

	integrations: [
		starlight({
			title: 'XOOPS 2.7 Docs',

			// No defaultLocale needed — 'root' locale is always the fallback
			locales: {
				// English is the root locale: /xoops-docs/2.7/quick-start/
				root: { label: 'English', lang: 'en' },
				// German:  /xoops-docs/2.7/de/quick-start/
				de:   { label: 'Deutsch',  lang: 'de' },
				// French:  /xoops-docs/2.7/fr/quick-start/
				fr:   { label: 'Français', lang: 'fr' },
				// Arabic:  /xoops-docs/2.7/ar/quick-start/  (RTL)
				ar:   { label: 'العربية',  lang: 'ar', dir: 'rtl' },
			},

			sidebar: [
				{
					label: 'Getting Started',
					translations: {
						de: 'Erste Schritte',
						fr: 'Démarrer',
						ar: 'البدء',
					},
					items: [
						{ slug: 'quick-start' },
						{ slug: 'installation' },
					],
				},
				{
					label: 'Module Development',
					translations: {
						de: 'Modulentwicklung',
						fr: 'Développement de modules',
					},
					items: [
						{ slug: 'module-guide/introduction' },
					],
				},
				{
					label: 'Theme Development',
					translations: {
						de: 'Theme-Entwicklung',
						fr: 'Développement de thèmes',
					},
					items: [
						{ slug: 'theme-guide/introduction' },
					],
				},
				{
					label: 'Migration',
					translations: {
						de: 'Migration',
						fr: 'Migration',
					},
					items: [
						{ slug: 'migration/from-2-5' },
					],
				},
			],

			// Social links — array format required in Starlight 0.30+
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/XOOPS/xoops-docs' },
			],

			editLink: {
				baseUrl: 'https://github.com/XOOPS/xoops-docs/edit/main/apps/docs-27/',
			},

			lastUpdated: true,
		}),
	],
});
