import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Download, Server, Lock, CheckCircle2, X, Sparkles, Monitor, 
  Layers, MessageSquare, ArrowRight, ShieldCheck, Cpu, HardDrive, Sliders 
} from 'lucide-react';
import { GithubIcon } from '../components/GithubIcon';

export const Home: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [latestVersion, setLatestVersion] = useState<string>('V1.7.0');

  useEffect(() => {
    document.title = 'Konvert - Privacy-First File Converter for Android & Windows';

    // Synchronize latest release dynamically with GitHub Releases cache
    const fetchLatestRelease = async () => {
      try {
        const cached = sessionStorage.getItem('konvert_releases_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed[0]?.tag_name) {
            setLatestVersion(parsed[0].tag_name);
            return;
          }
        }
        const res = await fetch('https://api.github.com/repos/TUSHAR91316/Konvert/releases?per_page=1');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data[0]?.tag_name) {
            setLatestVersion(data[0].tag_name);
          }
        }
      } catch {
        // Fallback default is V1.7.0
      }
    };

    fetchLatestRelease();
    return () => { document.title = 'Konvert'; };
  }, []);

  useEffect(() => {
    if (!modalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalOpen]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="home-container">
      {/* Hidden SEO Keywords — accessible to screen readers and search crawlers */}
      <div className="sr-only">
        Konvert is an offline file converter and image compressor for Android and Windows. Convert files securely
        locally, PDF to DOCX, JPG to PNG, DOCX to PDF, image compression down to specific target size, VirusTotal scanning.
        Privacy-first, on-device processing, self-hosted Docker backend, batch conversion, and ad-free offline capabilities.
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Link to="/roadmap" className="badge" style={{ textDecoration: 'none' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--emerald-500)' }} />
                <span>{latestVersion} Released &bull; Fully Local Processing</span>
              </Link>
            </div>

            <h1 className="hero-title">
              Privacy-First <span className="gradient-text">File Conversion</span> &amp; Compression
            </h1>

            <p className="hero-subtitle">
              Convert, compress, and compile files directly on your device — with zero cloud telemetry.
            </p>

            <p className="hero-desc" style={{ maxWidth: '620px', margin: '1rem auto 2.25rem auto' }}>
              Process images 100% locally in browser memory or connect your private self-hosted Docker container for heavy document parsing. No accounts, no data retention, and no ads.
            </p>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <a
                href={`https://github.com/TUSHAR91316/Konvert/releases/download/${latestVersion}/app-release.apk`}
                className="btn btn-primary"
                id="download-android-hero"
              >
                <Download style={{ width: '16px', height: '16px' }} />
                <span>Download for Android ({latestVersion})</span>
              </a>

              <button className="btn btn-secondary-solid" onClick={openModal}>
                <Monitor style={{ width: '16px', height: '16px' }} />
                <span>Download for Windows</span>
              </button>

              <Link to="/studio" className="btn btn-outline">
                <Sparkles style={{ width: '16px', height: '16px', color: 'var(--emerald-500)' }} />
                <span>Try Web Studio</span>
              </Link>
            </div>

            {/* Platform Badges */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div className="badge">
                <ShieldCheck style={{ width: '15px', height: '15px', color: 'var(--emerald-500)' }} />
                <span>VirusTotal Verified</span>
              </div>
              <div className="badge">
                <Cpu style={{ width: '15px', height: '15px', color: 'var(--emerald-500)' }} />
                <span>On-Device Engine</span>
              </div>
              <div className="badge">
                <HardDrive style={{ width: '15px', height: '15px', color: 'var(--emerald-500)' }} />
                <span>Zero Server Retention</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Strip */}
      <section style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--card-bg)', padding: '2.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', borderLeft: '3px solid var(--emerald-500)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>100% Local</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Image conversions execute inside memory on your hardware.</div>
            </div>
            <div style={{ padding: '1rem', borderLeft: '3px solid var(--cyan-500)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Zero Telemetry</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>No user trackers, analytical pings, or data mining.</div>
            </div>
            <div style={{ padding: '1rem', borderLeft: '3px solid #8b5cf6' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Self-Hosted Backend</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Deploy our Docker container for private DOCX/PPTX parsing.</div>
            </div>
            <div style={{ padding: '1rem', borderLeft: '3px solid #f59e0b' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>100% Free &amp; Clean</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Open source code with no paywalls or intrusive advertisements.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Engine Architecture</h2>
            <p className="section-subtitle">Designed for users and developers who value data privacy and speed.</p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Cpu className="text-emerald" style={{ width: '20px', height: '20px' }} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Hybrid Conversion Engine</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Lightweight tasks (PNG, JPG, WebP compression and PDF compilation) execute on-device. Complex documents route through your personal Docker container via Ngrok or local network.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Sliders className="text-emerald" style={{ width: '20px', height: '20px' }} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Precision Compression</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Fine-tune image outputs using quality thresholds or exact target file-size limits (e.g. max 300 KB) with immediate on-screen byte savings breakdown.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <ShieldCheck className="text-emerald" style={{ width: '20px', height: '20px' }} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>VirusTotal Threat Inspection</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Optional malware scanner checks file hashes against VirusTotal multi-engine definitions before any local extraction or document rendering.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Layers className="text-emerald" style={{ width: '20px', height: '20px' }} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Batch Processing</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Queue multiple documents or image albums simultaneously. Bulk processing saves time without causing high CPU spikes.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Server className="text-emerald" style={{ width: '20px', height: '20px' }} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Docker Self-Hosting 101</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                A 2-line Docker CLI or Compose setup exposes an isolated headless LibreOffice microservice with wildcard CORS and token authentication.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Lock className="text-emerald" style={{ width: '20px', height: '20px' }} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Ephemeral Session Safety</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Temporary conversion buffers are flushed immediately after file creation. Your document contents never touch external databases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="section-padding" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Konvert vs. Cloud SaaS Converters</h2>
            <p className="section-subtitle">How on-device architecture compares against traditional web converters.</p>
          </div>

          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Architecture Feature</th>
                  <th className="highlight-col">Konvert</th>
                  <th>Cloud SaaS Services</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Image Processing</strong></td>
                  <td className="highlight-col"><span className="text-emerald font-semibold">100% On-Device</span> (Zero uploads)</td>
                  <td style={{ color: 'var(--text-muted)' }}>Uploaded to 3rd-party servers</td>
                </tr>
                <tr>
                  <td><strong>Document Conversions</strong></td>
                  <td className="highlight-col"><span className="text-emerald font-semibold">Private Docker Host</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>Unverified retention policy</td>
                </tr>
                <tr>
                  <td><strong>Threat Inspection</strong></td>
                  <td className="highlight-col"><CheckCircle2 style={{ width: '16px', height: '16px', display: 'inline', color: 'var(--emerald-500)' }} /> VirusTotal API integration</td>
                  <td style={{ color: 'var(--text-muted)' }}>None</td>
                </tr>
                <tr>
                  <td><strong>Conversion Speed</strong></td>
                  <td className="highlight-col">Instant (Hardware Bound)</td>
                  <td style={{ color: 'var(--text-muted)' }}>Slow (Network upload queue bound)</td>
                </tr>
                <tr>
                  <td><strong>Advertising &amp; Trackers</strong></td>
                  <td className="highlight-col">Zero Ads / Zero Trackers</td>
                  <td style={{ color: 'var(--text-muted)' }}>Heavy popups and advertising cookies</td>
                </tr>
                <tr>
                  <td><strong>Pricing</strong></td>
                  <td className="highlight-col">100% Free / Open Source</td>
                  <td style={{ color: 'var(--text-muted)' }}>Monthly recurring paywalls</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Feedback & Community Invitation Banner */}
      <section className="section-padding">
        <div className="container">
          <div className="solid-card" style={{ padding: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', background: 'var(--card-bg)' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare style={{ width: '22px', height: '22px', color: 'var(--emerald-500)' }} />
                <span>Help Shape the Next Release</span>
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', maxWidth: '560px', margin: 0, lineHeight: 1.5 }}>
                Found a bug or have a feature idea for Konvert? Share your suggestions directly with the development team.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/feedback" className="btn btn-primary">
                <span>Open Feedback Hub</span>
                <ArrowRight style={{ width: '15px', height: '15px' }} />
              </Link>
              <Link to="/community" className="btn btn-secondary-solid">
                <span>View Discussions</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Windows Download Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal} role="dialog" aria-modal="true">
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                Download for Windows
              </h2>
              <button onClick={closeModal} className="modal-close-btn" aria-label="Close modal">
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Choose your preferred installation source for Windows 10/11:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a
                href="https://github.com/TUSHAR91316/Konvert/releases"
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon style={{ width: '16px', height: '16px' }} />
                <span>GitHub Releases (Latest)</span>
              </a>
              <a
                href="https://github.com/TUSHAR91316/Konvert/releases/latest"
                className="btn btn-secondary-solid"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download style={{ width: '16px', height: '16px' }} />
                <span>Latest Windows Assets</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
