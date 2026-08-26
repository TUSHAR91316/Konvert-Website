import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, Lightbulb, MessageCircle, Wrench, MessageSquare, ExternalLink } from 'lucide-react';
import { GithubIcon } from '../components/GithubIcon';

export const Community: React.FC = () => {
  useEffect(() => {
    document.title = 'Community — Konvert';
    return () => { document.title = 'Konvert'; };
  }, []);

  return (
    <main className="page-container" style={{ paddingBottom: '4rem' }}>
      <Link to="/" className="back-link" style={{ marginBottom: '2rem' }}>
        <ArrowLeft style={{ width: '16px', height: '16px' }} />
        <span>Back to Home</span>
      </Link>

      {/* Hero Section */}
      <section className="page-hero" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}>
          Community &amp; <span className="gradient-text">Discussions</span>
        </h1>
        <p className="section-subtitle" style={{ maxWidth: '680px', margin: '0.75rem auto 0 auto' }}>
          Connect with Konvert contributors and users, discuss privacy workflows, and collaborate on open-source features.
        </p>
      </section>

      {/* Discussion Channels Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <a
          href="https://github.com/TUSHAR91316/Konvert/discussions/categories/announcements"
          className="solid-card"
          target="_blank"
          rel="noopener noreferrer"
          style={{ padding: '1.5rem', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div className="icon-badge">
              <Bell style={{ width: '18px', height: '18px', color: 'var(--emerald-500)' }} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Announcements</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5, flex: 1, margin: 0 }}>
            Official release notes, architecture updates, and security disclosures.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--emerald-500)', fontWeight: 600, fontSize: '0.85rem', marginTop: '1rem' }}>
            <span>View Announcements</span>
            <ExternalLink style={{ width: '13px', height: '13px' }} />
          </div>
        </a>

        <a
          href="https://github.com/TUSHAR91316/Konvert/discussions/categories/feature-requests"
          className="solid-card"
          target="_blank"
          rel="noopener noreferrer"
          style={{ padding: '1.5rem', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div className="icon-badge">
              <Lightbulb style={{ width: '18px', height: '18px', color: '#eab308' }} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Feature Requests</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5, flex: 1, margin: 0 }}>
            Suggest new formats, compression algorithms, and vote on community ideas.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--emerald-500)', fontWeight: 600, fontSize: '0.85rem', marginTop: '1rem' }}>
            <span>View Suggestions</span>
            <ExternalLink style={{ width: '13px', height: '13px' }} />
          </div>
        </a>

        <a
          href="https://github.com/TUSHAR91316/Konvert/discussions/categories/troubleshooting"
          className="solid-card"
          target="_blank"
          rel="noopener noreferrer"
          style={{ padding: '1.5rem', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div className="icon-badge">
              <Wrench style={{ width: '18px', height: '18px', color: '#f97316' }} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Troubleshooting</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5, flex: 1, margin: 0 }}>
            Get help configuring Docker, resolving CORS issues, and setting up tunnels.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--emerald-500)', fontWeight: 600, fontSize: '0.85rem', marginTop: '1rem' }}>
            <span>Troubleshoot</span>
            <ExternalLink style={{ width: '13px', height: '13px' }} />
          </div>
        </a>

        <a
          href="https://github.com/TUSHAR91316/Konvert/discussions/categories/general"
          className="solid-card"
          target="_blank"
          rel="noopener noreferrer"
          style={{ padding: '1.5rem', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div className="icon-badge">
              <MessageCircle style={{ width: '18px', height: '18px', color: '#3b82f6' }} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>General Q&amp;A</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5, flex: 1, margin: 0 }}>
            Casual discussions, questions about local-first privacy, and use-cases.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--emerald-500)', fontWeight: 600, fontSize: '0.85rem', marginTop: '1rem' }}>
            <span>Browse Topics</span>
            <ExternalLink style={{ width: '13px', height: '13px' }} />
          </div>
        </a>
      </section>

      {/* Feedback Hub Bridge Banner */}
      <section className="solid-card" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '3rem', background: 'var(--bg-secondary)' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Have Direct Feedback or a Bug to Report?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', maxWidth: '540px', margin: '0 auto 1.5rem auto' }}>
          Use our interactive feedback console to submit feedback directly or format an issue report in seconds.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/feedback" className="btn btn-primary">
            <MessageSquare style={{ width: '16px', height: '16px' }} />
            <span>Open Feedback Hub</span>
          </Link>
          <a
            href="https://github.com/TUSHAR91316/Konvert/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary-solid"
          >
            <GithubIcon style={{ width: '16px', height: '16px' }} />
            <span>Open GitHub Discussions</span>
          </a>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="solid-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Community Guidelines</h2>
        <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'grid', gap: '0.5rem', margin: 0 }}>
          <li>Maintain constructive and respectful discourse across all threads.</li>
          <li>Search existing GitHub discussions before initiating duplicate questions.</li>
          <li>Include relevant operating system and version numbers when reporting bugs.</li>
          <li>Do not post personal credentials, private tokens, or sensitive API keys.</li>
        </ul>
      </section>
    </main>
  );
};
