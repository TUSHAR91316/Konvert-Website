import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { ConverterWidget } from '../components/ConverterWidget';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const Studio: React.FC = () => {
  useDocumentTitle('Local Conversion Studio — Konvert');

  return (
    <main className="page-container" style={{ paddingBottom: '4rem' }}>
      <Link to="/" className="back-link" style={{ marginBottom: '2rem' }}>
        <ArrowLeft style={{ width: '16px', height: '16px' }} />
        <span>Back to Home</span>
      </Link>

      <section className="page-hero" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
          <span className="badge">
            <ShieldCheck style={{ width: '14px', height: '14px', color: 'var(--emerald-500)' }} />
            <span>100% In-Browser Memory</span>
          </span>
        </div>

        <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}>
          Local <span className="gradient-text">Conversion Studio</span>
        </h1>
        <p className="section-subtitle" style={{ maxWidth: '640px', margin: '0.5rem auto 0 auto' }}>
          Compress images and compile multi-page PDF documents locally inside your browser memory. Your files never leave your machine.
        </p>
      </section>

      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        <ConverterWidget />
      </div>
    </main>
  );
};
