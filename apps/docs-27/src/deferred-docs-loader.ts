import { existsSync, promises as fs } from 'node:fs';
import { relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Loader, LoaderContext } from 'astro/loaders';

const docsExtensions = ['markdown', 'mdown', 'mkdn', 'mkd', 'mdwn', 'md', 'mdx'];

type EntryType = NonNullable<LoaderContext['entryTypes']> extends Map<string, infer T> ? T : never;

export function deferredDocsLoader(): Loader {
	return {
		name: 'starlight-docs-loader',
		load: async (context) => {
			const base = new URL('./src/content/docs/', context.config.root);
			const files = await listDocs(base);
			const untouchedEntries = new Set(context.store.keys());
			const fileToId = new Map<string, string>();

			for (const entry of files) {
				await syncEntry(context, base, entry, fileToId, untouchedEntries);
			}

			for (const entry of untouchedEntries) {
				context.store.delete(entry);
			}
		},
	};
}

async function listDocs(base: URL) {
	const files: string[] = [];

	async function walk(dir: URL, prefix = '') {
		const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);

		for (const entry of entries) {
			if (entry.name.startsWith('_')) continue;

			const child = new URL(encodeURIComponent(entry.name) + (entry.isDirectory() ? '/' : ''), dir);
			const childPath = prefix ? `${prefix}/${entry.name}` : entry.name;

			if (entry.isDirectory()) {
				await walk(child, childPath);
			} else if (docsExtensions.includes(entry.name.split('.').at(-1) ?? '')) {
				files.push(childPath.replace(/\\/g, '/'));
			}
		}
	}

	await walk(base);
	return files.sort();
}

async function syncEntry(
	context: LoaderContext,
	base: URL,
	entry: string,
	fileToId: Map<string, string>,
	untouchedEntries: Set<string>
) {
	const fileUrl = new URL(entry.split('/').map(encodeURIComponent).join('/'), base);
	const filePath = fileURLToPath(fileUrl);
	const entryType = getEntryType(context.entryTypes, entry);

	if (!entryType) {
		context.logger.warn(`No entry type found for ${entry}`);
		return;
	}

	const contents = await fs.readFile(fileUrl, 'utf-8').catch((error) => {
		context.logger.error(`Error reading ${entry}: ${error.message}`);
		return;
	});
	if (contents === undefined) return;

	const { body, data } = await entryType.getEntryInfo({ contents, fileUrl });
	const id = generateId(entry, data);
	const oldId = fileToId.get(filePath);
	if (oldId && oldId !== id) {
		context.store.delete(oldId);
	}
	untouchedEntries.delete(id);

	const digest = context.generateDigest(contents);
	const existingEntry = context.store.get(id);
	const relativePath = normalizePath(relative(fileURLToPath(context.config.root), filePath));

	if (existingEntry && existingEntry.digest === digest && existingEntry.filePath) {
		if (existingEntry.deferredRender) {
			context.store.addModuleImport(existingEntry.filePath);
		}
		if (existingEntry.assetImports?.length) {
			context.store.addAssetImports(existingEntry.assetImports, existingEntry.filePath);
		}
		fileToId.set(filePath, id);
		return;
	}

	const parsedData = await context.parseData({ id, data, filePath });
	if (existingEntry && existingEntry.filePath && existingEntry.filePath !== relativePath) {
		const oldFilePath = new URL(existingEntry.filePath, context.config.root);
		if (existsSync(oldFilePath)) {
			context.logger.warn(
				`Duplicate id "${id}" found in ${filePath}. Later items with the same id will overwrite earlier ones.`
			);
		}
	}

	context.store.set({
		id,
		data: parsedData,
		body: undefined,
		filePath: relativePath,
		digest,
		deferredRender: hasContentModule(entryType) || hasRenderFunction(entryType),
	});
	fileToId.set(filePath, id);
}

function getEntryType(entryTypes: LoaderContext['entryTypes'], entry: string): EntryType | undefined {
	const ext = entry.split('.').at(-1);
	return ext ? entryTypes.get(`.${ext}`) : undefined;
}

function generateId(entry: string, data: { slug?: unknown }) {
	if (typeof data.slug === 'string') return data.slug;

	const withoutExtension = entry.replace(/\.[^.]+$/, '');
	return withoutExtension.replace(/(^|\/)index$/, '');
}

function normalizePath(path: string) {
	return path.replace(/\\/g, '/');
}

function hasContentModule(entryType: EntryType) {
	return 'contentModuleTypes' in entryType;
}

function hasRenderFunction(entryType: EntryType) {
	return 'getRenderFunction' in entryType;
}
