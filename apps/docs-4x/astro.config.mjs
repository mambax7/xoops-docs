// apps/docs-4x/astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	// The base path for this version — critical for URL structure
	base: '/2.7',

	integrations: [
		starlight({
			title: 'XOOPS 2.7 Docs',
			logo: {
				src: './src/assets/xoops-logo.svg',
			},

			// Default language = English (no prefix in URL)
			defaultLocale: 'en',
			locales: {
				// Root = English: docu.xoops.org/2.7/quick-start/
				root: { label: 'English', lang: 'en' },
				// German:  docu.xoops.org/2.7/de/quick-start/
				de: { label: 'Deutsch', lang: 'de' },
				// French:  docu.xoops.org/2.7/fr/quick-start/
				fr: { label: 'Français', lang: 'fr' },
				// Arabic:  docu.xoops.org/2.7/ar/quick-start/ (RTL)
				ar: { label: 'العربية', lang: 'ar', dir: 'rtl' },
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
						{ slug: 'configuration' },
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
						{ slug: 'module-guide/structure' },
						{ slug: 'module-guide/xoops-object' },
					],
				},
				{
					label: 'Theme Development',
					items: [
						{ slug: 'theme-guide/introduction' },
						{ slug: 'theme-guide/smarty-variables' },
					],
				},
				{
					label: 'Upgrading',
					items: [
						{ slug: 'migration/from-2-6' },
						{ slug: 'migration/from-wordpress' },
					],
				},
			],

			// GitHub edit links
			editLink: {
				baseUrl: 'https://github.com/XOOPS/xoops-docs/edit/main/apps/docs-4x/',
			},

			// Last updated timestamps
			lastUpdated: true,

			// Social links
			social: {
				github: 'https://github.com/XOOPS/xoops-docs',
			},
		}),
	],
});
