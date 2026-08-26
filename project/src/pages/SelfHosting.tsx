import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Terminal, Copy, Check, Shield, Network, Zap, CloudLightning } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface CopyBtnProps {
  text: string;
}

const CopyButton: React.FC<CopyBtnProps> = ({ text }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('Command copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
      showToast('Failed to copy text', 'error');
    }
  };

  return (
    <button className="copy-btn" onClick={handleCopy} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px' }} title="Copy to clipboard">
      {copied ? (
        <Check className="text-emerald" style={{ width: '15px', height: '15px' }} />
      ) : (
        <Copy style={{ width: '15px', height: '15px', color: 'var(--text-muted)' }} />
      )}
    </button>
  );
};

export const SelfHosting: React.FC = () => {
  useEffect(() => {
    document.title = 'Self-Hosting Guide — Konvert';
    return () => { document.title = 'Konvert'; };
  }, []);

  const dockerComposeCmd = `docker-compose up -d --build`;
  const runDockerCmd = `docker run -d -p 8080:8080 --name konvert-backend tushar91316/konvert-backend:latest`;
  const ngrokCmd = `ngrok http 8080 --url=your-domain.ngrok-free.app`;

  return (
    <main className="page-container" style={{ paddingBottom: '4rem' }}>
      <Link to="/" className="back-link" style={{ marginBottom: '2rem' }}>
        <ArrowLeft style={{ width: '16px', height: '16px' }} />
        <span>Back to Home</span>
      </Link>

      {/* Hero Section */}
      <section className="page-hero" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}>
          Self-Hosting <span className="gradient-text">101 Guide</span>
        </h1>
        <p className="section-subtitle" style={{ maxWidth: '750px', margin: '0.75rem auto 0 auto' }}>
          Configure your personal document conversion microservice using Docker, enabling private DOCX and PPTX conversions.
        </p>
      </section>

      {/* Architecture Alert */}
      <div className="solid-card" style={{ borderLeft: '4px solid var(--emerald-500)', marginBottom: '2.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Shield className="text-emerald" style={{ flexShrink: 0, width: '24px', height: '24px' }} />
          <div>
            <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 700 }}>Privacy-First Architecture</h3>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Unlike traditional SaaS apps, Konvert does not run a central cloud compiler. To translate complex documents, the mobile client connects directly to your private local Docker instance over an encrypted tunnel. Your files never touch our infrastructure.
            </p>
          </div>
        </div>
      </div>

      {/* Prerequisites */}
      <section className="step-section" style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>Prerequisites</h2>
        <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', display: 'grid', gap: '0.4rem', fontSize: '0.925rem' }}>
          <li><strong>Docker Desktop:</strong> Install and ensure Docker daemon is running on your host machine.</li>
          <li><strong>Active Network Connection:</strong> Required to route encrypted requests from your mobile app to your local server.</li>
        </ul>
      </section>

      {/* Step 1 */}
      <section className="step-section" style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>1. Claim Your Free Static Domain (Ngrok)</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '0.75rem' }}>
          To allow your mobile device to reach your home machine securely over cellular data or Wi-Fi, create a secure tunnel:
        </p>
        <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', display: 'grid', gap: '0.4rem', fontSize: '0.925rem' }}>
          <li>Sign up at <a href="https://dashboard.ngrok.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--text-main)', textDecoration: 'underline' }}>ngrok.com</a> (completely free).</li>
          <li>Retrieve your <strong>Auth Token</strong> from the dashboard.</li>
          <li>Claim a <strong>Free Static Domain</strong> (e.g., <code style={{ fontFamily: 'monospace' }}>your-domain.ngrok-free.app</code>) under the Domains section.</li>
        </ol>
      </section>

      {/* Step 2 */}
      <section className="step-section" style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>2. Start the Backend Server</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '1.25rem' }}>
          Choose one of the two deployment methods below to spin up your backend:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Method A */}
          <div className="solid-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Zap style={{ color: '#10b981', width: '20px', height: '20px' }} />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Method A: Docker Compose (Recommended)</h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Automatically configures both the backend API and the Ngrok tunnel inside Docker. No local Ngrok CLI installation required:
            </p>
            <ol style={{ paddingLeft: '1.15rem', fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1rem 0', display: 'grid', gap: '0.35rem' }}>
              <li>Download <strong>backend.zip</strong> from Releases.</li>
              <li>Rename <code style={{ fontFamily: 'monospace' }}>.env.example</code> to <code style={{ fontFamily: 'monospace' }}>.env</code> and add your Ngrok credentials.</li>
              <li>Run the stack in terminal:</li>
            </ol>
            <div className="terminal-box">
              <div className="terminal-header">
                <span className="terminal-dot red" />
                <span className="terminal-dot yellow" />
                <span className="terminal-dot green" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <code style={{ fontSize: '0.825rem' }}>{dockerComposeCmd}</code>
                <CopyButton text={dockerComposeCmd} />
              </div>
            </div>
          </div>

          {/* Method B */}
          <div className="solid-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <CloudLightning style={{ color: '#3b82f6', width: '20px', height: '20px' }} />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Method B: Standalone Docker (Manual)</h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Build and run the backend container manually, then expose it using local tunnel CLIs on your host machine:
            </p>
            <div className="terminal-box" style={{ marginBottom: '0.75rem' }}>
              <div className="terminal-header">
                <span className="terminal-dot red" />
                <span className="terminal-dot yellow" />
                <span className="terminal-dot green" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <code style={{ fontSize: '0.8rem' }}>{runDockerCmd}</code>
                <CopyButton text={runDockerCmd} />
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>Expose port 8080 manually:</p>
            <div className="terminal-box">
              <div className="terminal-header">
                <span className="terminal-dot red" />
                <span className="terminal-dot yellow" />
                <span className="terminal-dot green" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <code style={{ fontSize: '0.825rem' }}>{ngrokCmd}</code>
                <CopyButton text={ngrokCmd} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3 */}
      <section className="step-section" style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>3. Paste Tunnel URL in Konvert App</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '0.75rem' }}>
          Connect your client application to your newly created secure backend tunnel:
        </p>
        <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', display: 'grid', gap: '0.4rem', fontSize: '0.925rem', marginBottom: '1.25rem' }}>
          <li>Open the Konvert mobile application on your device.</li>
          <li>Navigate to <strong>Settings</strong> or tap the <strong>System Status</strong> card on the Dashboard.</li>
          <li>Paste your forwarding tunnel URL (e.g. <code style={{ fontFamily: 'monospace' }}>https://xxxx.ngrok-free.app</code>) into the "Backend URL" field and tap Save.</li>
        </ol>
        <div className="solid-card" style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderLeft: '4px solid var(--emerald-500)' }}>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            <strong>How to verify connection:</strong> Simply paste your URL into the Settings screen in the Konvert mobile app and try converting a document! Once conversion completes, your self-hosted backend is fully operational.
          </p>
        </div>
      </section>

      {/* Step 4: VirusTotal Security Configuration */}
      <section className="step-section" style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <Shield style={{ color: 'var(--emerald-500)', width: '22px', height: '22px' }} />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>4. Configure VirusTotal Threat Scanning (Optional)</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
          Protect your self-hosted Docker host from weaponized office macros and malicious payloads before conversion occurs:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* How it works */}
          <div className="solid-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Zap className="text-emerald" style={{ width: '17px', height: '17px' }} />
              <span>How Pre-Flight Scanning Works</span>
            </h3>
            <ul style={{ paddingLeft: '1.15rem', color: 'var(--text-muted)', fontSize: '0.86rem', display: 'grid', gap: '0.5rem', margin: 0, lineHeight: 1.5 }}>
              <li><strong>SHA-256 Fingerprinting:</strong> Calculates cryptographic hash on-device before uploading.</li>
              <li><strong>70+ Antivirus Engines:</strong> Queries VirusTotal's database (Kaspersky, Bitdefender, Microsoft Defender, etc.).</li>
              <li><strong>Automated Guard:</strong> If flagged as infected or suspicious, conversion aborts immediately to protect your server.</li>
            </ul>
          </div>

          {/* Setup Guide */}
          <div className="solid-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Shield className="text-emerald" style={{ width: '17px', height: '17px' }} />
              <span>How to Setup in 3 Simple Steps</span>
            </h3>
            <ol style={{ paddingLeft: '1.15rem', color: 'var(--text-muted)', fontSize: '0.86rem', display: 'grid', gap: '0.45rem', margin: 0, lineHeight: 1.5 }}>
              <li>
                Sign up for a free account at{' '}
                <a href="https://www.virustotal.com/gui/join-us" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--emerald-500)', textDecoration: 'underline' }}>
                  virustotal.com
                </a>.
              </li>
              <li>Open your profile &rarr; <strong>API Key</strong> and copy your personal free key (500 requests/day).</li>
              <li>In the Konvert app, go to <strong>Settings</strong> &rarr; <strong>VirusTotal API Key</strong>, paste the key, and tap <strong>Save</strong>.</li>
            </ol>
          </div>
        </div>

        <div className="solid-card" style={{ padding: '1.25rem', background: 'var(--card-bg)' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--text-main)' }}>Privacy Note:</strong> Your VirusTotal API key and hashes are encrypted on-device via <code style={{ fontFamily: 'monospace' }}>flutter_secure_storage</code>. No raw personal file contents are transmitted to VirusTotal — only SHA-256 cryptographic signatures.
          </p>
        </div>
      </section>

      {/* Troubleshooting card */}
      <section className="step-section">
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>Troubleshooting &amp; Logs</h2>
        <div className="solid-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 700 }}>
                <Network className="text-emerald" style={{ width: '18px', height: '18px' }} />
                <span>Checking Server Health</span>
              </h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Open <code style={{ fontFamily: 'monospace' }}>https://your-domain.ngrok-free.app/health</code> in a browser. It should return <code style={{ fontFamily: 'monospace' }}>{"{"}"status": "ok"{"}"}</code>. If it does not, check if your local container is running.
              </p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 700 }}>
                <Terminal className="text-emerald" style={{ width: '18px', height: '18px' }} />
                <span>Reading Docker Logs</span>
              </h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                If you encounter conversion failures, check your container logs:
                <br />
                &bull; Compose: <code style={{ fontFamily: 'monospace' }}>docker-compose logs -f</code>
                <br />
                &bull; Standalone: <code style={{ fontFamily: 'monospace' }}>docker logs -f konvert-backend</code>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
