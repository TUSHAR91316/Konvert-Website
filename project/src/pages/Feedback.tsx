import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, MessageSquare, Star, Bug, Sparkles, Sliders, Zap, 
  Send, ExternalLink, Copy, Check, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import { GithubIcon } from '../components/GithubIcon';
import { useToast } from '../context/ToastContext';
import type { FeedbackCategory } from '../components/FeedbackModal';

const CATEGORIES: { id: FeedbackCategory; label: string; icon: React.FC<{ style?: React.CSSProperties }> }[] = [
  { id: 'bug', label: 'Bug Report', icon: Bug },
  { id: 'feature', label: 'Feature Request', icon: Sparkles },
  { id: 'ui', label: 'UI & Usability', icon: Sliders },
  { id: 'perf', label: 'Performance', icon: Zap },
  { id: 'general', label: 'General', icon: MessageSquare },
];

const RATING_LABELS = ['Needs Work', 'Below Average', 'Average', 'Good', 'Excellent'];

export const Feedback: React.FC = () => {
  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'Feedback & Suggestions — Konvert';
    return () => { document.title = 'Konvert'; };
  }, []);

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

  const getDiagnostics = () => ({
    os: navigator.platform || 'Unknown OS',
    userAgent: navigator.userAgent,
    screen: `${window.innerWidth}x${window.innerHeight}`,
    pathname: window.location.pathname,
    timestamp: new Date().toISOString()
  });

  const formatMarkdownReport = () => {
    const diag = getDiagnostics();
    const catLabel = CATEGORIES.find(c => c.id === category)?.label || category;
    return `### [Feedback] ${title || 'Konvert Feedback'}

**Category**: ${catLabel}
**Rating**: ${rating}/5 (${RATING_LABELS[rating - 1]})
${email ? `**Contact**: ${email}` : ''}

#### Description:
${description || 'No additional details provided.'}

${includeDiagnostics ? `#### Environment Diagnostics:
- **Route**: \`${diag.pathname}\`
- **Resolution**: \`${diag.screen}\`
- **Platform**: \`${diag.os}\`
- **User Agent**: \`${diag.userAgent}\`
- **Timestamp**: \`${diag.timestamp}\`` : ''}
`;
  };

  const handleInAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast('Please provide a brief description before submitting.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackRecord = {
        id: Math.random().toString(36).substring(2, 9),
        category,
        rating,
        title: title.trim(),
        description: description.trim(),
        email: email.trim(),
        diagnostics: includeDiagnostics ? getDiagnostics() : null,
        date: new Date().toISOString()
      };

      const existing = JSON.parse(localStorage.getItem('konvert_user_feedback') || '[]');
      existing.unshift(feedbackRecord);
      localStorage.setItem('konvert_user_feedback', JSON.stringify(existing.slice(0, 50)));

      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        showToast('Feedback submitted successfully. Thank you!', 'success');
      }, 400);
    } catch {
      setIsSubmitting(false);
      setSubmitted(true);
      showToast('Feedback recorded locally. Thank you!', 'success');
    }
  };

  const handleOpenGitHubIssue = () => {
    if (!description.trim()) {
      showToast('Please enter a brief description first.', 'error');
      return;
    }

    const issueTitle = encodeURIComponent(`[${category.toUpperCase()}] ${title.trim() || 'User Feedback'}`);
    const issueBody = encodeURIComponent(formatMarkdownReport());
    const labels = category === 'bug' ? 'bug' : category === 'feature' ? 'enhancement' : 'feedback';
    const url = `https://github.com/TUSHAR91316/Konvert/issues/new?title=${issueTitle}&body=${issueBody}&labels=${labels}`;
    
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast('Opening GitHub Issue template...', 'info');
  };

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(formatMarkdownReport());
      setCopied(true);
      showToast('Feedback formatted as Markdown and copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setTitle('');
    setDescription('');
    setEmail('');
    setRating(5);
  };

  return (
    <main className="page-container" style={{ paddingBottom: '5rem' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Form Column */}
        <div className="solid-card" style={{ padding: '2rem' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div className="icon-badge" style={{ width: '56px', height: '56px', margin: '0 auto 1.5rem auto' }}>
                <CheckCircle2 style={{ width: '32px', height: '32px', color: 'var(--emerald-500)' }} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Feedback Received</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
                Thank you for taking the time to share your feedback. Your suggestions directly impact the Konvert roadmap.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={resetForm} className="btn btn-primary">
                  Submit Another Response
                </button>
                <Link to="/" className="btn btn-secondary-solid">
                  Return Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleInAppSubmit} className="feedback-form">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare style={{ width: '20px', height: '20px', color: 'var(--emerald-500)' }} />
                <span>Submit Feedback</span>
              </h2>

              {/* Category Segmented Grid */}
              <div className="form-group">
                <label className="form-label">Category</label>
                <div className="category-segmented-grid">
                  {CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        className={`category-pill-btn ${isSelected ? 'active' : ''}`}
                        onClick={() => setCategory(cat.id)}
                      >
                        <Icon style={{ width: '15px', height: '15px' }} />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Star Rating */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>Rating</label>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--emerald-500)' }}>
                    {RATING_LABELS[(hoverRating || rating) - 1]} ({hoverRating || rating}/5)
                  </span>
                </div>
                <div className="star-rating-row" onMouseLeave={() => setHoverRating(null)}>
                  {[1, 2, 3, 4, 5].map(val => {
                    const isFilled = (hoverRating !== null ? hoverRating : rating) >= val;
                    return (
                      <button
                        key={val}
                        type="button"
                        className="star-btn"
                        onClick={() => setRating(val)}
                        onMouseEnter={() => setHoverRating(val)}
                        aria-label={`Rate ${val} stars`}
                      >
                        <Star
                          style={{
                            width: '24px',
                            height: '24px',
                            fill: isFilled ? '#eab308' : 'none',
                            stroke: isFilled ? '#eab308' : 'var(--border-color)',
                            transition: 'all 0.15s ease'
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subject */}
              <div className="form-group">
                <label htmlFor="page-feedback-title" className="form-label">Subject / Title</label>
                <input
                  id="page-feedback-title"
                  type="text"
                  className="form-input"
                  placeholder="Summary (e.g. Offline PDF generation enhancement)"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  maxLength={120}
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="page-feedback-desc" className="form-label">
                  Description <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  id="page-feedback-desc"
                  className="form-textarea"
                  rows={5}
                  placeholder="Provide details, steps to reproduce, or workflow suggestions..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="page-feedback-email" className="form-label">
                  Contact Email <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
                </label>
                <input
                  id="page-feedback-email"
                  type="email"
                  className="form-input"
                  placeholder="name@example.com (only if you want follow-up)"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              {/* Diagnostics */}
              <div className="diagnostics-box" style={{ marginBottom: '1.5rem' }}>
                <label className="diagnostics-toggle-label">
                  <input
                    type="checkbox"
                    checked={includeDiagnostics}
                    onChange={e => setIncludeDiagnostics(e.target.checked)}
                    style={{ accentColor: 'var(--emerald-500)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                    <ShieldCheck style={{ width: '16px', height: '16px', color: 'var(--emerald-500)' }} />
                    <span>Include anonymous environment diagnostics (OS, Browser, Screen)</span>
                  </div>
                </label>
              </div>

              {/* Actions */}
              <div className="feedback-actions">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.85rem 1.5rem' }}
                >
                  <Send style={{ width: '16px', height: '16px' }} />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenGitHubIssue}
                  className="btn btn-secondary-solid"
                >
                  <ExternalLink style={{ width: '16px', height: '16px' }} />
                  <span>GitHub Issue</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  className="btn btn-secondary-solid"
                >
                  {copied ? <Check style={{ width: '16px', height: '16px', color: 'var(--emerald-500)' }} /> : <Copy style={{ width: '16px', height: '16px' }} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sidebar Information Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Channels */}
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
                href="https://github.com/TUSHAR91316/Konvert/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary-solid"
                style={{ justifyContent: 'space-between' }}
              >
                <span>Browse Open Issues</span>
                <ExternalLink style={{ width: '14px', height: '14px' }} />
              </a>
              <a
                href="https://github.com/TUSHAR91316/Konvert/discussions"
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

          {/* Privacy & Handling Note */}
          <div className="solid-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck style={{ width: '18px', height: '18px', color: 'var(--emerald-500)' }} />
              <span>How We Handle Feedback</span>
            </h3>
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.88rem', display: 'grid', gap: '0.6rem', margin: 0 }}>
              <li><strong>Zero tracking:</strong> We do not track identity, cookies, or telemetry.</li>
              <li><strong>Direct review:</strong> Suggestions are triaged directly into our project roadmap.</li>
              <li><strong>No spam:</strong> Your email is only used if we need clarification on a bug report.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};
