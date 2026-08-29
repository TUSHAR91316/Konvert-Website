import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Users, Search, MessageSquare, X } from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
  category: 'general' | 'privacy' | 'setup' | 'features';
}

const CATEGORIES = [
  { id: 'all', label: 'All Topics' },
  { id: 'general', label: 'General' },
  { id: 'privacy', label: 'Privacy & Security' },
  { id: 'setup', label: 'Docker & Setup' },
  { id: 'features', label: 'Features & Formats' },
] as const;

const FAQ_DATA: FAQItem[] = [
  {
    category: 'general',
    question: 'Is Konvert really free?',
    answer: (
      <>
        <p style={{ marginBottom: '0.5rem' }}>Yes, Konvert is <strong>100% free and open-source forever</strong> with:</p>
        <ul style={{ paddingLeft: '1.25rem', display: 'grid', gap: '0.3rem' }}>
          <li>Zero advertisements or intrusive tracking cookies</li>
          <li>No hidden charges, paywalls, or premium tiers</li>
          <li>No account or credit card registration required</li>
          <li>Free software updates distributed through GitHub</li>
        </ul>
      </>
    )
  },
  {
    category: 'general',
    question: 'What platforms does Konvert currently support?',
    answer: (
      <>
        <p style={{ marginBottom: '0.5rem' }}>Konvert is available on:</p>
        <ul style={{ paddingLeft: '1.25rem', display: 'grid', gap: '0.3rem' }}>
          <li><strong>Android:</strong> Download universal APK from GitHub Releases or app stores.</li>
          <li><strong>Windows:</strong> Native standalone desktop installer for Windows 10/11.</li>
          <li><strong>Web:</strong> In-browser Client Studio for lightweight image compression and PDF compilation.</li>
        </ul>
      </>
    )
  },
  {
    category: 'privacy',
    question: 'Does Konvert upload user documents to a cloud database?',
    answer: (
      <>
        <p style={{ marginBottom: '0.5rem' }}><strong>No, never.</strong> Konvert operates on strict local-first principles:</p>
        <ul style={{ paddingLeft: '1.25rem', display: 'grid', gap: '0.3rem' }}>
          <li><strong>Images:</strong> 100% processed on-device in local RAM.</li>
          <li><strong>Documents:</strong> Processed through your private self-hosted Docker container.</li>
          <li><strong>No telemetry:</strong> We do not log conversions, filenames, or user identifiers.</li>
        </ul>
      </>
    )
  },
  {
    category: 'setup',
    question: 'Why do document conversions require Docker self-hosting?',
    answer: (
      <p style={{ lineHeight: 1.6 }}>
        Converting intricate formats (like DOCX, PPTX, or ODT to PDF) requires a headless rendering engine (LibreOffice). Rather than routing your private files through our cloud servers, Konvert lets you run the microservice yourself inside an isolated Docker container, maintaining 100% file privacy.
      </p>
    )
  },
  {
    category: 'features',
    question: 'What formats can be converted offline?',
    answer: (
      <>
        <p style={{ marginBottom: '0.5rem' }}>The on-device engine directly supports:</p>
        <ul style={{ paddingLeft: '1.25rem', display: 'grid', gap: '0.3rem' }}>
          <li><strong>Image conversions &amp; compression:</strong> PNG, JPG, JPEG, WEBP, HEIC.</li>
          <li><strong>PDF document compilation:</strong> Multi-image albums converted into standardized A4 PDF pages.</li>
          <li><strong>Document formats via Docker:</strong> DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, ODT.</li>
        </ul>
      </>
    )
  },
  {
    category: 'privacy',
    question: 'How does the VirusTotal integration work?',
    answer: (
      <p style={{ lineHeight: 1.6 }}>
        VirusTotal scanning is completely optional. If enabled in Settings, the app computes a SHA-256 cryptographic hash of your file locally and checks if known antivirus vendors have flagged that hash. Your actual document content is never transmitted to the scan API.
      </p>
    )
  }
];

export const FAQ: React.FC = () => {
  useDocumentTitle('FAQ — Konvert');

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({ 0: true });

  const toggleItem = (index: number) => {
    setOpenItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const filteredFAQs = FAQ_DATA.filter(faq => {
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="page-container" style={{ paddingBottom: '4rem' }}>
      <Link to="/" className="back-link" style={{ marginBottom: '2rem' }}>
        <ArrowLeft style={{ width: '16px', height: '16px' }} />
        <span>Back to Home</span>
      </Link>

      <section className="page-hero" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}>
          Frequently Asked <span className="gradient-text">Questions</span>
        </h1>
        <p className="section-subtitle">Find direct answers regarding architecture, security, setup, and format support.</p>
      </section>

      {/* Search Box */}
      <div style={{ position: 'relative', maxWidth: '580px', margin: '0 auto 1.5rem auto' }}>
        <input 
          type="text" 
          id="faq-search" 
          placeholder="Search topics (e.g. Docker, Privacy, Formats)..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
          style={{ paddingLeft: '2.5rem', paddingRight: '2rem', height: '46px' }}
        />
        <Search style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', width: '16px', height: '16px' }} />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            aria-label="Clear search"
          >
            <X style={{ width: '15px', height: '15px' }} />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {CATEGORIES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={`category-pill-btn${activeCategory === id ? ' active' : ''}`}
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.825rem' }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Accordion FAQ List */}
      <section style={{ maxWidth: '780px', margin: '0 auto 3.5rem auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq, index) => {
            const isOpen = !!openItems[index];
            return (
              <div key={faq.question} className="solid-card" style={{ overflow: 'hidden' }}>
                <div 
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  onClick={() => toggleItem(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleItem(index);
                    }
                  }}
                  style={{
                    padding: '1.15rem 1.25rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 600,
                    fontSize: '0.975rem',
                    color: 'var(--text-main)',
                    userSelect: 'none'
                  }}
                >
                  <span>{faq.question}</span>
                  <ChevronDown style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: 'var(--text-muted)', flexShrink: 0, width: '18px', height: '18px' }} />
                </div>
                {isOpen && (
                  <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
            No matching questions found for &ldquo;{searchTerm}&rdquo;.
          </div>
        )}
      </section>

      {/* Still Have Questions Banner */}
      <section className="solid-card" style={{ padding: '2.25rem', textAlign: 'center', maxWidth: '780px', margin: '0 auto', background: 'var(--bg-secondary)' }}>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>Still have a specific question?</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
          Feel free to reach out to our team or post in our open discussion forum on GitHub.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/feedback" className="btn btn-primary">
            <MessageSquare style={{ width: '15px', height: '15px' }} />
            <span>Send Feedback / Question</span>
          </Link>
          <Link to="/community" className="btn btn-secondary-solid">
            <Users style={{ width: '15px', height: '15px' }} />
            <span>Community Forum</span>
          </Link>
        </div>
      </section>
    </main>
  );
};
