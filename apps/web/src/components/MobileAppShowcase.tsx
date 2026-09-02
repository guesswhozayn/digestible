import React from 'react';
import { AbstractDLogo } from './Logo';

export const MobileAppShowcase: React.FC = () => {
  return (
    <section
      id="mobile-app"
      style={{
        padding: '100px 0',
        background: 'transparent',
      }}
    >
      <div className="container" style={{ textAlign: 'center' }}>
        {/* Serif Section Headline */}
        <h2
          className="font-serif"
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            letterSpacing: '-1.5px',
            margin: '0 0 16px 0',
          }}
        >
          ...in your pocket
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            maxWidth: '640px',
            margin: '0 auto 60px auto',
            lineHeight: 1.5,
          }}
        >
          Turn long video reels into 15-second summaries on the go with a mobile experience built for clarity and speed.
        </p>

        {/* Backdrop Card with Upright iPhone & Floating Pills */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(255, 91, 34, 0.06) 0%, rgba(255, 91, 34, 0.2) 100%)',
            borderRadius: '36px',
            padding: '60px 20px 0 20px',
            position: 'relative',
            maxWidth: '920px',
            margin: '0 auto',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {/* Floating Pill Top Left */}
          <div style={{ ...floatingBadgeStyle, top: '80px', left: '40px' }} className="floating-pill-hide">
            <span>Next actions</span>
          </div>

          {/* Floating Pill Bottom Left */}
          <div style={{ ...floatingBadgeStyle, bottom: '140px', left: '20px' }} className="floating-pill-hide">
            <span>Reel summaries</span>
          </div>

          {/* Floating Pill Top Right */}
          <div style={{ ...floatingBadgeStyle, top: '100px', right: '40px' }} className="floating-pill-hide">
            <span>Progress summaries</span>
          </div>

          {/* Floating Pill Bottom Right */}
          <div style={{ ...floatingBadgeStyle, bottom: '120px', right: '30px' }} className="floating-pill-hide">
            <span>Zero wasted time</span>
          </div>

          {/* Upright iPhone 16 Pro Mockup Device */}
          <div
            style={{
              width: '280px',
              height: '520px',
              background: '#0B0F17',
              borderRadius: '44px 44px 0 0',
              border: '7px solid #1E293B',
              borderBottom: 'none',
              boxShadow: '0 30px 70px rgba(0, 0, 0, 0.25)',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              textAlign: 'left',
              zIndex: 10,
            }}
          >
            {/* Dynamic Island Notch */}
            <div
              style={{
                width: '84px',
                height: '20px',
                background: '#000000',
                borderRadius: '20px',
                margin: '-12px auto 12px auto',
              }}
            />

            {/* Screen App UI */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <AbstractDLogo size={16} textColor="#FFFFFF" />
                <span style={{ fontSize: '9px', color: '#94A3B8', fontWeight: 600 }}>9:41 AM</span>
              </div>

              {/* Monthly Stats Chart Widget Inside Mobile UI */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ fontSize: '9px', color: '#94A3B8', fontWeight: 600 }}>Monthly Saved Notes</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '2px 0 10px 0' }}>
                  148 Summaries
                </div>

                {/* Orange Bar Chart Bars */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '60px' }}>
                  <div style={{ flex: 1, height: '70%', background: 'var(--accent-orange)', borderRadius: '6px' }} />
                  <div style={{ flex: 1, height: '55%', background: 'var(--accent-orange)', borderRadius: '6px' }} />
                  <div style={{ flex: 1, height: '40%', background: 'var(--accent-orange)', borderRadius: '6px' }} />
                  <div style={{ flex: 1, height: '90%', background: 'var(--accent-orange)', borderRadius: '6px' }} />
                </div>
              </div>

              {/* Recent Updates List */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#FFFFFF' }}>Recent Reels</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9.5px', color: '#CBD5E1' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#FF5B22' }} />
                  <span style={{ flex: 1 }}>High-Protein Salmon</span>
                  <span style={{ color: '#94A3B8' }}>2h ago</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9.5px', color: '#CBD5E1' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#34D399' }} />
                  <span style={{ flex: 1 }}>VS Code Shortcuts</span>
                  <span style={{ color: '#94A3B8' }}>5h ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .floating-pill-hide { display: none !important; }
        }
      `}</style>
    </section>
  );
};

const floatingBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  background: '#FFFFFF',
  borderRadius: '999px',
  padding: '8px 18px',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
  border: '1px solid var(--border-light)',
  fontSize: '13px',
  fontWeight: 600,
  color: '#0F172A',
  zIndex: 15,
};
