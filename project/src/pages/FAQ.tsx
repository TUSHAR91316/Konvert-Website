import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Users, Server, Search } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
  category: 'general' | 'privacy' | 'setup' | 'features';
}

export const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqData: FAQItem[] = [
    {
      category: 'general',
      question: 'Is Konvert really free?',
      answer: (
        <>
          <p>Yes, Konvert is <strong>100% free forever</strong> with:</p>
          <ul>
            <li>No ads or pop-ups</li>
            <li>No hidden charges or premium features</li>
            <li>No credit card required</li>
            <li>No data selling or tracking</li>
            <li>Free updates forever</li>
          </ul>
          <p>All core features are available for free, both with and without an account. Use Guest Mode without creating any account.</p>
        </>
      )
    },
    {
      category: 'general',
      question: 'What platforms does Konvert work on?',
      answer: (
        <>
          <p>Konvert is available on:</p>
          <ul>
            <li><strong>Android</strong> - Download from Google Play Store or Amazon Appstore</li>
            <li><strong>Windows</strong> - Download directly from GitHub Releases</li>
          </ul>
          <p>We're working on expanding to more platforms. Check the <Link to="/roadmap" className="faq-link">Roadmap</Link> for upcoming releases.</p>
        </>
      )
    },
    {
      category: 'privacy',
      question: 'Does Konvert upload my files to the cloud?',
      answer: (
        <>
          <p><strong>No, never.</strong> Konvert is designed with privacy-first principles:</p>
          <ul>
            <li><strong>Image conversions</strong> - 100% processed locally on your device</li>
            <li><strong>Document conversions</strong> - You run your own Docker backend. Konvert never sees your files</li>
            <li><strong>No tracking</strong> - We don't track users, their data, or their activities</li>
            <li><strong>Optional scanning</strong> - You can enable VirusTotal scanning for extra security, but it's completely optional</li>
          </ul>
        </>
      )
    },
    {
      category: 'privacy',
      question: 'Is my data secure with Konvert?',
      answer: (
        <>
          <p>Yes. Security and privacy are core to Konvert:</p>
          <ul>
            <li>Image processing happens locally on your device - we never access it</li>
            <li>Document processing uses your own self-hosted backend</li>
            <li>No files are stored on Konvert servers</li>
            <li>No ads, no trackers, no telemetry</li>
            <li>Optional VirusTotal integration for malware scanning</li>
          </ul>
          <p>For more details, see our <Link to="/privacy-policy" className="faq-link">Privacy Policy</Link>.</p>
        </>
      )
    },
    {
      category: 'features',
      question: 'What file formats does Konvert support?',
      answer: (
        <>
          <p><strong>Supported formats:</strong></p>
          <ul>
            <li><strong>Images to PDF:</strong> JPG, PNG, WEBP, HEIC</li>
            <li><strong>Documents to PDF:</strong> DOC, DOCX, TXT, RTF, ODT, HTML</li>
            <li><strong>Office to PDF:</strong> XLS, XLSX, PPT, PPTX</li>
          </ul>
          <p>We're constantly adding more formats. Check the <Link to="/roadmap" className="faq-link">Roadmap</Link> for upcoming support.</p>
        </>
      )
    },
    {
      category: 'features',
      question: 'Can I compress images with Konvert?',
      answer: (
        <>
          <p>Yes! Konvert has a powerful compression studio:</p>
          <ul>
            <li><strong>Quality Mode:</strong> Reduce by percentage (e.g., 80% quality)</li>
            <li><strong>Target Size Mode:</strong> Specify a limit (e.g., "Max 500 KB") and the app auto-optimizes</li>
            <li><strong>Local processing:</strong> All compression happens on your device</li>
          </ul>
          <p>The compression is intelligent and maintains good quality while reducing file size significantly.</p>
        </>
      )
    },
    {
      category: 'setup',
      question: 'How do I set up the self-hosted backend?',
      answer: (
        <>
          <p>Setting up the self-hosted backend is simple:</p>
          <ul>
            <li>Have Docker installed on your computer</li>
            <li>Follow our step-by-step guide in <Link to="/self-hosting" className="faq-link">Self-Hosting 101</Link></li>
            <li>It takes about 5-10 minutes to set up</li>
            <li>Your backend processes DOCX, XLSX, PPTX conversions locally</li>
          </ul>
          <p>The backend uses LibreOffice and runs entirely on your machine - Konvert never sees your files.</p>
        </>
      )
    },
    {
      category: 'setup',
      question: 'Do I need the self-hosted backend?',
      answer: (
        <>
          <p>No, it's optional:</p>
          <ul>
            <li>You can use Konvert for image conversions <strong>without any setup</strong></li>
            <li>If you want to convert documents (DOCX, XLSX, PPTX), you need to set up the backend</li>
            <li>Setting up takes just a few minutes - see our <Link to="/self-hosting" className="faq-link">Self-Hosting 101</Link> guide</li>
            <li>It's free and runs completely on your machine</li>
          </ul>
        </>
      )
    },
    {
      category: 'general',
      question: 'Can I use Konvert without creating an account?',
      answer: (
        <>
          <p>Yes! Konvert supports a <strong>Guest Mode</strong> where you can use the app without an account. You get all the core features with minor limitations. No account needed, no data required.</p>
        </>
      )
    },
    {
      category: 'general',
      question: 'Does Konvert keep a history of my conversions?',
      answer: (
        <>
          <p>Yes, but it's stored locally:</p>
          <ul>
            <li>Conversion history is kept on your device only</li>
            <li>You can view all your past conversion tasks</li>
            <li>No history is ever sent to our servers or the cloud</li>
            <li>You can clear your history anytime</li>
          </ul>
        </>
      )
    },
    {
      category: 'general',
      question: 'How can I request a feature or report a bug?',
      answer: (
        <>
          <p>We'd love your feedback! You can:</p>
          <ul>
            <li>Join our <Link to="/community" className="faq-link">Community Discussions</Link> on GitHub</li>
            <li>Post feature requests in the Feature Requests category</li>
            <li>Report bugs in the Troubleshooting section</li>
            <li>View the <Link to="/roadmap" className="faq-link">Roadmap</Link> to see planned features</li>
          </ul>
          <p>Your feedback helps us improve Konvert!</p>
        </>
      )
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof faq.answer === 'string' && faq.answer.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="page-container" style={{ paddingBottom: '4rem' }}>
      <Link to="/" className="back-link" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft style={{ width: '16px', height: '16px' }} />
        Back to Home
      </Link>

      <section className="page-hero reveal visible" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
          Frequently Asked Questions
        </h1>
        <p className="section-subtitle">Find answers to common questions about Konvert, setup, features, and privacy.</p>
      </section>

      {/* Search Box */}
      <div className="search-box reveal visible" style={{ position: 'relative', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
        <input 
          type="text" 
          id="faq-search" 
          placeholder="Search questions..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem', border: 'var(--glass-border)', background: 'var(--card-bg)', color: 'var(--text-main)', outline: 'none' }}
        />
        <Search style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', width: '20px', height: '20px' }} />
      </div>

      {/* Category Filter */}
      <div className="faq-categories reveal visible" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
        {['all', 'general', 'privacy', 'setup', 'features'].map(cat => (
          <button 
            key={cat}
            className={`category-btn ${activeCategory === cat ? 'active' : ''}`} 
            onClick={() => setActiveCategory(cat)}
            style={{ textTransform: 'capitalize' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <section className="faq-list reveal visible" style={{ maxWidth: '800px', margin: '0 auto 4rem auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq, index) => {
            const isOpen = !!openItems[index];
            return (
              <div key={index} className={`faq-item ${isOpen ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => toggleItem(index)}>
                  <span>{faq.question}</span>
                  <ChevronDown className="faq-icon" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
                </div>
                {isOpen && (
                  <div className="faq-answer" style={{ padding: '1.5rem', borderTop: 'var(--glass-border)', color: 'var(--text-muted)' }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
            No questions match your filter or search.
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="cta-banner reveal visible" style={{ background: 'var(--primary-gradient)', color: 'white', padding: '3rem 2rem', borderRadius: '1.5rem', textAlign: 'center' }}>
        <h3 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.5rem' }}>Still have questions?</h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '2rem' }}>Join our community or check the self-hosting guide for more detailed information.</p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/community" className="btn btn-white" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--emerald-600)' }}>
            <Users style={{ width: '20px', height: '20px' }} />
            Join Community
          </Link>
          <Link to="/self-hosting" className="btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: '2px solid rgba(255, 255, 255, 0.4)', background: 'rgba(255, 255, 255, 0.15)', color: 'white' }}>
            <Server style={{ width: '20px', height: '20px' }} />
            Self-Hosting Guide
          </Link>
        </div>
      </section>
    </main>
  );
};
