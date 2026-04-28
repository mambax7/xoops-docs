// apps/docs-27/astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://xoops.github.io',
	base: '/xoops-docs/2.7',

	integrations: [
		starlight({
			title: 'XOOPS 2.7 Docs',

			locales: {
				root: { label: 'English', lang: 'en' },
				de:   { label: 'Deutsch',  lang: 'de' },
				fr:   { label: 'Français', lang: 'fr' },
				ar:   { label: 'العربية',  lang: 'ar', dir: 'rtl' },
			},

			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/XOOPS/xoops-docs' },
			],

			editLink: {
				baseUrl: 'https://github.com/XOOPS/xoops-docs/edit/master/apps/docs-27/',
			},

			lastUpdated: true,

			sidebar: [
				// ── Getting Started ──────────────────────────────────────────
				{
					label: 'Getting Started',
					items: [
						{ slug: 'quick-start' },
						{
							label: 'Installation',
							items: [
								{ slug: 'installation' },
								{ slug: 'installation/requirements' },
								{ slug: 'installation/preparations' },
								{ slug: 'installation/ftp-upload' },
								{
									label: 'Installation Wizard',
									collapsed: true,
									items: [
										{ slug: 'installation/wizard' },
										{ slug: 'installation/wizard/step-01' },
										{ slug: 'installation/wizard/step-02' },
										{ slug: 'installation/wizard/step-03' },
										{ slug: 'installation/wizard/step-04' },
										{ slug: 'installation/wizard/step-05' },
										{ slug: 'installation/wizard/step-06' },
										{ slug: 'installation/wizard/step-07' },
										{ slug: 'installation/wizard/step-08' },
										{ slug: 'installation/wizard/step-09' },
										{ slug: 'installation/wizard/step-10' },
										{ slug: 'installation/wizard/step-11' },
										{ slug: 'installation/wizard/step-12' },
										{ slug: 'installation/wizard/step-13' },
										{ slug: 'installation/wizard/step-14' },
										{ slug: 'installation/wizard/step-15' },
									],
								},
								{
									label: 'Upgrading',
									collapsed: true,
									items: [
										{ slug: 'installation/upgrade' },
										{ slug: 'installation/upgrade/preflight' },
										{ slug: 'installation/upgrade/step-01' },
										{ slug: 'installation/upgrade/step-02' },
										{ slug: 'installation/upgrade/step-03' },
										{ slug: 'installation/upgrade/step-04' },
									],
								},
								{ slug: 'installation/moving-a-site' },
								{ slug: 'installation/security-hardening' },
								{ slug: 'installation/special-topics' },
							],
						},
						{
							label: 'First Steps',
							items: [
								{ slug: 'getting-started/admin-panel' },
								{ slug: 'getting-started/first-page' },
								{ slug: 'getting-started/installing-modules' },
								{ slug: 'getting-started/managing-users' },
								{ slug: 'getting-started/configure-email' },
								{ slug: 'getting-started/tools' },
							],
						},
					],
				},

				// ── Configuration ────────────────────────────────────────────
				{
					label: 'Configuration',
					items: [
						{ slug: 'configuration' },
						{ slug: 'configuration/system-settings' },
						{ slug: 'configuration/performance' },
						{ slug: 'configuration/security' },
					],
				},

				// ── Core Concepts ────────────────────────────────────────────
				{
					label: 'Core Concepts',
					items: [
						{ slug: 'core-concepts/architecture' },
						{ slug: 'core-concepts/design-patterns' },
						{ slug: 'core-concepts/dependency-injection' },
						{ slug: 'core-concepts/event-system' },
						{ slug: 'core-concepts/hooks-events' },
						{
							label: 'Database',
							items: [
								{ slug: 'core-concepts/database' },
							],
						},
						{
							label: 'Forms',
							items: [
								{ slug: 'core-concepts/forms' },
								{ slug: 'core-concepts/forms/elements' },
								{ slug: 'core-concepts/forms/validation' },
								{ slug: 'core-concepts/forms/custom-renderers' },
							],
						},
						{
							label: 'Security',
							items: [
								{ slug: 'core-concepts/security/best-practices' },
								{ slug: 'core-concepts/security/guidelines' },
								{ slug: 'core-concepts/security/csrf' },
								{ slug: 'core-concepts/security/input-sanitization' },
								{ slug: 'core-concepts/security/sql-injection' },
							],
						},
						{
							label: 'Templates (Smarty)',
							items: [
								{ slug: 'core-concepts/templates' },
								{ slug: 'core-concepts/templates/smarty-basics' },
								{ slug: 'core-concepts/templates/variables' },
								{ slug: 'core-concepts/templates/smarty-4-migration' },
							],
						},
						{
							label: 'Users & Permissions',
							items: [
								{ slug: 'core-concepts/users/management' },
								{ slug: 'core-concepts/users/authentication' },
								{ slug: 'core-concepts/users/permissions' },
								{ slug: 'core-concepts/users/groups' },
							],
						},
					],
				},

				// ── Module Development ───────────────────────────────────────
				{
					label: 'Module Development',
					items: [
						{ slug: 'module-guide/introduction' },
						{ slug: 'module-guide/structure' },
						{ slug: 'module-guide/xoops-version-php' },
						{ slug: 'module-guide/blocks' },
						{ slug: 'module-guide/database-operations' },
						{ slug: 'module-guide/data-access-patterns' },
						{ slug: 'module-guide/best-practices' },
						{
							label: 'Patterns',
							collapsed: true,
							items: [
								{ slug: 'module-guide/patterns/mvc' },
								{ slug: 'module-guide/patterns/repository' },
								{ slug: 'module-guide/patterns/service-layer' },
								{ slug: 'module-guide/patterns/domain-model' },
								{ slug: 'module-guide/patterns/dto' },
								{ slug: 'module-guide/patterns/unit-of-work' },
							],
						},
						{
							label: 'Best Practices',
							collapsed: true,
							items: [
								{ slug: 'module-guide/best-practices/clean-code' },
								{ slug: 'module-guide/best-practices/code-organization' },
								{ slug: 'module-guide/best-practices/code-smells' },
								{ slug: 'module-guide/best-practices/error-handling' },
								{ slug: 'module-guide/best-practices/testing' },
								{ slug: 'module-guide/best-practices/frontend' },
							],
						},
						{
							label: 'Database',
							items: [
								{ slug: 'module-guide/database/schema' },
								{ slug: 'module-guide/database/migrations' },
							],
						},
						{
							label: 'Examples',
							items: [
								{ slug: 'module-guide/examples/simple-module' },
								{ slug: 'module-guide/examples/advanced-module' },
							],
						},
						{
							label: 'Tutorials',
							items: [
								{ slug: 'module-guide/tutorials/hello-world' },
								{ slug: 'module-guide/tutorials/crud-module' },
							],
						},
					],
				},

				// ── Theme Development ────────────────────────────────────────
				{
					label: 'Theme Development',
					items: [
						{ slug: 'theme-guide/introduction' },
						{ slug: 'theme-guide/structure' },
						{ slug: 'theme-guide/css-best-practices' },
					],
				},

				// ── XMF Framework ────────────────────────────────────────────
				{
					label: 'XMF Framework',
					items: [
						{ slug: 'xmf' },
						{ slug: 'xmf/getting-started' },
						{ slug: 'xmf/module-helper' },
						{ slug: 'xmf/request' },
						{
							label: 'Recipes',
							items: [
								{ slug: 'xmf/recipes/admin-pages' },
								{ slug: 'xmf/recipes/permission-helper' },
							],
						},
						{
							label: 'Reference',
							items: [
								{ slug: 'xmf/reference/database' },
								{ slug: 'xmf/reference/jwt' },
								{ slug: 'xmf/reference/metagen' },
							],
						},
					],
				},

				// ── API Reference ────────────────────────────────────────────
				{
					label: 'API Reference',
					collapsed: true,
					items: [
						{ slug: 'api-reference' },
						{
							label: 'Core Classes',
							items: [
								{ slug: 'api-reference/core/xoops-object' },
								{ slug: 'api-reference/core/xoops-object-handler' },
							],
						},
						{
							label: 'Database',
							items: [
								{ slug: 'api-reference/database/xoops-database' },
								{ slug: 'api-reference/database/query-builder' },
								{ slug: 'api-reference/database/criteria' },
							],
						},
						{
							label: 'Forms',
							items: [
								{ slug: 'api-reference/forms/xoops-form' },
							],
						},
						{
							label: 'Kernel',
							items: [
								{ slug: 'api-reference/kernel/classes' },
								{ slug: 'api-reference/kernel/criteria' },
							],
						},
						{
							label: 'Module',
							items: [
								{ slug: 'api-reference/module/system' },
								{ slug: 'api-reference/module/xoops-module' },
							],
						},
						{
							label: 'Template',
							items: [
								{ slug: 'api-reference/template/system' },
								{ slug: 'api-reference/template/smarty' },
							],
						},
						{
							label: 'User',
							items: [
								{ slug: 'api-reference/user/system' },
								{ slug: 'api-reference/user/xoops-user' },
							],
						},
					],
				},

				// ── Modules ──────────────────────────────────────────────────
				{
					label: 'Modules',
					collapsed: true,
					items: [
						{
							label: 'Publisher',
							items: [
								{ slug: 'modules/publisher' },
								{
									label: 'User Guide',
									items: [
										{ slug: 'modules/publisher/user-guide/getting-started' },
										{ slug: 'modules/publisher/user-guide/installation' },
										{ slug: 'modules/publisher/user-guide/configuration' },
										{ slug: 'modules/publisher/user-guide/articles' },
										{ slug: 'modules/publisher/user-guide/categories' },
										{ slug: 'modules/publisher/user-guide/permissions' },
									],
								},
								{
									label: 'Developer Guide',
									items: [
										{ slug: 'modules/publisher/developer-guide/analysis' },
										{ slug: 'modules/publisher/developer-guide/api-reference' },
										{ slug: 'modules/publisher/developer-guide/hooks-events' },
										{ slug: 'modules/publisher/developer-guide/templates' },
										{ slug: 'modules/publisher/developer-guide/custom-templates' },
										{ slug: 'modules/publisher/developer-guide/extending' },
									],
								},
							],
						},
					],
				},

				// ── Troubleshooting ──────────────────────────────────────────
				{
					label: 'Troubleshooting',
					items: [
						{ slug: 'troubleshooting' },
						{
							label: 'Common Issues',
							items: [
								{ slug: 'troubleshooting/database-connection' },
								{ slug: 'troubleshooting/module-installation' },
								{ slug: 'troubleshooting/permission-denied' },
								{ slug: 'troubleshooting/template-errors' },
								{ slug: 'troubleshooting/white-screen' },
							],
						},
						{
							label: 'Debugging',
							items: [
								{ slug: 'troubleshooting/debugging/debug-mode' },
								{ slug: 'troubleshooting/debugging/database' },
								{ slug: 'troubleshooting/debugging/smarty' },
								{ slug: 'troubleshooting/debugging/ray' },
							],
						},
						{
							label: 'FAQ',
							items: [
								{ slug: 'troubleshooting/faq/installation' },
								{ slug: 'troubleshooting/faq/modules' },
								{ slug: 'troubleshooting/faq/performance' },
								{ slug: 'troubleshooting/faq/themes' },
							],
						},
					],
				},

				// ── Migration ────────────────────────────────────────────────
				{
					label: 'Migration',
					items: [
						{ slug: 'migration/from-2-5' },
					],
				},

				// ── Contributing ─────────────────────────────────────────────
				{
					label: 'Contributing',
					collapsed: true,
					items: [
						{ slug: 'contributing' },
						{
							label: 'Code Style',
							items: [
								{ slug: 'contributing/code-style/php' },
								{ slug: 'contributing/code-style/javascript' },
								{ slug: 'contributing/code-style/css' },
								{ slug: 'contributing/code-style/smarty' },
							],
						},
						{
							label: 'Guidelines',
							items: [
								{ slug: 'contributing/guidelines/code-of-conduct' },
								{ slug: 'contributing/guidelines/issue-reporting' },
								{ slug: 'contributing/guidelines/workflow' },
								{ slug: 'contributing/guidelines/pull-requests' },
							],
						},
						{
							label: 'Architecture Decisions',
							collapsed: true,
							items: [
								{ slug: 'contributing/adrs' },
								{ slug: 'contributing/adrs/adr-001' },
								{ slug: 'contributing/adrs/adr-002' },
								{ slug: 'contributing/adrs/adr-003' },
								{ slug: 'contributing/adrs/adr-004' },
								{ slug: 'contributing/adrs/adr-005' },
								{ slug: 'contributing/adrs/adr-006' },
								{ slug: 'contributing/adrs/adr-007' },
							],
						},
						{ slug: 'contributing/translating-xoops' },
						{ slug: 'contributing/notes-for-developers' },
					],
				},

				// ── Reference ────────────────────────────────────────────────
				{
					label: 'Reference',
					collapsed: true,
					items: [
						{ slug: 'reference/glossary' },
						{ slug: 'reference/about-xoops' },
						{ slug: 'reference/whats-new-27' },
						{ slug: 'reference/compatibility-27' },
					],
				},
			],
		}),
	],
});
