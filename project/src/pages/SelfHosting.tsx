import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Terminal, Copy, Check, Server, Shield, Network, Zap, CloudLightning } from 'lucide-react';

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
    window.scrollTo(0, 0);
  }, []);

  const runDockerCmd = `docker run -d -p 5000:5000 --name konvert-backend tushar91316/konvert-backend:latest`;
  const ngrokCmd = `ngrok http 5000`;
  const cloudflareCmd = `cloudflared tunnel --url http://localhost:5000`;

  return (
    <main className="page-container" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <Link to="/" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Back to Home
        </Link>
        <Link to="/dashboard" className="backend-tester-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', background: 'var(--primary-gradient)', padding: '0.5rem 1rem', borderRadius: '0.5rem', color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>
          <Server style={{ width: '16px', height: '16px' }} />
          Test Backend Connection
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
              Unlike traditional SaaS apps, Konvert does not run a central cloud compiler. To translate complex documents, the mobile and desktop client connects directly to your private local Docker instance over a secure tunnel. Your documents never touch our infrastructure.
            </p>
          </div>
        </div>
      </div>

      {/* Step 1 */}
      <section className="step-section reveal visible" style={{ marginBottom: '3rem' }}>
        <h2>1. Spin Up the Docker Container</h2>
        <p>Ensure you have Docker Desktop running. Open your CLI terminal and execute the official Konvert conversion image. It wraps a microservice API around LibreOffice to parse files dynamically:</p>
        <div className="terminal-box" style={{ background: 'var(--card-bg)', border: 'var(--glass-border)', padding: '1rem', borderRadius: '0.75rem', position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            <Terminal className="text-emerald" style={{ flexShrink: 0, width: '18px', height: '18px' }} />
            <code style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--text-main)' }}>{runDockerCmd}</code>
          </div>
          <CopyButton text={runDockerCmd} />
        </div>
        <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          This runs the backend on container port 5000 and exposes it to <code style={{ fontFamily: 'monospace' }}>http://localhost:5000</code>.
        </p>
      </section>

      {/* Step 2 */}
      <section className="step-section reveal visible" style={{ marginBottom: '3rem' }}>
        <h2>2. Expose Container via Secure Tunnel</h2>
        <p>If you're using the Windows Desktop client, you can connect directly to local host. For the Android App to access the localhost API, you must route it through a secure tunnel service like Ngrok or Cloudflare:</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          {/* Ngrok Option */}
          <div className="card" style={{ background: 'var(--card-bg)', border: 'var(--glass-border)', padding: '1.5rem', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Zap style={{ color: '#3b82f6', width: '22px', height: '22px' }} />
              <h3 style={{ margin: 0 }}>Option A: Ngrok Tunnel</h3>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>Spin up a free Ngrok HTTP tunnel mapping to port 5000:</p>
            <div className="terminal-box" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
              <code style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{ngrokCmd}</code>
              <CopyButton text={ngrokCmd} />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              Ngrok will output a forwarding link (e.g. <code style={{ fontFamily: 'monospace' }}>https://xxxx.ngrok-free.app</code>).
            </p>
          </div>

          {/* Cloudflare Option */}
          <div className="card" style={{ background: 'var(--card-bg)', border: 'var(--glass-border)', padding: '1.5rem', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <CloudLightning style={{ color: '#f97316', width: '22px', height: '22px' }} />
              <h3 style={{ margin: 0 }}>Option B: Cloudflare Tunnel</h3>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>Alternatively, use Cloudflare's free quick tunnel CLI:</p>
            <div className="terminal-box" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
              <code style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{cloudflareCmd}</code>
              <CopyButton text={cloudflareCmd} />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              Cloudflare will display a random hostname (e.g. <code style={{ fontFamily: 'monospace' }}>https://xxxx.trycloudflare.com</code>).
            </p>
          </div>
        </div>
      </section>

      {/* Step 3 */}
      <section className="step-section reveal visible" style={{ marginBottom: '3rem' }}>
        <h2>3. Paste Tunnel URL in Konvert App</h2>
        <p>Connect your client application to your newly created secure backend tunnel:</p>
        <ol style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)', display: 'grid', gap: '0.5rem' }}>
          <li>Open the Konvert mobile application on Android, or the desktop app on Windows.</li>
          <li>Navigate to <strong>Settings</strong> &gt; <strong>Server Settings</strong>.</li>
          <li>Paste your forwarding tunnel URL (e.g. <code style={{ fontFamily: 'monospace' }}>https://xxxx.ngrok-free.app</code>) into the backend server host address input.</li>
          <li>Click <strong>Test Connection</strong>. When it lights up green, you are fully set up to compile PDF documents!</li>
        </ol>
      </section>

      {/* Troubleshooting card */}
      <section className="step-section reveal visible">
        <h2>Troubleshooting Connections</h2>
        <div className="card" style={{ background: 'var(--card-bg)', border: 'var(--glass-border)', padding: '2rem', borderRadius: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Network className="text-emerald" style={{ width: '18px', height: '18px' }} />
                Cors Preflight Blocked
              </h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Our backend container has wildcard headers pre-enabled. If you use custom proxies, ensure headers like `Access-Control-Allow-Origin` pass wildcard permissions properly.
              </p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Terminal className="text-emerald" style={{ width: '18px', height: '18px' }} />
                Ngrok Web Interstitial
              </h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                By default, Ngrok shows a browser warning page. Our mobile clients handle custom request headers to bypass this. If test queries fail, ensure you are sending the `ngrok-skip-browser-warning` header value.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
