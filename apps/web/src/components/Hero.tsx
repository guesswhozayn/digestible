import React from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

const integrationBrands = [
  { name: 'Instagram Reels', src: '/reels.svg', typographyText: 'Reels', font: '"Montserrat", sans-serif' },
  { name: 'YouTube Shorts', src: '/shorts.svg', typographyText: 'Shorts', font: '"Oswald", sans-serif' },
  { name: 'TikTok', src: '/tiktok.svg' },
];

interface HeroProps {
  onNavigateToSummarizer: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigateToSummarizer }) => {
  return (
    <section
      style={{
        paddingTop: '160px',
        paddingBottom: '80px',
        background: 'transparent',
        position: 'relative',
        textAlign: 'center',
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Display Serif Headline */}
        <h1
          className="font-serif"
          style={{
            fontSize: 'clamp(2.8rem, 6.5vw, 5.2rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1.05,
            letterSpacing: '-1.5px',
            maxWidth: '900px',
            margin: '0 auto 20px auto',
          }}
        >
          One portal for every <br />
          reel & saved video note
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 36px auto',
            lineHeight: 1.5,
            fontWeight: 400,
          }}
        >
          Replaces scattered saved videos, long audio clips, and forgotten links with one clean space for quick recipes, guides, and takeaways.
        </p>

        {/* Primary Action Capsule Button (Replaces Get early access) */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <button onClick={onNavigateToSummarizer} className="btn-expand-hover">
            <span className="btn-text">Try Digestible Now</span>
            <div className="btn-icon-wrapper">
              <div className="btn-icon-bg"></div>
              <ArrowRight strokeWidth={2} />
            </div>
          </button>
        </div>

        {/* Feature Tag Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            marginBottom: '70px',
          }}
        >
          <div style={featureTagStyle}>
            <span style={orangeDotStyle} />
            <span>Saved Reels</span>
          </div>

          <div style={featureTagStyle}>
            <span style={orangeDotStyle} />
            <span>Step-by-Step Guides</span>
          </div>

          <div style={featureTagStyle}>
            <span style={orangeDotStyle} />
            <span>Key Takeaways</span>
          </div>

          <div style={featureTagStyle}>
            <span style={orangeDotStyle} />
            <span>Action Checklists</span>
          </div>
        </div>

      </div>

      {/* Integration Bar */}
      <div className="integration-marquee-wrapper">
        <div className="integration-marquee-content">
          {Array.from({ length: 6 }).flatMap(() => integrationBrands).map((brand, i) => (
            <div key={i} className="integration-brand-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src={brand.src} alt={brand.name} style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
              {brand.typographyText && (
                <span style={{ fontFamily: brand.font || 'inherit', fontSize: '22px', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
                  {brand.typographyText}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const featureTagStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--text-primary)',
};

const orangeDotStyle: React.CSSProperties = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  background: '#FF5B22',
};


