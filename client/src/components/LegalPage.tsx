import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { AbstractDLogo } from './Logo';

interface LegalPageProps {
  onBackToHome: () => void;
  type: 'terms' | 'privacy' | 'security';
}

export const LegalPage: React.FC<LegalPageProps> = ({ onBackToHome, type }) => {
  const content = {
    terms: {
      title: 'Terms of Service',
      lastUpdated: 'September 2026',
      sections: [
        {
          heading: '1. Acceptance of Terms',
          body: 'By accessing or using Digestible ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.',
        },
        {
          heading: '2. Description of Service',
          body: 'Digestible provides AI-assisted content extraction and summarization for publicly accessible short-form video URLs (e.g. Instagram Reels, YouTube Shorts, TikTok). You acknowledge that generated summaries are derived through artificial intelligence and should be verified for critical applications.',
        },
        {
          heading: '3. Intellectual Property & Fair Use',
          body: 'Digestible does not claim ownership over videos summarized through the service. Users are responsible for ensuring that their use of summarized content complies with applicable copyright laws, platform terms, and fair use guidelines.',
        },
        {
          heading: '4. User Conduct & Abuse Prevention',
          body: 'You agree not to misuse the Service, reverse engineer extraction algorithms, or bypass rate limits. Any automated scraping or abuse of backend endpoints will result in immediate suspension.',
        },
        {
          heading: '5. Limitation of Liability',
          body: 'In no event shall Digestible or its creators be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the summaries provided.',
        },
      ],
    },
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'September 2026',
      sections: [
        {
          heading: '1. Information We Collect',
          body: 'We collect the video URLs you submit for summarization, optional prompt directives, and standard browser technical metadata (such as IP address and device headers) required to process requests and deliver summaries.',
        },
        {
          heading: '2. How We Use Video Data',
          body: 'Submitted reel URLs are processed temporarily to extract video streams, audio transcripts, and OCR text. We do not sell your personal data or video submissions to third parties.',
        },
        {
          heading: '3. AI Processing & Third-Party Providers',
          body: 'Transcribed audio and video notes may be processed via secure multimodal AI inference providers (such as OpenRouter or Google Cloud). Requests are transmitted over encrypted TLS connections.',
        },
        {
          heading: '4. Storage & Retention',
          body: 'Summaries are cached temporarily to provide fast retrieval. You may clear your session or request deletion of stored summaries at any time.',
        },
        {
          heading: '5. Contact Us',
          body: 'If you have any questions regarding your data or this policy, please reach out to privacy@digestible.app.',
        },
      ],
    },
    security: {
      title: 'Security & Compliance',
      lastUpdated: 'September 2026',
      sections: [
        {
          heading: '1. Encryption Standards',
          body: 'All data transmitted between your browser, our servers, and background processing workers is secured using industry-standard TLS 1.3 encryption in transit.',
        },
        {
          heading: '2. Zero Permanent Video Storage',
          body: 'Digestible processes media streams ephemerally. Source video files are purged immediately following transcription and analysis, minimizing data footprint.',
        },
        {
          heading: '3. Infrastructure Security',
          body: 'Our application runs in isolated containerized environments with strict firewall rules, automated rate limiting, and continuous vulnerability monitoring.',
        },
        {
          heading: '4. Responsible Disclosure',
          body: 'We take security vulnerabilities seriously. If you discover a security issue, please contact security@digestible.app. We respond to verified reports within 48 hours.',
        },
      ],
    },
  }[type];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-main)',
        color: 'var(--text-primary)',
        paddingBottom: '100px',
        position: 'relative',
      }}
    >
      {/* Floating Back Button */}
      <button
        onClick={onBackToHome}
        aria-label="Back to home"
        title="Back to home"
        style={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: '#FFFFFF',
          border: '1px solid var(--border-light)',
          color: '#0F172A',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.08)';
        }}
      >
        <ArrowLeft size={20} strokeWidth={2.2} />
      </button>

      <main className="container" style={{ maxWidth: '780px', paddingTop: '100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '11.5px',
              fontWeight: 700,
              color: 'var(--accent-orange)',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '14px',
            }}
          >
            Legal & Compliance
          </span>
          <h1
            className="font-serif"
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 800,
              color: '#0F172A',
              lineHeight: 1.1,
              margin: '0 0 10px 0',
            }}
          >
            {content.title}
          </h1>
          <p style={{ fontSize: '13.5px', color: '#94A3B8', margin: 0 }}>
            Last updated: {content.lastUpdated}
          </p>
        </div>

        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-card)',
            padding: '44px',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}
        >
          {content.sections.map((section, idx) => (
            <div key={idx}>
              <h2
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '17px',
                  fontWeight: 700,
                  color: '#0F172A',
                  marginBottom: '10px',
                }}
              >
                {section.heading}
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14.5px',
                  lineHeight: 1.75,
                  color: '#475569',
                  fontWeight: 300,
                  margin: 0,
                }}
              >
                {section.body}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '50px', textAlign: 'center' }}>
          <div
            onClick={onBackToHome}
            style={{
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <AbstractDLogo size={30} showText={true} />
          </div>
        </div>
      </main>
    </div>
  );
};
