import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Terminal, Copy, Check, Shield, Network, Zap, CloudLightning } from 'lucide-react';

interface CopyBtnProps {
  text: string;
}

const CopyButton: React.FC<CopyBtnProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <button className="copy-btn" onClick={handleCopy} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px' }} title="Copy to clipboard">
      {copied ? (
        <Check className="text-emerald" style={{ width: '16px', height: '16px' }} />
      ) : (
        <Copy style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
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
  const cloudflareCmd = `cloudflared tunnel --url http://localhost:8080`;

  return (
    <main className="page-container" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section className="page-hero reveal visible" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
          Self-Hosting 101 Guide
        </h1>
        <p className="section-subtitle" style={{ maxWidth: '750px', margin: '1rem auto 0 auto' }}>
          Welcome to the self-hosting manual. Learn how to configure your own personal secure document conversion server using Docker, enabling fully private DOCX/PPTX conversions.
        </p>
      </section>

      {/* Architecture Alert */}
      <div className="card reveal visible" style={{ borderLeft: '4px solid var(--emerald-500)', marginBottom: '3rem', background: 'var(--card-bg)' }}>
        <div style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
          <Shield className="text-emerald" style={{ flexShrink: 0, width: '28px', height: '28px' }} />
          <div>
            <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Privacy-First Architecture</h3>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Unlike traditional SaaS apps, Konvert does not run a central cloud compiler. To translate complex documents, the mobile client connects directly to your private local Docker instance over a secure tunnel. Your documents never touch our infrastructure.
            </p>
          </div>
        </div>
      </div>

      {/* Prerequisites */}
      <section className="step-section reveal visible" style={{ marginBottom: '3rem' }}>
        <h2>Prerequisites</h2>
        <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)', display: 'grid', gap: '0.5rem' }}>
          <li><strong>Docker Desktop</strong>: Install and ensure Docker is running on your host machine.</li>
          <li><strong>Active Internet Connection</strong>: Required to expose and route traffic from your mobile device to your home server.</li>
        </ul>
      </section>

      {/* Step 1 */}
      <section className="step-section reveal visible" style={{ marginBottom: '3rem' }}>
        <h2>1. Claim Your Free Static Domain (Ngrok)</h2>
        <p>To let the mobile app securely reach your home server from anywhere, we create an HTTPS tunnel using Ngrok:</p>
        <ol style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)', display: 'grid', gap: '0.5rem' }}>
          <li>Sign up at <a href="https://dashboard.ngrok.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--text-main)', textDecoration: 'underline' }}>ngrok.com</a> (completely free).</li>
          <li>Retrieve your <strong>Auth Token</strong> from the dashboard.</li>
          <li>Claim a <strong>Free Static Domain</strong> (e.g., <code style={{ fontFamily: 'monospace' }}>your-domain.ngrok-free.app</code>) under the Domains section.</li>
        </ol>
      </section>

      {/* Step 2 */}
      <section className="step-section reveal visible" style={{ marginBottom: '3rem' }}>
        <h2>2. Start the Backend Server</h2>
        <p>Choose <strong>one</strong> of the two methods below to spin up your backend:</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          {/* Method A */}
          <div className="card" style={{ background: 'var(--card-bg)', border: 'var(--glass-border)', padding: '1.5rem', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Zap style={{ color: '#10b981', width: '22px', height: '22px' }} />
              <h3 style={{ margin: 0 }}>Method A: Docker Compose (Recommended)</h3>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Automatically configures both the backend API and the Ngrok tunnel inside Docker. No local Ngrok CLI installation required:
            </p>
            <ol style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>
              <li>Download <strong>backend.zip</strong> from Releases.</li>
              <li>Rename <code style={{ fontFamily: 'monospace' }}>.env.example</code> to <code style={{ fontFamily: 'monospace' }}>.env</code> and add your Ngrok credentials.</li>
              <li>Run the stack in terminal:</li>
            </ol>
            <div className="terminal-box" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
              <code style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{dockerComposeCmd}</code>
              <CopyButton text={dockerComposeCmd} />
            </div>
          </div>

          {/* Method B */}
          <div className="card" style={{ background: 'var(--card-bg)', border: 'var(--glass-border)', padding: '1.5rem', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <CloudLightning style={{ color: '#3b82f6', width: '22px', height: '22px' }} />
              <h3 style={{ margin: 0 }}>Method B: Standalone Docker (Manual)</h3>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Build and run the backend container manually, then expose it using local tunnel CLIs on your host machine:
            </p>
            <div className="terminal-box" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <code style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{runDockerCmd}</code>
              <CopyButton text={runDockerCmd} />
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>Expose port 8080 manually:</p>
            <div className="terminal-box" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
              <code style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{ngrokCmd}</code>
              <CopyButton text={ngrokCmd} />
            </div>
          </div>
        </div>
      </section>

      {/* Step 3 */}
      <section className="step-section reveal visible" style={{ marginBottom: '3rem' }}>
        <h2>3. Paste Tunnel URL in Konvert App</h2>
        <p>Connect your client application to your newly created secure backend tunnel:</p>
        <ol style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)', display: 'grid', gap: '0.5rem' }}>
          <li>Open the Konvert mobile application on your device.</li>
          <li>Navigate to <strong>Settings</strong> or tap the <strong>System Status</strong> card on the Dashboard.</li>
          <li>Paste your forwarding tunnel URL (e.g. <code style={{ fontFamily: 'monospace' }}>https://xxxx.ngrok-free.app</code>) into the "Backend URL" field.</li>
          <li>Tap <strong>Test Connection</strong>. Once it connects successfully, you are fully set up to convert documents!</li>
        </ol>
      </section>

      {/* Troubleshooting card */}
      <section className="step-section reveal visible">
        <h2>Troubleshooting & Logs</h2>
        <div className="card" style={{ background: 'var(--card-bg)', border: 'var(--glass-border)', padding: '2rem', borderRadius: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Network className="text-emerald" style={{ width: '18px', height: '18px' }} />
                Checking Server Health
              </h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Open <code style={{ fontFamily: 'monospace' }}>https://your-domain.ngrok-free.app/health</code> in a browser. It should return <code style={{ fontFamily: 'monospace' }}>{"{"}"status": "ok"{"}"}</code>. If it does not, check if your local server is running.
              </p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Terminal className="text-emerald" style={{ width: '18px', height: '18px' }} />
                Reading Docker Logs
              </h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                If you encounter conversion failures, check your container logs:
                <br />
                • Compose: <code style={{ fontFamily: 'monospace' }}>docker-compose logs -f</code>
                <br />
                • Standalone: <code style={{ fontFamily: 'monospace' }}>docker logs -f konvert-backend</code>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
