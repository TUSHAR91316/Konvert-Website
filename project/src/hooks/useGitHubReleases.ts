import { useState, useEffect, useCallback } from 'react';
import type { GitHubRelease, ReleaseStats } from '../types/release';
import { GITHUB_API_RELEASES } from '../constants/links';

const CACHE_KEY = 'konvert_releases_cache';
const CACHE_TIME_KEY = 'konvert_releases_time';
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

interface UseGitHubReleasesResult {
  releases: GitHubRelease[];
  stats: ReleaseStats;
  loading: boolean;
  error: string | null;
  latestTag: string;
  refresh: () => Promise<void>;
}

/**
 * Custom hook to fetch and cache GitHub releases, calculate downloads, and track latest release tag
 */
export const useGitHubReleases = (fallbackTag = 'V1.7.0'): UseGitHubReleasesResult => {
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ReleaseStats>({ versions: 0, latest: fallbackTag, downloads: '—' });

  const loadReleases = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let data: GitHubRelease[];
      const cachedData = sessionStorage.getItem(CACHE_KEY);
      const cachedTime = sessionStorage.getItem(CACHE_TIME_KEY);

      if (cachedData && cachedTime && Date.now() - parseInt(cachedTime, 10) < CACHE_DURATION_MS) {
        data = JSON.parse(cachedData);
      } else {
        const res = await fetch(`${GITHUB_API_RELEASES}?per_page=30`, {
          headers: { Accept: 'application/vnd.github+json' }
        });
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        data = await res.json();
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
        sessionStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
      }

      setReleases(data);

      const totalDownloads = data.reduce((sum, r) =>
        sum + r.assets.reduce((s, a) => s + a.download_count, 0), 0);

      setStats({
        versions: data.length,
        latest: data[0]?.tag_name || fallbackTag,
        downloads: totalDownloads >= 1000 ? (totalDownloads / 1000).toFixed(1) + 'k' : String(totalDownloads)
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not reach GitHub API.';
      setError(message);
      setStats(prev => ({ ...prev, latest: fallbackTag }));
    } finally {
      setLoading(false);
    }
  }, [fallbackTag]);

  useEffect(() => {
    loadReleases();
  }, [loadReleases]);

  const latestTag = stats.latest || fallbackTag;

  return {
    releases,
    stats,
    loading,
    error,
    latestTag,
    refresh: loadReleases
  };
};
