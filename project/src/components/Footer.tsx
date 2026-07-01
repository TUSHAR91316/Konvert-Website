import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export const Footer: React.FC = () => {
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
          </div>
          <p className="footer-copy">
            &copy; 2026 Konvert. All rights reserved. | Built with ❤️ for privacy-first file conversion.
          </p>
        </div>
      </div>
    </footer>
  );
};
