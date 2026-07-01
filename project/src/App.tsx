import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FluidBackground } from './components/FluidBackground';
import { Home } from './pages/Home';
import { Roadmap } from './pages/Roadmap';
import { SelfHosting } from './pages/SelfHosting';
import { FAQ } from './pages/FAQ';
import { Community } from './pages/Community';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Dashboard } from './pages/Dashboard';
import { Studio } from './pages/Studio';

const App: React.FC = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('Service Worker registered successfully!', reg.scope))
          .catch(err => console.error('Service Worker registration failed:', err));
      });
    }
  }, []);

  return (
    <Router>
      <div className="app-shell relative overflow-hidden" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Animated dynamic blobs background */}
        <FluidBackground />
        
        <Navbar />
        
        {/* Main layout container with relative z-index to show above background blobs */}
        <main className="relative" style={{ flex: 1, zIndex: 10 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/self-hosting" element={<SelfHosting />} />
            <Route path="/community" element={<Community />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
};

export default App;
