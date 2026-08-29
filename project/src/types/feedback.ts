export type FeedbackCategory = 'bug' | 'feature' | 'ui' | 'perf' | 'general';

export interface DiagnosticsData {
  os: string;
  userAgent: string;
  screen: string;
  pathname: string;
  timestamp: string;
}

export interface FeedbackRecord {
  id: string;
  category: FeedbackCategory;
  rating: number;
  title: string;
  description: string;
  email?: string;
  diagnostics?: DiagnosticsData | null;
  date: string;
}
