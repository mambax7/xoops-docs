// src/lib/github-modules.ts

export interface GitHubRepo {
    name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    updated_at: string;
    topics: string[];
}

export interface ModuleWithRelease extends GitHubRepo {
    latestRelease: {
        tag_name: string;
        published_at: string;
        body: string;
    } | null;
}

const ORG = 'XoopsModuels25x';
const HEADERS: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    // Use a token to avoid rate limiting (60 req/hr anonymous, 5000 with token)
    ...(import.meta.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${import.meta.env.GITHUB_TOKEN}` }
        : {}),
};

/**
 * Fetch all repos from the XoopsModuels25x organization.
 * Called at BUILD TIME by Astro — never in the browser.
 */
export async function fetchModules(): Promise<GitHubRepo[]> {
    const repos: GitHubRepo[] = [];
    let page = 1;

    while (true) {
        const res = await fetch(
            `https://api.github.com/orgs/${ORG}/repos?per_page=100&page=${page}&sort=updated`,
            { headers: HEADERS }
        );

        if (!res.ok) {
            console.warn(`GitHub API error: ${res.status}. Returning cached data.`);
            break;
        }

        const batch: GitHubRepo[] = await res.json();
        if (batch.length === 0) break;

        repos.push(...batch);
        page++;
    }

    return repos;
}

/**
 * Fetch the latest GitHub Release for a specific repo.
 */
export async function fetchLatestRelease(repoName: string) {
    const res = await fetch(
        `https://api.github.com/repos/${ORG}/${repoName}/releases/latest`,
        { headers: HEADERS }
    );

    if (!res.ok) return null;
    return res.json();
}

/**
 * Fetch all modules AND their latest releases.
 * For "recently updated" — sorted by release date.
 */
export async function fetchModulesWithReleases(limit = 20): Promise<ModuleWithRelease[]> {
    const repos = await fetchModules();

    // Fetch releases in parallel (batched to avoid rate limits)
    const withReleases = await Promise.all(
        repos.slice(0, limit).map(async (repo) => ({
            ...repo,
            latestRelease: await fetchLatestRelease(repo.name),
        }))
    );

    // Sort by release date, newest first
    return withReleases
        .filter(m => m.latestRelease !== null)
        .sort((a, b) =>
            new Date(b.latestRelease!.published_at).getTime() -
            new Date(a.latestRelease!.published_at).getTime()
        );
}
