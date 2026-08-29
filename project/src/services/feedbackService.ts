import type { FeedbackCategory, FeedbackRecord, DiagnosticsData } from '../types/feedback';
import { GITHUB_NEW_ISSUE_URL } from '../constants/links';

const FEEDBACK_STORAGE_KEY = 'konvert_user_feedback';
const MAX_STORED_FEEDBACK = 50;

export const RATING_LABELS = ['Needs Work', 'Below Average', 'Average', 'Good', 'Excellent'] as const;

export const CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  bug: 'Bug Report',
  feature: 'Feature Request',
  ui: 'UI & UX',
  perf: 'Performance',
  general: 'General'
};

/**
 * Capture non-sensitive client environment metrics for bug diagnosis
 */
export const getDiagnostics = (): DiagnosticsData => {
  return {
    os: typeof navigator !== 'undefined' ? (navigator.platform || 'Unknown OS') : 'Unknown',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    screen: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '',
    pathname: typeof window !== 'undefined' ? window.location.pathname : '',
    timestamp: new Date().toISOString()
  };
};

/**
 * Format feedback submission into a structured Markdown document
 */
export const formatFeedbackMarkdown = (
  category: FeedbackCategory,
  rating: number,
  title: string,
  description: string,
  email?: string,
  includeDiagnostics = true
): string => {
  const diag = getDiagnostics();
  const catLabel = CATEGORY_LABELS[category] || category;
  const ratingText = RATING_LABELS[Math.max(0, Math.min(4, rating - 1))];

  return `### [Feedback] ${title || 'Konvert Feedback'}

**Category**: ${catLabel}
**Rating**: ${rating}/5 (${ratingText})
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

/**
 * Generate a prefilled GitHub Issue creation URL
 */
export const createGitHubIssueUrl = (
  category: FeedbackCategory,
  rating: number,
  title: string,
  description: string,
  email?: string,
  includeDiagnostics = true
): string => {
  const issueTitle = encodeURIComponent(`[${category.toUpperCase()}] ${title.trim() || 'User Feedback'}`);
  const issueBody = encodeURIComponent(
    formatFeedbackMarkdown(category, rating, title, description, email, includeDiagnostics)
  );
  const labels = category === 'bug' ? 'bug' : category === 'feature' ? 'enhancement' : 'feedback';

  return `${GITHUB_NEW_ISSUE_URL}?title=${issueTitle}&body=${issueBody}&labels=${labels}`;
};

/**
 * Save user feedback record into localStorage
 */
export const saveFeedbackToStorage = (
  category: FeedbackCategory,
  rating: number,
  title: string,
  description: string,
  email?: string,
  includeDiagnostics = true
): FeedbackRecord => {
  const feedbackRecord: FeedbackRecord = {
    id: Math.random().toString(36).substring(2, 9),
    category,
    rating,
    title: title.trim(),
    description: description.trim(),
    email: email?.trim(),
    diagnostics: includeDiagnostics ? getDiagnostics() : null,
    date: new Date().toISOString()
  };

  try {
    const existing: FeedbackRecord[] = JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY) || '[]');
    existing.unshift(feedbackRecord);
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(existing.slice(0, MAX_STORED_FEEDBACK)));
  } catch (err) {
    console.warn('Failed to save feedback to localStorage:', err);
  }

  return feedbackRecord;
};
