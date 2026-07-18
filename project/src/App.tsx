import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FluidBackground } from './components/FluidBackground';
import { ScrollToTop } from './components/ScrollToTop';

// Lazy-load pages so each route only downloads its chunk when visited
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Studio = lazy(() => import('./pages/Studio').then(m => ({ default: m.Studio })));
const Roadmap = lazy(() => import('./pages/Roadmap').then(m => ({ default: m.Roadmap })));
const SelfHosting = lazy(() => import('./pages/SelfHosting').then(m => ({ default: m.SelfHosting })));
const Community = lazy(() => import('./pages/Community').then(m => ({ default: m.Community })));
const FAQ = lazy(() => import('./pages/FAQ').then(m => ({ default: m.FAQ })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));

const PageLoader: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <div className="spinner" />
  </div>
);

// Track if service worker registration was already attempted this session
let swRegistered = false;

const App: React.FC = () => {
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
    <Router>
      <ScrollToTop />
      <div className="app-shell relative overflow-hidden" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Animated dynamic blobs background */}
        <FluidBackground />

        <Navbar />

        {/* Main layout container — above background blobs */}
        <main className="relative" style={{ flex: 1, zIndex: 10 }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/self-hosting" element={<SelfHosting />} />
              <Route path="/community" element={<Community />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
