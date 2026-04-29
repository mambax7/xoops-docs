// apps/docs-4x/astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://xoops.github.io',
	base: '/xoops-docs/4.x',

	integrations: [
		starlight({
			title: 'XOOPS 4.x Docs',

			head: [
				{
					tag: 'script',
					attrs: { type: 'module', src: '/xoops-docs/4.x/mermaid-init.js' },
				},
			],

			locales: {
				root: { label: 'English', lang: 'en' },
			},

			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/XOOPS/xoops-docs' },
			],

			editLink: {
				baseUrl: 'https://github.com/XOOPS/xoops-docs/edit/master/apps/docs-4x/',
			},

			lastUpdated: true,

			expressiveCode: {
				shiki: {
					langAlias: {
						smarty: 'html',
						neon: 'yaml',
					},
					bundledLangs: [
						'php', 'javascript', 'typescript',
						'html', 'css',
						'bash', 'shell', 'sql',
						'json', 'yaml', 'astro',
					],
				},
			},

			sidebar: [
				// ── Getting Started ──────────────────────────────────────────
				{
					label: 'Getting Started',
					items: [
						{ slug: 'quick-start' },
						{ slug: 'installation' },
						{ slug: 'whats-new' },
						{ slug: 'quick-reference' },
					],
				},

				// ── Architecture ─────────────────────────────────────────────
				{
					label: 'Architecture',
					items: [
						{ slug: 'architecture' },
						{ slug: 'architecture/diagrams' },
					],
				},

				// ── PSR Standards ────────────────────────────────────────────
				{
					label: 'PSR Standards',
					items: [
						{ slug: 'psr-standards' },
						{ slug: 'psr-standards/psr-4' },
						{ slug: 'psr-standards/psr-7' },
						{ slug: 'psr-standards/psr-11' },
						{ slug: 'psr-standards/psr-15' },
					],
				},

				// ── Implementation Guides ────────────────────────────────────
				{
					label: 'Implementation Guides',
					items: [
						{ slug: 'implementation/rest-api' },
						{ slug: 'implementation/module-json' },
						{ slug: 'implementation/dependency-injection' },
						{ slug: 'implementation/middleware' },
						{ slug: 'implementation/cqrs' },
						{ slug: 'implementation/event-sourcing' },
						{ slug: 'implementation/event-system' },
						{ slug: 'implementation/domain-exceptions' },
						{ slug: 'implementation/ulid-storage' },
						{ slug: 'implementation/xmf-components' },
					],
				},

				// ── Module Development ───────────────────────────────────────
				{
					label: 'Module Development',
					items: [
						{ slug: 'module-guide/introduction' },
						{ slug: 'module-guide/getting-started' },
						{ slug: 'module-guide/adding-rest-api' },
					],
				},

				// ── Tools ────────────────────────────────────────────────────
				{
					label: 'Tools',
					items: [
						{ slug: 'tools/module-generator' },
						{ slug: 'tools/test-generator' },
						{ slug: 'tools/vscode-snippets' },
						{ slug: 'tools/ci' },
					],
				},

				// ── Migration ────────────────────────────────────────────────
				{
					label: 'Migration',
					items: [
						{ slug: 'migration/from-2-7' },
						{ slug: 'migration/from-2-5' },
						{ slug: 'migration/modules' },
						{ slug: 'migration/php-8' },
					],
				},

				// ── Roadmap ──────────────────────────────────────────────────
				{
					label: 'Roadmap',
					collapsed: true,
					items: [
						{ slug: 'roadmap' },
						{ slug: 'roadmap/vision' },
						{ slug: 'roadmap/specification' },
					],
				},

				// ── Reference ────────────────────────────────────────────────
				{
					label: 'Reference',
					collapsed: true,
					items: [
						{ slug: 'reference/xmf-entity-id' },
						{ slug: 'reference/xmf-slug' },
						{ slug: 'reference/hybrid-mode' },
					],
				},
			],
		}),
	],
});
