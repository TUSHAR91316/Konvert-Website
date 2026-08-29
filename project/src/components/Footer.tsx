import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ExternalLink, MessageSquare } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { GITHUB_REPO_URL, GITHUB_RELEASES_URL } from '../constants/links';

interface FooterProps {
  onOpenFeedback?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenFeedback }) => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Zap className="text-emerald" style={{ width: '22px', height: '22px' }} />
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>Konvert</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '320px', marginBottom: '1.25rem' }}>
              Privacy-first document and image conversion engine. Run 100% on-device or with your self-hosted Docker backend.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald-500)' }} />
              <span>All systems operational</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="footer-col">
            <h4>Product</h4>
            <div className="footer-col-links">
              <Link to="/studio">Conversion Studio</Link>
              <Link to="/roadmap">Roadmap &amp; Releases</Link>
              <Link to="/self-hosting">Self-Hosting Guide</Link>
              <a href={GITHUB_RELEASES_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>Download APK</span>
                <ExternalLink style={{ width: '12px', height: '12px' }} />
              </a>
            </div>
          </div>

          {/* Community & Support */}
          <div className="footer-col">
            <h4>Community</h4>
            <div className="footer-col-links">
              <Link to="/community">Discussions</Link>
              <Link to="/faq">Frequently Asked Questions</Link>
              <Link to="/feedback">Feedback Hub</Link>
              {onOpenFeedback && (
                <button
                  onClick={onOpenFeedback}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    textAlign: 'left',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                  className="footer-feedback-link"
                >
                  <MessageSquare style={{ width: '13px', height: '13px' }} />
                  <span>Quick Feedback</span>
                </button>
              )}
            </div>
          </div>

          {/* Repository & Legal */}
          <div className="footer-col">
            <h4>Open Source</h4>
            <div className="footer-col-links">
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <GithubIcon style={{ width: '15px', height: '15px' }} />
                <span>GitHub Repository</span>
              </a>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; {year} Konvert. Built with privacy-first principles. Free and open source.
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Zero cookies &bull; Zero tracking &bull; On-device execution
          </div>
        </div>
      </div>
    </footer>
  );
};
