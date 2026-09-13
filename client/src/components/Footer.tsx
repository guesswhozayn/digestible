import React from 'react';
import { ArrowRight } from 'lucide-react';
import { AbstractDLogo } from './Logo';

interface FooterProps {
  onNavigateToSummarizer: () => void;
  onNavigateToLegal?: (type: 'terms' | 'privacy' | 'security') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToSummarizer, onNavigateToLegal }) => {
  return (
    <footer
      style={{
        background: '#FFFFFF',
        borderTop: '1px solid var(--border-light)',
        paddingTop: '80px',
        paddingBottom: '40px',
        overflow: 'hidden',
      }}
    >
      <div className="container">

        {/* Top Section: Brand/CTA Left + Semantic Nav Groups Right */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '60px',
            marginBottom: '72px',
          }}
        >

          {/* Left Column: Brand, Mission & Action */}
          <div style={{ maxWidth: '440px' }}>
            <div style={{ marginBottom: '20px' }}>
              <AbstractDLogo size={32} showText={true} />
            </div>

            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(1.9rem, 3.2vw, 2.6rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1.15,
                letterSpacing: '-0.5px',
                marginBottom: '14px',
              }}
            >
              One place for reels, guides, and saved notes without chaos
            </h2>

            <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '28px' }}>
              Turn 60-second vertical reels into 15-second actionable takeaways, recipe cards, and searchable transcripts.
            </p>

            <button onClick={onNavigateToSummarizer} className="btn-expand-hover">
              <span className="btn-text">Try Digestible Now</span>
              <div className="btn-icon-wrapper">
                <div className="btn-icon-bg"></div>
                <ArrowRight strokeWidth={2} />
              </div>
            </button>
          </div>

          {/* Right Column: Streamlined Categorized Navigation Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
              gap: '40px',
              alignContent: 'start',
            }}
          >

            {/* Column 1: Product */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="footer-nav-title">Product</div>
              <button onClick={onNavigateToSummarizer} className="footer-nav-link">Reel Summarizer</button>
              <a href="#features" className="footer-nav-link">Features</a>
              <a href="#how-it-works" className="footer-nav-link">How It Works</a>
              <a href="#diagram" className="footer-nav-link">Knowledge Hub</a>
            </div>

            {/* Column 2: Resources & Pricing */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="footer-nav-title">Resources</div>
              <a href="#pricing" className="footer-nav-link">Pricing</a>
              <a href="#faq" className="footer-nav-link">FAQ</a>
              <button onClick={() => onNavigateToLegal?.('terms')} className="footer-nav-link">Terms of Service</button>
              <button onClick={() => onNavigateToLegal?.('privacy')} className="footer-nav-link">Privacy Policy</button>
            </div>

          </div>
        </div>

        {/* Centerpiece Wordmark Banner */}
        <div
          style={{
            position: 'relative',
            borderRadius: '24px',
            height: '240px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
            background: 'linear-gradient(180deg, #1C2434 0%, #0B0F17 100%)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          }}
        >

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 120%, rgba(255, 91, 34, 0.35) 0%, transparent 60%)',
            }}
          />

          <h1
            className="font-serif"
            style={{
              fontSize: 'clamp(4.5rem, 15vw, 14rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1,
              letterSpacing: '-6px',
              margin: 0,
              position: 'relative',
              zIndex: 2,
              userSelect: 'none',
              textShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}
          >
            Digestible
          </h1>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13px',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '16px',
            paddingTop: '8px',
          }}
        >
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <button
              onClick={() => onNavigateToLegal?.('terms')}
              className="footer-legal-link"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              Terms of service
            </button>
            <span style={{ color: '#E2E8F0' }}>•</span>
            <button
              onClick={() => onNavigateToLegal?.('privacy')}
              className="footer-legal-link"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              Privacy policy
            </button>
            <span style={{ color: '#E2E8F0' }}>•</span>
            <button
              onClick={() => onNavigateToLegal?.('security')}
              className="footer-legal-link"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              Security
            </button>
          </div>

          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '13px', color: '#94A3B8' }}>
            © {new Date().getFullYear()} Digestible Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
