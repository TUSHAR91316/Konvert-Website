import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, Lightbulb, MessageCircle, Wrench, Share2 } from 'lucide-react';

const GithubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export const Community: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="page-container" style={{ paddingBottom: '4rem' }}>
      <Link to="/" className="back-link" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft style={{ width: '16px', height: '16px' }} />
        Back to Home
      </Link>

      {/* Hero Section */}
      <section className="page-hero reveal visible" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
          Join Our Community
        </h1>
        <p className="section-subtitle" style={{ maxWidth: '700px', margin: '1rem auto 0 auto' }}>
          Connect with other Konvert users, share your feedback, ask questions, and help shape the future of
          Konvert. Our community is the heart of our development process.
        </p>
      </section>

      {/* Discussion Categories */}
      <section className="discussion-categories reveal visible" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(285px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        <a href="https://github.com/TUSHAR91316/Konvert-Website/discussions/categories/announcements"
          className="category-card" target="_blank" rel="noopener noreferrer">
          <h3>
            <Bell className="category-icon text-emerald" style={{ marginRight: '0.5rem' }} />
            Announcements
          </h3>
          <p>Stay updated with the latest news, releases, and important updates from the Konvert team.</p>
          <span style={{ color: 'var(--emerald-500)', fontWeight: 600, fontSize: '0.9rem' }}>View →</span>
        </a>

        <a href="https://github.com/TUSHAR91316/Konvert-Website/discussions/categories/feature-requests"
          className="category-card" target="_blank" rel="noopener noreferrer">
          <h3>
            <Lightbulb className="category-icon" style={{ marginRight: '0.5rem', color: '#eab308' }} />
            Feature Requests
          </h3>
          <p>Suggest new features and improvements. Vote on ideas you'd like to see in Konvert.</p>
          <span style={{ color: 'var(--emerald-500)', fontWeight: 600, fontSize: '0.9rem' }}>View →</span>
        </a>

        <a href="https://github.com/TUSHAR91316/Konvert-Website/discussions/categories/general"
          className="category-card" target="_blank" rel="noopener noreferrer">
          <h3>
            <MessageCircle className="category-icon" style={{ marginRight: '0.5rem', color: '#3b82f6' }} />
            General Discussion
          </h3>
          <p>General questions, feedback, and casual conversations about Konvert.</p>
          <span style={{ color: 'var(--emerald-500)', fontWeight: 600, fontSize: '0.9rem' }}>View →</span>
        </a>

        <a href="https://github.com/TUSHAR91316/Konvert-Website/discussions/categories/troubleshooting"
          className="category-card" target="_blank" rel="noopener noreferrer">
          <h3>
            <Wrench className="category-icon" style={{ marginRight: '0.5rem', color: '#f97316' }} />
            Troubleshooting
          </h3>
          <p>Get help with issues and problems. Our community and team are here to assist.</p>
          <span style={{ color: 'var(--emerald-500)', fontWeight: 600, fontSize: '0.9rem' }}>View →</span>
        </a>

        <a href="https://github.com/TUSHAR91316/Konvert-Website/discussions/categories/show-and-tell"
          className="category-card" target="_blank" rel="noopener noreferrer">
          <h3>
            <Share2 className="category-icon" style={{ marginRight: '0.5rem', color: '#a855f7' }} />
            Show & Tell
          </h3>
          <p>Share your success stories, use cases, and creative ways you're using Konvert.</p>
          <span style={{ color: 'var(--emerald-500)', fontWeight: 600, fontSize: '0.9rem' }}>View →</span>
        </a>

        <a href="https://github.com/TUSHAR91316/Konvert-Website/discussions" className="category-card" target="_blank"
          rel="noopener noreferrer">
          <h3>
            <GithubIcon className="category-icon" style={{ marginRight: '0.5rem', color: 'var(--text-main)', width: '22px', height: '22px', display: 'inline-block' }} />
            All Discussions
          </h3>
          <p>Browse all community discussions on GitHub. Start a new topic or join an ongoing conversation.</p>
          <span style={{ color: 'var(--emerald-500)', fontWeight: 600, fontSize: '0.9rem' }}>View →</span>
        </a>
      </section>

      {/* CTA Section */}
      <section className="cta-section reveal visible" style={{ background: 'var(--secondary-gradient)', padding: '3rem 2rem', borderRadius: '1.5rem', textAlign: 'center', color: '#white', marginBottom: '4rem' }}>
        <h2 style={{ color: 'white', marginBottom: '1rem' }}>Ready to Join the Conversation?</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          Share your thoughts, ask questions, and connect with the Konvert community on GitHub Discussions.
        </p>
        <a href="https://github.com/TUSHAR91316/Konvert-Website/discussions" className="btn btn-white" target="_blank"
          rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--emerald-600)' }}>
          <GithubIcon style={{ width: '20px', height: '20px' }} />
          Start Discussing Now
        </a>
      </section>

      {/* Community Guidelines */}
      <section className="guidelines-section reveal visible" style={{ padding: '2rem', background: 'var(--card-bg)', border: 'var(--glass-border)', borderRadius: '1.5rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Community Guidelines</h2>
        <ul className="guidelines-list" style={{ display: 'grid', gap: '0.75rem', paddingLeft: '1.25rem', color: 'var(--text-muted)' }}>
          <li>Be respectful and constructive in all interactions</li>
          <li>Search for existing discussions before posting to avoid duplicates</li>
          <li>Provide clear and detailed information when describing issues</li>
          <li>Share your positive experiences and use cases</li>
          <li>Help others when you can—community support is invaluable</li>
          <li>No spam, self-promotion, or off-topic discussions</li>
          <li>Report inappropriate behavior to maintainers</li>
        </ul>
      </section>
    </main>
  );
};
