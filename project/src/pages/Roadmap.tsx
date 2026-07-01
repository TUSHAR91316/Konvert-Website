import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Download, Package, WifiOff, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

const GithubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

interface GitHubAsset {
  name: string;
  size: number;
  download_count: number;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  prerelease: boolean;
  body: string;
  html_url: string;
  assets: GitHubAsset[];
}

export const Roadmap: React.FC = () => {
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ versions: 0, latest: '—', downloads: '—' });
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    loadReleases();
  }, []);

  // Mini markdown → HTML parser (replicated from previous HTML custom parser)
  const parseMarkdown = (md: string) => {
    if (!md) return '';
    let html = md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/```[\w]*\n?([\s\S]*?)```/gm, (_, code) => `<pre><code>${code.trim()}</code></pre>`)
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/^---$/gm, '<hr>')
      .replace(/^\*   (.+)$/gm, '<li>$1</li>')
      .replace(/^\*\s+(.+)$/gm, '<li>$1</li>')
      .replace(/^-\s+(.+)$/gm, '<li>$1</li>')
      .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`);

    const blocks = html.split(/\n{2,}/);
    return blocks.map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (/^<(h[1-6]|ul|ol|pre|hr)/.test(trimmed)) return trimmed;
      return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const loadReleases = async () => {
    setLoading(true);
    setError(null);
    try {
      const cacheKey = 'konvert_releases_cache';
      const cacheTimeKey = 'konvert_releases_time';
      const cacheDuration = 15 * 60 * 1000; // 15 mins

      let data: GitHubRelease[];
      const cachedData = sessionStorage.getItem(cacheKey);
      const cachedTime = sessionStorage.getItem(cacheTimeKey);

      if (cachedData && cachedTime && (Date.now() - parseInt(cachedTime)) < cacheDuration) {
        data = JSON.parse(cachedData);
      } else {
        const res = await fetch(
          'https://api.github.com/repos/TUSHAR91316/Konvert-Website/releases?per_page=30',
          { headers: { 'Accept': 'application/vnd.github+json' } }
        );
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        data = await res.json();
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
        sessionStorage.setItem(cacheTimeKey, Date.now().toString());
      }

      setReleases(data);

      const totalDownloads = data.reduce((sum, r) =>
        sum + r.assets.reduce((s, a) => s + a.download_count, 0), 0);

      setStats({
        versions: data.length,
        latest: data[0]?.tag_name ?? '—',
        downloads: totalDownloads >= 1000 ? (totalDownloads / 1000).toFixed(1) + 'k' : String(totalDownloads)
      });
    } catch (err: any) {
      setError(err.message || 'Could not reach GitHub API.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (idx: number) => {
    setExpandedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <main style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section className="roadmap-hero relative overflow-hidden">
        <div className="container relative">
          <Link to="/" className="back-link" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Back to Home
          </Link>
          <div className="live-badge">
            <span className="live-dot"></span>
            Live from GitHub Releases
          </div>
          <h1 className="roadmap-hero-title">Konvert Roadmap &amp; Releases</h1>
          <p className="roadmap-hero-sub">Every version, every changelog — pulled automatically from GitHub. See what's shipped and what's next.</p>

          {!loading && !error && (
            <div className="stats-bar" style={{ display: 'flex' }}>
              <div className="stat-item">
                <div className="stat-value">{stats.versions}</div>
                <div className="stat-label">Versions</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.latest}</div>
                <div className="stat-label">Latest</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.downloads}</div>
                <div className="stat-label">Downloads</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="timeline container">
          {loading && (
            <div className="loader-wrapper" style={{ margin: '4rem auto' }}>
              <div className="spinner"></div>
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Fetching latest releases from GitHub…</p>
            </div>
          )}

          {error && (
            <div className="error-box" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <WifiOff style={{ width: '48px', height: '48px', color: '#f87171', marginBottom: '1rem' }} />
              <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Failed to load releases</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="retry-btn" onClick={loadReleases} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RefreshCw style={{ width: '16px', height: '16px' }} /> Retry
                </button>
                <a href="https://github.com/TUSHAR91316/Konvert-Website/releases" target="_blank" rel="noopener noreferrer" className="retry-btn" style={{ textDecoration: 'none', background: 'transparent', border: '2px solid var(--border-color)', color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GithubIcon style={{ width: '16px', height: '16px' }} /> View on GitHub
                </a>
              </div>
            </div>
          )}

          {!loading && !error && releases.map((release, idx) => {
            const apkAsset = release.assets.find(a => a.name.endsWith('.apk') && !a.name.endsWith('.sha1'));
            const zipAsset = release.assets.find(a => a.name.endsWith('.zip'));
            
            // Determine release tag styles
            const isPrerelease = release.prerelease;
            const nodeTypeClass = isPrerelease ? 'patch' : idx === 0 ? 'latest' : idx === 1 ? 'stable' : 'old';

            // Long body collapse logic
            const isLong = (release.body || '').length > 400;
            const isExpanded = !!expandedItems[idx];
            const displayBodyHtml = isLong && !isExpanded 
              ? parseMarkdown(release.body.slice(0, 400) + '...')
              : parseMarkdown(release.body);

            return (
              <div key={idx} className="release-item reveal visible" style={{ transitionDelay: `${Math.min(idx * 0.05, 0.4)}s` }}>
                <div className={`release-node ${nodeTypeClass}`}>{releases.length - idx}</div>
                <div className="release-card">
                  <div className="release-header">
                    <div>
                      <div className="release-tag-group" style={{ marginBottom: '0.4rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>{release.tag_name}</span>
                        {idx === 0 && !isPrerelease && <span className="release-tag tag-latest">Latest</span>}
                        {isPrerelease && <span className="release-tag tag-prerel">Pre-release</span>}
                        {idx > 0 && !isPrerelease && <span className="release-tag tag-stable">Stable</span>}
                      </div>
                      <h2 className="release-name">{release.name || release.tag_name}</h2>
                    </div>
                    <div className="release-meta" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)' }}>
                      <Calendar style={{ width: '14px', height: '14px' }} />
                      {formatDate(release.published_at)}
                    </div>
                  </div>

                  {release.body && (
                    <>
                      <div className="release-divider"></div>
                      <div className={`body-wrapper ${isLong && !isExpanded ? 'collapsed' : ''}`}>
                        <div className="release-body" dangerouslySetInnerHTML={{ __html: displayBodyHtml }} />
                      </div>
                      {isLong && (
                        <button className="toggle-body-btn" onClick={() => toggleExpand(idx)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                          {isExpanded ? (
                            <>
                              <ChevronUp style={{ width: '14px', height: '14px' }} /> Show less
                            </>
                          ) : (
                            <>
                              <ChevronDown style={{ width: '14px', height: '14px' }} /> Show more
                            </>
                          )}
                        </button>
                      )}
                    </>
                  )}

                  <div className="release-divider"></div>
                  <div className="release-footer" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                    {apkAsset && (
                      <a href={apkAsset.browser_download_url} className="release-dl-btn">
                        <Download style={{ width: '14px', height: '14px' }} />
                        Download APK ({formatBytes(apkAsset.size)})
                      </a>
                    )}
                    {zipAsset && (
                      <a href={zipAsset.browser_download_url} className="release-dl-btn secondary">
                        <Package style={{ width: '14px', height: '14px' }} />
                        Backend ZIP
                      </a>
                    )}
                    <a href={release.html_url} target="_blank" rel="noopener noreferrer" className="release-dl-btn secondary">
                      <GithubIcon style={{ width: '14px', height: '14px' }} />
                      View on GitHub
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};
