import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Download, Package, WifiOff, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { GithubIcon } from '../components/GithubIcon';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useGitHubReleases } from '../hooks/useGitHubReleases';
import { GITHUB_RELEASES_URL } from '../constants/links';

export const Roadmap: React.FC = () => {
  useDocumentTitle('Roadmap & Releases — Konvert');

  const { releases, stats, loading, error, refresh } = useGitHubReleases('V1.7.0');
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

  // Mini markdown → HTML parser
  const parseMarkdown = (md: string) => {
    if (!md) return '';
    const html = md
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
      .replace(/^\* {3}(.+)$/gm, '<li>$1</li>')
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
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
        <div className="container">
          {loading && (
            <div className="loader-wrapper">
              <div className="spinner" style={{ margin: '0 auto 1.5rem auto' }} />
              <p style={{ fontWeight: 600 }}>Fetching latest releases from GitHub...</p>
            </div>
          )}

          {error && (
            <div className="error-box">
              <WifiOff style={{ width: '40px', height: '40px', color: '#ef4444', margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Failed to Load Releases</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="retry-btn" onClick={() => { void refresh(); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RefreshCw style={{ width: '16px', height: '16px' }} /> Retry
                </button>
                <a href={GITHUB_RELEASES_URL} target="_blank" rel="noopener noreferrer" className="retry-btn" style={{ textDecoration: 'none', background: 'transparent', border: '2px solid var(--border-color)', color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GithubIcon style={{ width: '16px', height: '16px' }} /> View on GitHub
                </a>
              </div>
            </div>
          )}

          {!loading && !error && releases.map((release, idx) => {
            const apkAsset = release.assets.find(a => a.name.endsWith('.apk') && !a.name.endsWith('.sha1'));
            const zipAsset = release.assets.find(a => a.name.endsWith('.zip'));
            
            const isLatest = idx === 0 && !release.prerelease;
            const isPrerelease = release.prerelease;
            const isMajorMinor = /v?\d+\.\d+\.0$/i.test(release.tag_name);

            let nodeClass = 'old';
            if (isLatest) nodeClass = 'latest';
            else if (isPrerelease) nodeClass = 'prerel';
            else if (isMajorMinor) nodeClass = 'stable';
            else nodeClass = 'patch';

            let nodeLabel = release.tag_name.replace(/^v/i, '');
            if (nodeLabel.length > 5) nodeLabel = nodeLabel.substring(0, 5);

            const isCollapsed = !expandedItems[idx] && release.body && release.body.length > 500;

            return (
              <div key={release.tag_name || idx} className="timeline" style={{ position: 'relative' }}>
                <div className="release-item">
                  <div className={`release-node ${nodeClass}`}>
                    {nodeLabel}
                  </div>

                  <div className="release-card">
                    <div className="release-header">
                      <div>
                        <div className="release-tag-group">
                          {isLatest && <span className="release-tag tag-latest">Latest</span>}
                          {isPrerelease && <span className="release-tag tag-prerel">Pre-release</span>}
                          {!isLatest && !isPrerelease && isMajorMinor && <span className="release-tag tag-stable">Stable</span>}
                          {!isLatest && !isPrerelease && !isMajorMinor && <span className="release-tag tag-patch">Patch</span>}
                        </div>
                        <h2 className="release-name">{release.name || release.tag_name}</h2>
                      </div>
                      <div className="release-meta">
                        <Calendar style={{ width: '14px', height: '14px' }} />
                        <span>{formatDate(release.published_at)}</span>
                      </div>
                    </div>

                    <div className="release-divider" />

                    {release.body && (
                      <div className={`body-wrapper ${isCollapsed ? 'collapsed' : ''}`}>
                        <div 
                          className="release-body"
                          dangerouslySetInnerHTML={{ __html: parseMarkdown(release.body) }}
                        />
                        {release.body.length > 500 && (
                          <button 
                            className="toggle-body-btn"
                            onClick={() => toggleExpand(idx)}
                          >
                            {expandedItems[idx] ? (
                              <><ChevronUp style={{ width: '15px', height: '15px' }} /> Show Less</>
                            ) : (
                              <><ChevronDown style={{ width: '15px', height: '15px' }} /> Read Full Release Notes</>
                            )}
                          </button>
                        )}
                      </div>
                    )}

                    <div className="release-footer">
                      {apkAsset && (
                        <a 
                          href={apkAsset.browser_download_url} 
                          className="release-dl-btn"
                          title="Download Android APK package"
                        >
                          <Download style={{ width: '15px', height: '15px' }} />
                          <span>Download APK ({formatBytes(apkAsset.size)})</span>
                        </a>
                      )}

                      {zipAsset && (
                        <a 
                          href={zipAsset.browser_download_url} 
                          className="release-dl-btn secondary"
                          title="Download source or backend bundle"
                        >
                          <Package style={{ width: '15px', height: '15px' }} />
                          <span>Download ZIP ({formatBytes(zipAsset.size)})</span>
                        </a>
                      )}

                      <a 
                        href={release.html_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="release-dl-btn secondary"
                      >
                        <GithubIcon style={{ width: '15px', height: '15px' }} />
                        <span>GitHub Release</span>
                      </a>
                    </div>
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
