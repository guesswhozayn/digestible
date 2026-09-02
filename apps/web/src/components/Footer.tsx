import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigateToSummarizer: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToSummarizer }) => {
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
        {/* Top Split Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '60px',
            marginBottom: '80px',
          }}
        >
          {/* Left CTA Column */}
          <div>
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1.1,
                letterSpacing: '-1px',
                marginBottom: '16px',
              }}
            >
              One place for reels, guides, and saved notes without chaos
            </h2>

            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
              Start digesting video reels instantly with our AI summarizer
            </p>

            <button onClick={onNavigateToSummarizer} className="btn-cliento">
              <span>Try Digestible Now</span>
              <div className="arrow-square">
                <ArrowUpRight size={18} />
              </div>
            </button>
          </div>

          {/* Right 3-Column Navigation Directory */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '32px',
            }}
          >
            {/* Nav Column 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <button onClick={onNavigateToSummarizer} style={footerButtonStyle}>Reel Summarizer</button>
              <a href="#diagram" style={footerLinkStyle}>Smart updates</a>
              <a href="#features" style={footerLinkStyle}>Knowledge hub</a>
              <a href="#mobile-app" style={footerLinkStyle}>Mobile access</a>
            </div>

            {/* Nav Column 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <a href="#features" style={footerLinkStyle}>Integrations</a>
              <a href="#pricing" style={footerLinkStyle}>Pricing</a>
              <a href="#how-it-works" style={footerLinkStyle}>FAQ</a>
              <button onClick={onNavigateToSummarizer} style={footerButtonStyle}>Try Free Demo</button>
            </div>

            {/* Nav Column 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <a href="#" style={footerLinkStyle}>Blog</a>
              <a href="#" style={footerLinkStyle}>Careers</a>
            </div>
          </div>
        </div>

        {/* Giant Landscape Display Banner */}
        <div
          style={{
            position: 'relative',
            borderRadius: '24px',
            height: '260px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
            background: 'linear-gradient(180deg, #1C2434 0%, #0B0F17 100%)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          }}
        >
          {/* Background Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 120%, rgba(255, 91, 34, 0.35) 0%, transparent 60%)',
            }}
          />

          {/* Giant Display Brand Title */}
          <h1
            className="font-serif"
            style={{
              fontSize: 'clamp(5rem, 16vw, 15rem)',
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

        {/* Bottom Sub-Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13px',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              Terms of service
            </a>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              Privacy policy
            </a>
          </div>

          <div>© {new Date().getFullYear()} Digestible Inc. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};

const footerLinkStyle: React.CSSProperties = {
  color: 'var(--text-primary)',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: 600,
  transition: 'color 0.2s ease',
};

const footerButtonStyle: React.CSSProperties = {
  ...footerLinkStyle,
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  textAlign: 'left',
};
