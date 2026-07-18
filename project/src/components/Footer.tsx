import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-body">
          <div className="footer-brand">
            <Zap className="text-emerald" style={{ width: '24px', height: '24px' }} />
            <span className="footer-logo-text">Konvert</span>
          </div>

          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/studio">Studio</Link>
            <Link to="/roadmap">Roadmap</Link>
            <Link to="/self-hosting">Self-Hosting</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/community">Community</Link>
            <Link to="/faq">FAQ</Link>
            <a
              href="https://github.com/TUSHAR91316/Konvert-Website"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <GithubIcon style={{ width: '16px', height: '16px' }} />
              GitHub
            </a>
          </div>

          <p className="footer-copy">
            &copy; {year} Konvert. All rights reserved. | Built with ❤️ for privacy-first file conversion.
          </p>
        </div>
      </div>
    </footer>
  );
};
