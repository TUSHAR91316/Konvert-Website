import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { ConverterWidget } from '../components/ConverterWidget';

export const Studio: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="page-container" style={{ paddingBottom: '4rem' }}>
      <Link to="/" className="back-link" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft style={{ width: '16px', height: '16px' }} />
        Back to Home
      </Link>

      <section className="page-hero reveal visible" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <Sparkles className="text-emerald" style={{ width: '36px', height: '36px' }} />
          Local Conversion Studio
        </h1>
        <p className="section-subtitle">Process image compressions and document-to-PDF builds entirely inside your browser offline.</p>
      </section>

      <div className="reveal visible" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <ConverterWidget />
      </div>
    </main>
  );
};
