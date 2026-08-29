import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, MessageSquare, Star, Bug, Sparkles, Sliders, Zap, 
  Send, ExternalLink, Copy, Check, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import { GithubIcon } from '../components/GithubIcon';
import { useToast } from '../context/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import type { FeedbackCategory } from '../types/feedback';
import { 
  RATING_LABELS, 
  formatFeedbackMarkdown, 
  createGitHubIssueUrl, 
  saveFeedbackToStorage 
} from '../services/feedbackService';
import { GITHUB_ISSUES_URL, GITHUB_DISCUSSIONS_URL } from '../constants/links';

const CATEGORIES: { id: FeedbackCategory; label: string; icon: React.FC<{ style?: React.CSSProperties }> }[] = [
  { id: 'bug', label: 'Bug Report', icon: Bug },
  { id: 'feature', label: 'Feature Request', icon: Sparkles },
  { id: 'ui', label: 'UI & Usability', icon: Sliders },
  { id: 'perf', label: 'Performance', icon: Zap },
  { id: 'general', label: 'General', icon: MessageSquare },
];

export const Feedback: React.FC = () => {
  useDocumentTitle('Feedback & Suggestions — Konvert');
  const { showToast } = useToast();

  const [category, setCategory] = useState<FeedbackCategory>('feature');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [includeDiagnostics, setIncludeDiagnostics] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast('Please provide a brief description before submitting.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      saveFeedbackToStorage(category, rating, title, description, email, includeDiagnostics);
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        showToast('Feedback submitted successfully. Thank you!', 'success');
      }, 400);
    } catch {
      setIsSubmitting(false);
      showToast('Failed to save feedback record.', 'error');
    }
  };

  const handleOpenGitHubIssue = () => {
    if (!description.trim()) {
      showToast('Please provide a short description first.', 'error');
      return;
    }

    const url = createGitHubIssueUrl(category, rating, title, description, email, includeDiagnostics);
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast('Opening GitHub Issue template...', 'info');
  };

  const handleCopyMarkdown = async () => {
    try {
      const markdown = formatFeedbackMarkdown(category, rating, title, description, email, includeDiagnostics);
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      showToast('Feedback formatted as Markdown and copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Failed to copy feedback to clipboard', 'error');
    }
  };

  return (
    <main className="page-container" style={{ paddingBottom: '4rem' }}>
      <Link to="/" className="back-link" style={{ marginBottom: '2rem' }}>
        <ArrowLeft style={{ width: '16px', height: '16px' }} />
        <span>Back to Home</span>
      </Link>

      <section className="page-hero" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800 }}>
          Feedback &amp; <span className="gradient-text">Suggestions Hub</span>
        </h1>
        <p className="section-subtitle" style={{ maxWidth: '680px', margin: '0.75rem auto 0 auto' }}>
          Konvert is developed open-source with a privacy-first mindset. Share bug reports, feature requests, or suggestions to help shape future releases.
        </p>
      </section>

      {/* Main Feedback Studio Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'start' }}>
        {/* Left: Interactive Feedback Form */}
        <section className="solid-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles style={{ width: '20px', height: '20px', color: 'var(--emerald-500)' }} />
            <span>Submit Your Feedback</span>
          </h2>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <CheckCircle2 className="text-emerald" style={{ width: '32px', height: '32px' }} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>Feedback Received!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
                Your feedback has been saved locally on your device. You can also file a public issue on GitHub for community discussion.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setTitle('');
                    setDescription('');
                    setEmail('');
                  }}
                  className="btn btn-secondary-solid"
                >
                  <span>Submit Another Response</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenGitHubIssue}
                  className="btn btn-primary"
                >
                  <GithubIcon style={{ width: '16px', height: '16px' }} />
                  <span>Post on GitHub Issues</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleInAppSubmit} className="feedback-form">
              {/* Category Selector */}
              <div className="form-group">
                <label className="form-label">Category</label>
                <div className="category-segmented-grid">
                  {CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        className={`category-pill-btn${category === cat.id ? ' active' : ''}`}
                        onClick={() => setCategory(cat.id)}
                      >
                        <Icon style={{ width: '14px', height: '14px' }} />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Experience Rating */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Experience Rating</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--emerald-500)', fontWeight: 600 }}>
                    {RATING_LABELS[(hoverRating ?? rating) - 1]}
                  </span>
                </label>
                <div className="star-rating-row" onMouseLeave={() => setHoverRating(null)}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className="star-btn"
                      onMouseEnter={() => setHoverRating(star)}
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star} star`}
                    >
                      <Star
                        style={{
                          width: '26px',
                          height: '26px',
                          fill: star <= (hoverRating ?? rating) ? '#f59e0b' : 'none',
                          color: star <= (hoverRating ?? rating) ? '#f59e0b' : 'var(--text-muted)',
                          transition: 'color 0.15s ease, fill 0.15s ease'
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary Title */}
              <div className="form-group">
                <label className="form-label" htmlFor="feedback-title">Title / Summary (Optional)</label>
                <input
                  id="feedback-title"
                  type="text"
                  className="form-input"
                  placeholder="e.g., Add batch image rotation option"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              {/* Detailed Description */}
              <div className="form-group">
                <label className="form-label" htmlFor="feedback-description">
                  Description <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  id="feedback-description"
                  required
                  className="form-textarea"
                  rows={4}
                  placeholder="What happened? What would you like to see improved or added?"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              {/* Optional Email for followups */}
              <div className="form-group">
                <label className="form-label" htmlFor="feedback-email">
                  Contact Email (Optional)
                </label>
                <input
                  id="feedback-email"
                  type="email"
                  className="form-input"
                  placeholder="developer@example.com (only if you'd like follow-ups)"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              {/* Client Diagnostics Toggle */}
              <div className="diagnostics-box">
                <label className="diagnostics-toggle-label">
                  <input
                    type="checkbox"
                    checked={includeDiagnostics}
                    onChange={e => setIncludeDiagnostics(e.target.checked)}
                    style={{ accentColor: 'var(--emerald-500)', width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>
                    Include client environment diagnostics (OS, screen resolution, browser version)
                  </span>
                </label>
              </div>

              {/* Submission Actions */}
              <div className="feedback-actions">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <Send style={{ width: '15px', height: '15px' }} />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit In-App'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenGitHubIssue}
                  className="btn btn-secondary-solid"
                  title="Prefill a GitHub Issue on the official repository"
                >
                  <GithubIcon style={{ width: '15px', height: '15px' }} />
                  <span>Open GitHub Issue</span>
                  <ExternalLink style={{ width: '13px', height: '13px' }} />
                </button>

                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  className="btn btn-outline"
                  title="Copy formatted markdown report to clipboard"
                >
                  {copied ? (
                    <Check className="text-emerald" style={{ width: '15px', height: '15px' }} />
                  ) : (
                    <Copy style={{ width: '15px', height: '15px' }} />
                  )}
                  <span>{copied ? 'Copied' : 'Copy MD'}</span>
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Right: Repository Links & Privacy Assurance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Public Issue Tracker Card */}
          <div className="solid-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GithubIcon style={{ width: '18px', height: '18px', color: 'var(--text-main)' }} />
              <span>Public Issue Tracker</span>
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Prefer to track your feedback publicly? View ongoing issues, submit pull requests, or join discussions on our GitHub repository.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a
                href={GITHUB_ISSUES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary-solid"
                style={{ justifyContent: 'space-between' }}
              >
                <span>Browse Open Issues</span>
                <ExternalLink style={{ width: '14px', height: '14px' }} />
              </a>
              <a
                href={GITHUB_DISCUSSIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary-solid"
                style={{ justifyContent: 'space-between' }}
              >
                <span>Community Discussions</span>
                <ExternalLink style={{ width: '14px', height: '14px' }} />
              </a>
            </div>
          </div>

          {/* Privacy Box */}
          <div className="solid-card" style={{ padding: '1.75rem', borderLeft: '4px solid var(--emerald-500)' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <ShieldCheck className="text-emerald" style={{ width: '22px', height: '22px', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1rem', fontWeight: 700 }}>Privacy Assurance</h4>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  Konvert collects zero telemetry or analytical cookies. When you submit feedback in-app, it is stored strictly inside your browser&apos;s local storage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
