import React, { useState } from 'react';
import { 
  X, Star, Bug, Sparkles, Sliders, Zap, MessageSquare, 
  Send, ExternalLink, Copy, Check, ShieldCheck 
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useModal } from '../hooks/useModal';
import type { FeedbackCategory } from '../types/feedback';
import { 
  RATING_LABELS, 
  formatFeedbackMarkdown, 
  createGitHubIssueUrl, 
  saveFeedbackToStorage 
} from '../services/feedbackService';

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

  useModal({ isOpen, onClose });

  if (!isOpen) return null;

  const handleInAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast('Please provide a brief description before submitting.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      saveFeedbackToStorage(category, rating, title, description, email, includeDiagnostics);
      showToast('Thank you! Your feedback has been recorded locally.', 'success');
      setTitle('');
      setDescription('');
      setEmail('');
      setTimeout(() => {
        onClose();
      }, 600);
    } catch {
      showToast('Failed to save feedback.', 'error');
    } finally {
      setIsSubmitting(false);
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
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="icon-badge">
              <MessageSquare style={{ width: '18px', height: '18px', color: 'var(--emerald-500)' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Share Feedback &amp; Suggestions</h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Help us build a better, privacy-first converter</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* Feedback Form */}
        <form onSubmit={handleInAppSubmit} className="feedback-form">
          {/* Category Tabs */}
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

          {/* Rating */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>How is your experience with Konvert?</span>
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
                      width: '24px',
                      height: '24px',
                      fill: star <= (hoverRating ?? rating) ? '#f59e0b' : 'none',
                      color: star <= (hoverRating ?? rating) ? '#f59e0b' : 'var(--text-muted)',
                      transition: 'color 0.15s ease, fill 0.15s ease'
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="modal-feedback-title">Title / Topic (Optional)</label>
            <input
              id="modal-feedback-title"
              type="text"
              className="form-input"
              placeholder="e.g., Image compression target size slider"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="modal-feedback-description">
              Description <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              id="modal-feedback-description"
              required
              className="form-textarea"
              rows={3}
              placeholder="Tell us what went wrong or what feature you would love to see..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* Email (Optional) */}
          <div className="form-group">
            <label className="form-label" htmlFor="modal-feedback-email">
              Contact Email (Optional)
            </label>
            <input
              id="modal-feedback-email"
              type="email"
              className="form-input"
              placeholder="your@email.com (if you would like us to follow up)"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {/* Diagnostics toggle */}
          <div className="diagnostics-box">
            <label className="diagnostics-toggle-label">
              <input
                type="checkbox"
                checked={includeDiagnostics}
                onChange={e => setIncludeDiagnostics(e.target.checked)}
                style={{ accentColor: 'var(--emerald-500)', width: '16px', height: '16px' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>
                  Include anonymous diagnostics
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  OS, screen resolution, browser version (helps debug faster)
                </span>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="feedback-actions">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              <Send style={{ width: '15px', height: '15px' }} />
              <span>{isSubmitting ? 'Sending...' : 'Submit In-App'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenGitHubIssue}
              className="btn btn-secondary-solid"
              title="Open prefilled GitHub Issue"
            >
              <span>GitHub Issue</span>
              <ExternalLink style={{ width: '13px', height: '13px' }} />
            </button>

            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="btn btn-outline"
              title="Copy markdown to clipboard"
            >
              {copied ? (
                <Check className="text-emerald" style={{ width: '15px', height: '15px' }} />
              ) : (
                <Copy style={{ width: '15px', height: '15px' }} />
              )}
              <span>{copied ? 'Copied' : 'MD'}</span>
            </button>
          </div>

          {/* Privacy Note */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', marginTop: '0.25rem' }}>
            <ShieldCheck style={{ width: '14px', height: '14px', color: 'var(--emerald-500)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Feedback is stored locally on your device with no remote trackers.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
