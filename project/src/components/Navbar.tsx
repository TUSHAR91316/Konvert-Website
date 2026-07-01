import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Zap, Moon, Sun, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return system ? 'dark' : 'light';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (theme === 'dark') {
      htmlElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-brand" onClick={() => setMobileMenuOpen(false)}>
          <Zap className="text-emerald" style={{ width: '24px', height: '24px' }} />
          <span>Konvert</span>
        </Link>
        <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`} id="nav-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink 
            to="/studio" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Studio
          </NavLink>
          <NavLink 
            to="/roadmap" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Roadmap
          </NavLink>
          <NavLink 
            to="/self-hosting" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Self-Hosting
          </NavLink>
          <NavLink 
            to="/community" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Community
          </NavLink>
          <NavLink 
            to="/faq" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            FAQ
          </NavLink>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            id="theme-toggle" 
            className="theme-toggle-btn" 
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <span id="sun-wrapper"><Sun style={{ width: '20px', height: '20px' }} /></span>
            ) : (
              <span id="moon-wrapper"><Moon style={{ width: '20px', height: '20px' }} /></span>
            )}
          </button>
          <button 
            className="mobile-menu-btn" 
            id="mobile-menu-btn" 
            aria-label="Toggle menu"
            onClick={toggleMobileMenu}
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
