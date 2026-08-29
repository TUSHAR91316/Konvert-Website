import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Download, Server, Lock, CheckCircle2, X, Sparkles, Monitor, 
  Layers, MessageSquare, ArrowRight, ShieldCheck, Cpu, HardDrive, Sliders 
} from 'lucide-react';
import { GithubIcon } from '../components/GithubIcon';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useModal } from '../hooks/useModal';
import { useGitHubReleases } from '../hooks/useGitHubReleases';
import { 
  getApkDownloadUrl, 
  GITHUB_RELEASES_URL, 
  GITHUB_LATEST_RELEASE_URL 
} from '../constants/links';

export const Home: React.FC = () => {
  useDocumentTitle('Konvert - Privacy-First File Converter for Android & Windows');

  const [modalOpen, setModalOpen] = useState(false);
  const { latestTag } = useGitHubReleases('V1.7.0');

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useModal({ isOpen: modalOpen, onClose: closeModal });

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
                <span>{latestTag} Released &bull; Fully Local Processing</span>
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
                href={getApkDownloadUrl(latestTag)}
                className="btn btn-primary"
                id="download-android-hero"
              >
                <Download style={{ width: '16px', height: '16px' }} />
                <span>Download for Android ({latestTag})</span>
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

      {/* Key Metrics / Highlights Strip */}
      <section style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)', padding: '1.75rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>100%</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>On-Device Image Processing</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>0 MB</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Remote Cloud Retention</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>0 Ads</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Free &amp; Open Source Software</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>70+</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>VirusTotal Engine Signatures</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Engineered for Sovereign Privacy</h2>
            <p className="section-subtitle">A decentralized approach to file manipulation without paywalls or tracking.</p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Cpu className="text-emerald" style={{ width: '22px', height: '22px' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Local-First Conversions</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Image resizing, format conversion (JPG, PNG, WEBP), and multi-page PDF compilation execute entirely inside device memory.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Server style={{ color: '#06b6d4', width: '22px', height: '22px' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Bring Your Own Backend</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                For heavy office formats (DOCX, PPTX, XLSX), connect your personal Docker container via Ngrok with zero cloud intermediaries.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Sliders style={{ color: '#6366f1', width: '22px', height: '22px' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Granular File Compression</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Fine-tune image compression by quality percentage or exact target file size (KB/MB) with instant local preview output.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Lock className="text-emerald" style={{ width: '22px', height: '22px' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Zero Identity Requirements</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Guest-first architecture. No account registration, email collection, analytical trackers, or behavioral profiling.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <ShieldCheck style={{ color: '#06b6d4', width: '22px', height: '22px' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>VirusTotal Threat Guard</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Pre-flight malware verification queries cryptographic hashes against 70+ security vendors before converting files.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Layers style={{ color: '#6366f1', width: '22px', height: '22px' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Batch Queue Workflow</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Queue multiple documents or photos simultaneously. Convert, inspect file sizes, and compile them into combined PDFs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Matrix */}
      <section className="section-padding" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Konvert vs. Traditional Online Converters</h2>
            <p className="section-subtitle">See why local processing delivers superior privacy and security.</p>
          </div>

          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Capability</th>
                  <th className="highlight-col">Konvert (Local / BYOB)</th>
                  <th>Standard SaaS Converters</th>
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
                href={GITHUB_RELEASES_URL}
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon style={{ width: '16px', height: '16px' }} />
                <span>GitHub Releases (Latest)</span>
              </a>
              <a
                href={GITHUB_LATEST_RELEASE_URL}
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
