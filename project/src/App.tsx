import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { ToastProvider } from './context/ToastContext';
import { FeedbackModal } from './components/FeedbackModal';
import { MessageSquare } from 'lucide-react';

// Lazy-load pages for clean chunk splitting
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Studio = lazy(() => import('./pages/Studio').then(m => ({ default: m.Studio })));
const Roadmap = lazy(() => import('./pages/Roadmap').then(m => ({ default: m.Roadmap })));
const SelfHosting = lazy(() => import('./pages/SelfHosting').then(m => ({ default: m.SelfHosting })));
const Community = lazy(() => import('./pages/Community').then(m => ({ default: m.Community })));
const FAQ = lazy(() => import('./pages/FAQ').then(m => ({ default: m.FAQ })));
const Feedback = lazy(() => import('./pages/Feedback').then(m => ({ default: m.Feedback })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));

const PageLoader: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <div className="spinner" />
  </div>
);

let swRegistered = false;

const AppContent: React.FC = () => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && !swRegistered) {
      swRegistered = true;
      window.addEventListener(
        'load',
        () => {
          navigator.serviceWorker
            .register('/sw.js')
            .then(reg => console.log('SW registered:', reg.scope))
            .catch(err => console.warn('SW registration failed:', err));
        },
        { once: true }
      );
    }
  }, []);

  return (
    <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onOpenFeedback={() => setFeedbackOpen(true)} />

      <main style={{ flex: 1 }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/self-hosting" element={<SelfHosting />} />
            <Route path="/community" element={<Community />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
        </Suspense>
      </main>

      <Footer onOpenFeedback={() => setFeedbackOpen(true)} />

      {/* Floating Solid Feedback Trigger */}
      <button
        onClick={() => setFeedbackOpen(true)}
        className="floating-feedback-btn"
        aria-label="Send Feedback"
        title="Share Feedback or Report Bug"
      >
        <MessageSquare style={{ width: '16px', height: '16px', color: 'var(--emerald-500)' }} />
        <span>Feedback</span>
      </button>

      {/* Global Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </ToastProvider>
  );
};

export default App;
