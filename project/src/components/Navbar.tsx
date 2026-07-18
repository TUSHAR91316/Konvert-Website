import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Zap, Moon, Sun, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
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

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="nav-brand" onClick={closeMobile}>
          <Zap className="text-emerald" style={{ width: '24px', height: '24px' }} />
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
          <button
            id="theme-toggle"
            className="theme-toggle-btn"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <Sun style={{ width: '20px', height: '20px' }} />
            ) : (
              <Moon style={{ width: '20px', height: '20px' }} />
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
              <X style={{ width: '20px', height: '20px' }} />
            ) : (
              <Menu style={{ width: '20px', height: '20px' }} />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
