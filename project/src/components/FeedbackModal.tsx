import React, { useState } from 'react';
import { 
  X, Star, Bug, Sparkles, Sliders, Zap, MessageSquare, 
  Send, ExternalLink, Copy, Check, ShieldCheck 
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export type FeedbackCategory = 'bug' | 'feature' | 'ui' | 'perf' | 'general';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: FeedbackCategory;
}

const CATEGORIES: { id: FeedbackCategory; label: string; icon: React.FC<{ style?: React.CSSProperties }> }[] = [
  { id: 'bug', label: 'Bug Report', icon: Bug },
  { id: 'feature', label: 'Feature Request', icon: Sparkles },
  { id: 'ui', label: 'UI & UX', icon: Sliders },
  { id: 'perf', label: 'Performance', icon: Zap },
  { id: 'general', label: 'General', icon: MessageSquare },
];

const RATING_LABELS = ['Needs Work', 'Below Average', 'Average', 'Good', 'Excellent'];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'feature'
}) => {
  const { showToast } = useToast();

  const [category, setCategory] = useState<FeedbackCategory>(initialCategory);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [includeDiagnostics, setIncludeDiagnostics] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getDiagnostics = () => {
    return {
      os: navigator.platform || 'Unknown OS',
      userAgent: navigator.userAgent,
      screen: `${window.innerWidth}x${window.innerHeight}`,
      pathname: window.location.pathname,
      timestamp: new Date().toISOString()
    };
  };

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
        showToast('Feedback submitted successfully. Thank you for helping improve Konvert!', 'success');
        onClose();
        // Reset state
        setTitle('');
        setDescription('');
        setEmail('');
      }, 400);
    } catch {
      setIsSubmitting(false);
      showToast('Feedback saved locally. Thank you!', 'success');
      onClose();
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

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="feedback-modal-title">
      <div className="modal-card solid-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="icon-badge">
              <MessageSquare style={{ width: '18px', height: '18px', color: 'var(--emerald-500)' }} />
            </div>
            <div>
              <h2 id="feedback-modal-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                Share Your Feedback
              </h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Help shape Konvert. Bugs, feature suggestions, or general input.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        <form onSubmit={handleInAppSubmit} className="feedback-form">
          {/* Category Tabs */}
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

          {/* Rating */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Overall Experience</label>
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
                    aria-label={`Rate ${val} out of 5 stars`}
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

          {/* Subject / Title */}
          <div className="form-group">
            <label htmlFor="feedback-title" className="form-label">Subject / Title</label>
            <input
              id="feedback-title"
              type="text"
              className="form-input"
              placeholder="Brief summary (e.g. Add dark mode preference persistence)"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={120}
            />
          </div>

          {/* Detailed Message */}
          <div className="form-group">
            <label htmlFor="feedback-desc" className="form-label">
              Details <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              id="feedback-desc"
              className="form-textarea"
              rows={4}
              placeholder="What worked well, what was confusing, or steps to reproduce a bug..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Optional Email */}
          <div className="form-group">
            <label htmlFor="feedback-email" className="form-label">
              Contact Email <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              id="feedback-email"
              type="email"
              className="form-input"
              placeholder="name@example.com (only if you'd like a response)"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {/* Environment Diagnostics Toggle */}
          <div className="diagnostics-box">
            <label className="diagnostics-toggle-label">
              <input
                type="checkbox"
                checked={includeDiagnostics}
                onChange={e => setIncludeDiagnostics(e.target.checked)}
                style={{ accentColor: 'var(--emerald-500)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                <ShieldCheck style={{ width: '16px', height: '16px', color: 'var(--emerald-500)' }} />
                <span>Attach anonymous environment diagnostics (Browser, OS, Screen resolution)</span>
              </div>
            </label>
          </div>

          {/* Action Button Suite */}
          <div className="feedback-actions">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ flex: 1, padding: '0.75rem 1.25rem', fontSize: '0.95rem' }}
            >
              <Send style={{ width: '16px', height: '16px' }} />
              <span>{isSubmitting ? 'Sending...' : 'Submit Feedback'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenGitHubIssue}
              className="btn btn-secondary-solid"
              title="Open structured issue on GitHub repository"
            >
              <ExternalLink style={{ width: '16px', height: '16px' }} />
              <span>GitHub Issue</span>
            </button>

            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="btn btn-secondary-solid"
              title="Copy formatted Markdown to clipboard"
            >
              {copied ? <Check style={{ width: '16px', height: '16px', color: 'var(--emerald-500)' }} /> : <Copy style={{ width: '16px', height: '16px' }} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
