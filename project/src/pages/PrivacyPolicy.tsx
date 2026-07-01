import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="page-container" style={{ paddingBottom: '4rem' }}>
      <Link to="/" className="back-link" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft style={{ width: '16px', height: '16px' }} />
        Back to Home
      </Link>

      <div className="content-box reveal visible">
        <div className="privacy-header">
          <h1 className="privacy-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield className="text-emerald" style={{ width: '32px', height: '32px' }} />
            Privacy Policy
          </h1>
          <p className="privacy-last-updated">Last Updated: April 5, 2026</p>
        </div>

        <div className="privacy-content">
          <h2>1. Introduction</h2>
          <p>Welcome to Konvert ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a secure experience when using our Advanced File Management & Conversion Tool for Android and Windows. This Privacy Policy outlines how we handle your data.</p>

          <h2>2. Data Collection & Processing</h2>
          <p>Konvert prioritizes your privacy through a completely decentralized, Bring Your Own Backend (BYOB) architecture:</p>
          <ul>
            <li><strong>Local Image/Video Processing (100% Offline):</strong> All your image and video conversions, as well as file compressions, are processed entirely locally on your device. We do not upload these files anywhere.</li>
            <li><strong>Document Conversion (Self-Hosted Backend):</strong> For document formats (e.g., DOCX, PDF, PPTX), processing is handled through your own personal local Docker container or your configured Ngrok tunnel. <strong>We have shut down all developer-hosted cloud APIs.</strong> We never receive, process, or maintain any retention of your documents because they go straight to your own infrastructure.</li>
          </ul>

          <h2>3. Third-Party Services</h2>
          <p>To provide advanced security, Konvert integrates directly with the <strong>VirusTotal API</strong> for malware scanning. When you opt into this feature, a cryptographic hash or sample of your file may be checked against VirusTotal's database to verify its safety. We do not share your raw personal files with advertisers or unapproved external entities.</p>

          <h2>4. Personal Information</h2>
          <p>Konvert is designed as a guest-first platform. We do not require registration, email addresses, or credit card details. We do not track, profile, or sell user personal information.</p>

          <h2>5. Conversion History</h2>
          <p>Any history of your past conversion tasks is logged entirely locally on your device. You maintain full ownership and control over this log and can clear it at any time directly within the app.</p>

          <h2>6. Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy periodically to reflect new features or platform capabilities. Since we do not collect your contact details, we encourage you to review this page occasionally for the latest information on our privacy practices.</p>

          <h2>7. Contact Us</h2>
          <p>If you have any questions or concerns regarding our Privacy Policy or data processing practices, please reach out via our GitHub repository: <a href="https://github.com/TUSHAR91316/Konvert-Website" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--emerald-500)', textDecoration: 'none' }}>Konvert GitHub</a>.</p>
        </div>
      </div>
    </main>
  );
};
