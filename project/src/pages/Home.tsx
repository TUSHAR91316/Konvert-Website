import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Download, Server, Map, Users, HelpCircle, Shield, Lock, Zap, 
  CheckCircle, X, Sparkles, Monitor, Play 
} from 'lucide-react';

const GithubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export const Home: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="home-container">
      {/* Hidden SEO Keywords */}
      <div className="sr-only" style={{ display: 'none' }}>
        Konvert is the ultimate offline file converter and image compressor for Android and Windows. Convert files securely
        locally, PDF to DOCX, JPG to PNG, DOCX to PDF, image compression down to specific target KB/MB size, and utilizes
        VirusTotal API scanning. Secure, privacy-first, on-device processing, bring your own backend (BYOB), batch mode, and
        local Docker server capabilities.
      </div>

      {/* Hero Section */}
      <section className="hero relative overflow-hidden">
        <div className="container relative" style={{ zIndex: 10 }}>
          <div className="hero-content text-center reveal visible">
            <div className="logo-wrapper" style={{ marginBottom: '1.5rem' }}>
              <img src="/readme_icon.webp" alt="Konvert Logo" className="logo-icon-img" width="120" height="120" style={{ borderRadius: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }} />
            </div>

            <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', fontWeight: 800 }}>
              Konvert
            </h1>
            <p className="hero-subtitle" style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginTop: '0.5rem', fontWeight: 600 }}>
              Advanced File Management &amp; Conversion Tool
            </p>
            <p className="hero-desc" style={{ maxWidth: '650px', margin: '1rem auto 2.5rem auto', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
              Process files 100% locally or via your self-hosted Docker backend. <span className="highlight-emerald" style={{ color: 'var(--emerald-400)', fontWeight: 600 }}>Privacy-first</span>, <span className="highlight-cyan" style={{ color: 'var(--cyan-400)', fontWeight: 600 }}>security-focused</span>, and lightning fast.
            </p>

            {/* Try Interactive Studio CTA Banner */}
            <div className="card" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '1rem', padding: '1rem 1.5rem', maxWidth: '600px', margin: '0 auto 2.5rem auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles className="text-emerald" style={{ width: '18px', height: '18px' }} />
                  Try Offline Web Studio
                </h4>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Compress images or compile PDFs 100% locally in your browser!</p>
              </div>
              <Link to="/studio" className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                Open Studio →
              </Link>
            </div>

            <div className="hero-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://github.com/TUSHAR91316/Konvert-Website/releases" className="btn btn-primary" id="download-android-hero" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Download style={{ width: '18px', height: '18px' }} />
                <span>Download for Android</span>
              </a>
              <button className="btn btn-secondary" onClick={openModal} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Monitor style={{ width: '18px', height: '18px' }} />
                <span>Download for Windows</span>
              </button>
              <Link to="/self-hosting" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Server style={{ width: '18px', height: '18px' }} />
                <span>Setup Local Server</span>
              </Link>
              <Link to="/roadmap" className="btn btn-outline" id="roadmap-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Map style={{ width: '18px', height: '18px' }} />
                <span>Roadmap</span>
              </Link>
              <Link to="/community" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users style={{ width: '18px', height: '18px' }} />
                <span>Community</span>
              </Link>
              <Link to="/faq" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <HelpCircle style={{ width: '18px', height: '18px' }} />
                <span>FAQ</span>
              </Link>
            </div>

            <div className="hero-badges" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '3rem' }}>
              <div className="badge" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Shield className="text-emerald" style={{ width: '16px', height: '16px' }} />
                <span>VirusTotal Protected</span>
              </div>
              <div className="badge" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Lock className="text-cyan" style={{ width: '16px', height: '16px' }} />
                <span>Local Processing</span>
              </div>
              <div className="badge" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap className="text-emerald" style={{ width: '16px', height: '16px' }} />
                <span>Lightning Fast</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features section-padding" style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header text-center reveal visible" style={{ marginBottom: '3.5rem' }}>
            <h2 className="section-title" style={{ fontSize: '2.2rem', fontWeight: 700 }}>Why Choose Konvert?</h2>
            <p className="section-subtitle" style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Experience the next generation of file management tools.</p>
          </div>

          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {/* Feature 1 */}
            <div className="feature-card reveal visible" style={{ padding: '2rem', background: 'var(--card-bg)', border: 'var(--glass-border)', borderRadius: '1.5rem' }}>
              <div className="feature-icon-wrapper bg-gradient-emerald" style={{ display: 'inline-flex', width: '48px', height: '48px', borderRadius: '1rem', background: 'rgba(16, 185, 129, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: '1.25rem' }}>
                <Sparkles className="text-emerald" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Smart File Conversion</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>Decentralized Engine: Images compress on-device. Documents convert securely via your own local Docker container or Ngrok tunnel.</p>
            </div>
            {/* Feature 2 */}
            <div className="feature-card reveal visible" style={{ padding: '2rem', background: 'var(--card-bg)', border: 'var(--glass-border)', borderRadius: '1.5rem' }}>
              <div className="feature-icon-wrapper bg-gradient-cyan" style={{ display: 'inline-flex', width: '48px', height: '48px', borderRadius: '1rem', background: 'rgba(6, 182, 212, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: '1.25rem' }}>
                <Monitor className="text-cyan" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Compression Studio</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>Reduce image size efficiently with Quality Mode or Target Size Mode (e.g., "Max 500 KB").</p>
            </div>
            {/* Feature 3 */}
            <div className="feature-card reveal visible" style={{ padding: '2rem', background: 'var(--card-bg)', border: 'var(--glass-border)', borderRadius: '1.5rem' }}>
              <div className="feature-icon-wrapper bg-gradient-purple" style={{ display: 'inline-flex', width: '48px', height: '48px', borderRadius: '1rem', background: 'rgba(168, 85, 247, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: '1.25rem' }}>
                <Shield className="text-emerald" style={{ color: 'var(--emerald-500)' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Advanced Security</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>Auto-Scan Integration with VirusTotal ensures files are checked for malware before conversion.</p>
            </div>
            {/* Feature 4 */}
            <div className="feature-card reveal visible" style={{ padding: '2rem', background: 'var(--card-bg)', border: 'var(--glass-border)', borderRadius: '1.5rem' }}>
              <div className="feature-icon-wrapper bg-gradient-orange" style={{ display: 'inline-flex', width: '48px', height: '48px', borderRadius: '1rem', background: 'rgba(249, 115, 22, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: '1.25rem' }}>
                <Server className="text-cyan" style={{ color: 'var(--cyan-500)' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>History &amp; Management</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>Keep track of all your past tasks locally. Offline access to your conversion history.</p>
            </div>
            {/* Feature 5 */}
            <div className="feature-card reveal visible" style={{ padding: '2rem', background: 'var(--card-bg)', border: 'var(--glass-border)', borderRadius: '1.5rem' }}>
              <div className="feature-icon-wrapper" style={{ display: 'inline-flex', width: '48px', height: '48px', borderRadius: '1rem', background: 'rgba(59, 130, 246, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: '1.25rem' }}>
                <Play className="text-emerald" style={{ color: 'var(--emerald-500)' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Batch Processing</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>Convert or compress multiple files simultaneously. Save time with seamless bulk operations.</p>
            </div>
            {/* Feature 6 */}
            <div className="feature-card reveal visible" style={{ padding: '2rem', background: 'var(--card-bg)', border: 'var(--glass-border)', borderRadius: '1.5rem' }}>
              <div className="feature-icon-wrapper" style={{ display: 'inline-flex', width: '48px', height: '48px', borderRadius: '1rem', background: 'rgba(244, 63, 94, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: '1.25rem' }}>
                <Users className="text-cyan" style={{ color: 'var(--cyan-500)' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Guest &amp; Ad-Free Mode</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>Enjoy a clean, distraction-free interface. No intrusive ads, popups, or required account sign-ups.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="tech-stack section-padding" style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header text-center reveal visible" style={{ marginBottom: '3rem' }}>
            <h2 className="section-title" style={{ fontSize: '2rem', fontWeight: 700 }}>Built With</h2>
            <p className="section-subtitle" style={{ color: 'var(--text-muted)' }}>Modern technologies powering the platform.</p>
          </div>
          <div className="tech-grid reveal visible" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div className="tech-item" style={{ padding: '0.75rem 1.5rem', background: 'var(--card-bg)', border: 'var(--glass-border)', borderRadius: '2rem', fontSize: '0.95rem' }}>Flutter (Dart)</div>
            <div className="tech-item" style={{ padding: '0.75rem 1.5rem', background: 'var(--card-bg)', border: 'var(--glass-border)', borderRadius: '2rem', fontSize: '0.95rem' }}>Python (FastAPI)</div>
            <div className="tech-item" style={{ padding: '0.75rem 1.5rem', background: 'var(--card-bg)', border: 'var(--glass-border)', borderRadius: '2rem', fontSize: '0.95rem' }}>LibreOffice</div>
            <div className="tech-item" style={{ padding: '0.75rem 1.5rem', background: 'var(--card-bg)', border: 'var(--glass-border)', borderRadius: '2rem', fontSize: '0.95rem' }}>VirusTotal API</div>
            <div className="tech-item" style={{ padding: '0.75rem 1.5rem', background: 'var(--card-bg)', border: 'var(--glass-border)', borderRadius: '2rem', fontSize: '0.95rem' }}>Docker</div>
            <div className="tech-item" style={{ padding: '0.75rem 1.5rem', background: 'var(--card-bg)', border: 'var(--glass-border)', borderRadius: '2rem', fontSize: '0.95rem' }}>GitHub Actions</div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="comparison section-padding bg-gray-50 dark-bg-gray-800" style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: '3.5rem' }}>
            <h2 className="section-title" style={{ fontSize: '2rem', fontWeight: 700 }}>Konvert vs. Others</h2>
            <p className="section-subtitle" style={{ color: 'var(--text-muted)' }}>See how we stack up against traditional web converters.</p>
          </div>

          <div className="comparison-table-wrapper reveal visible">
            <table className="comparison-table" style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '1rem', overflow: 'hidden' }}>
              <thead>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', background: 'rgba(0,0,0,0.15)' }}>Feature</th>
                  <th className="highlight-col" style={{ padding: '1rem', textAlign: 'left', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--emerald-500)', fontWeight: 700 }}>Konvert App</th>
                  <th style={{ padding: '1rem', textAlign: 'left', background: 'rgba(0,0,0,0.15)' }}>Web Converters</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>Images (Privacy)</td>
                  <td className="highlight-col" style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.04)', fontWeight: 600 }}>100% Offline (On-Device)</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>Upload to Server</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>Documents (Docs/PPT)</td>
                  <td className="highlight-col" style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.04)', fontWeight: 600 }}>Your Own Docker Target (Self-hosted)</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>Unknown Retention</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>Security Scanning</td>
                  <td className="highlight-col" style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.04)', color: 'var(--emerald-500)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle style={{ width: '16px', height: '16px' }} /> VirusTotal</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>None</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>Speed</td>
                  <td className="highlight-col" style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.04)', fontWeight: 600 }}>Instant (Local)</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>Slow (Upload Dependent)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>History</td>
                  <td className="highlight-col" style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.04)', fontWeight: 600 }}>Local Log (Private)</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>Lost after closing</td>
                </tr>
                <tr>
                  <td style={{ padding: '1rem' }}>Ads</td>
                  <td className="highlight-col" style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.04)', fontWeight: 600 }}>Ad-Free</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>Cluttered / Popups</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta relative overflow-hidden" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="container relative text-center text-white reveal visible" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', zIndex: 10 }}>
          <h2 className="cta-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'white', margin: 0, fontWeight: 800 }}>Ready to Convert Smarter?</h2>
          <p className="cta-subtitle" style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '600px', margin: 0 }}>Join thousands of users who trust Konvert for secure, private conversions.</p>

          <div className="cta-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://github.com/TUSHAR91316/Konvert-Website/releases" className="btn btn-white" id="download-android-cta" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--emerald-600)' }}>
              <Download style={{ width: '18px', height: '18px' }} />
              <span>Download for Android</span>
            </a>
            <button className="btn btn-dark-outline" onClick={openModal} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: '2px solid rgba(255,255,255,0.4)', background: 'rgba(0,0,0,0.2)', color: 'white' }}>
              <Monitor style={{ width: '18px', height: '18px' }} />
              <span>Download for Windows</span>
            </button>
            <Link to="/self-hosting" className="btn" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: '2px solid rgba(255, 255, 255, 0.2)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Server style={{ width: '18px', height: '18px' }} />
              <span>Setup Local Server</span>
            </Link>
          </div>

          <div className="cta-badges" style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
            <div className="badge-sm" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>No Credit Card Required</div>
            <div className="badge-sm" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>Free Forever</div>
            <div className="badge-sm" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>Guest Mode</div>
          </div>
        </div>
      </section>

      {/* Modal for Windows Download */}
      {modalOpen && (
        <div id="downloadModal" className="modal active" style={{ display: 'flex', position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', justifyContent: 'center', alignItems: 'center' }}>
          <div className="modal-content" style={{ background: 'var(--card-bg)', border: 'var(--glass-border)', padding: '2.5rem', borderRadius: '1.5rem', position: 'relative', width: '90%', maxWidth: '480px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <button className="modal-close" onClick={closeModal} style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X style={{ width: '20px', height: '20px' }} />
            </button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Download Konvert for Windows</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>Select your preferred download method:</p>
            <div className="modal-buttons" style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
              <a href="https://github.com/TUSHAR91316/Konvert-Website/releases" className="btn btn-primary" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <GithubIcon style={{ width: '18px', height: '18px' }} />
                <span>GitHub Releases</span>
              </a>
              <a href="https://github.com/TUSHAR91316/Konvert-Website/releases/download/v1.0/Konvert-Setup.exe" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <Download style={{ width: '18px', height: '18px' }} />
                <span>Direct Download</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
