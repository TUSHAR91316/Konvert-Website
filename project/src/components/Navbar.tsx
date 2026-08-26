import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Zap, Moon, Sun, Menu, X, MessageSquare } from 'lucide-react';

interface NavbarProps {
  onOpenFeedback?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenFeedback }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  const closeMobile = () => setMobileMenuOpen(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="nav-brand" onClick={closeMobile}>
          <Zap className="text-emerald" style={{ width: '22px', height: '22px' }} />
          <span>Konvert</span>
        </Link>

        <div className={`nav-links${mobileMenuOpen ? ' active' : ''}`} id="nav-links">
          {[
            { to: '/', label: 'Home' },
            { to: '/studio', label: 'Studio' },
            { to: '/roadmap', label: 'Roadmap' },
            { to: '/self-hosting', label: 'Self-Hosting' },
            { to: '/community', label: 'Community' },
            { to: '/faq', label: 'FAQ' },
            { to: '/feedback', label: 'Feedback' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={closeMobile}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {onOpenFeedback && (
            <button
              onClick={onOpenFeedback}
              className="btn btn-secondary-solid"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              title="Share Feedback"
            >
              <MessageSquare style={{ width: '15px', height: '15px', color: 'var(--emerald-500)' }} />
              <span className="feedback-nav-text">Feedback</span>
            </button>
          )}

          <button
            id="theme-toggle"
            className="theme-toggle-btn"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <Sun style={{ width: '18px', height: '18px' }} />
            ) : (
              <Moon style={{ width: '18px', height: '18px' }} />
            )}
          </button>

          <button
            className="mobile-menu-btn"
            id="mobile-menu-btn"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(prev => !prev)}
          >
            {mobileMenuOpen ? (
              <X style={{ width: '18px', height: '18px' }} />
            ) : (
              <Menu style={{ width: '18px', height: '18px' }} />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
