import React from 'react';
import { AbstractDLogo } from './Logo';

export const HubDiagram: React.FC = () => {
  return (
    <section
      id="diagram"
      style={{
        padding: '100px 0',
        background: 'transparent',
      }}
    >
      <div className="container" style={{ textAlign: 'center' }}>
        {/* Top Pill Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <span className="badge-pill-cliento">Before → After</span>
        </div>

        {/* Serif Section Headline */}
        <h2
          className="font-serif"
          style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            letterSpacing: '-1px',
            maxWidth: '820px',
            margin: '0 auto 16px auto',
          }}
        >
          From scattered reels to a <br />
          streamlined knowledge hub
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            maxWidth: '620px',
            margin: '0 auto 60px auto',
            lineHeight: 1.5,
          }}
        >
          Clear insights, zero wasted time, and every video summary organized in one space without clutter.
        </p>

        {/* Visual Diagram Container */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-card)',
            padding: '60px 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            gap: '30px',
            flexWrap: 'wrap',
            position: 'relative',
          }}
        >
          {/* Left Side: Scattered Chaos Cloud */}
          <div
            style={{
              flex: '1',
              minWidth: '260px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'flex-end',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', width: '100%', textAlign: 'right' }}>
              SCATTERED NOISE
            </div>
            <div style={scatteredTagStyle}>10-min long reels</div>
            <div style={{ ...scatteredTagStyle, marginRight: '30px' }}>Fast talking audio</div>
            <div style={{ ...scatteredTagStyle, marginRight: '10px' }}>Unstructured recipes</div>
            <div style={{ ...scatteredTagStyle, marginRight: '40px' }}>Lost bookmark links</div>
            <div style={{ ...scatteredTagStyle, marginRight: '20px' }}>Manual scribbled notes</div>
            <div style={scatteredTagStyle}>Confusing steps</div>
          </div>

          {/* Dotted Connecting Lines */}
          <div
            style={{
              width: '60px',
              height: '2px',
              borderTop: '2px dashed #CBD5E1',
            }}
          />

          {/* Center Hub: Digestible Emblem Only */}
          <div
            style={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF5B22 100%)',
              borderRadius: '24px',
              width: '140px',
              height: '140px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 40px rgba(255, 91, 34, 0.35)',
            }}
          >
            <AbstractDLogo size={54} showText={false} color="#FFFFFF" />
          </div>

          {/* Dotted Connecting Lines */}
          <div
            style={{
              width: '60px',
              height: '2px',
              borderTop: '2px dashed #CBD5E1',
            }}
          />

          {/* Right Side: Streamlined Output */}
          <div
            style={{
              flex: '1',
              minWidth: '280px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'flex-start',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-orange)', marginBottom: '8px' }}>
              STREAMLINED KNOWLEDGE
            </div>

            <div style={orderedPillStyle}>
              <span style={orangeDotStyle} />
              <span>15-second summaries</span>
            </div>

            <div style={orderedPillStyle}>
              <span style={orangeDotStyle} />
              <span>Clean readable transcripts</span>
            </div>

            <div style={orderedPillStyle}>
              <span style={orangeDotStyle} />
              <span>Searchable recipe notes</span>
            </div>

            <div style={orderedPillStyle}>
              <span style={orangeDotStyle} />
              <span>Key video highlights</span>
            </div>

            <div style={orderedPillStyle}>
              <span style={orangeDotStyle} />
              <span>Step-by-step checklists</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const scatteredTagStyle: React.CSSProperties = {
  background: '#F1F5F9',
  color: '#64748B',
  fontSize: '12px',
  fontWeight: 600,
  padding: '6px 14px',
  borderRadius: '999px',
  border: '1px solid #E2E8F0',
};

const orderedPillStyle: React.CSSProperties = {
  background: '#F8FAFC',
  color: '#0F172A',
  fontSize: '13px',
  fontWeight: 600,
  padding: '10px 18px',
  borderRadius: '999px',
  border: '1px solid #E2E8F0',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
};

const orangeDotStyle: React.CSSProperties = {
  width: '7px',
  height: '7px',
  borderRadius: '50%',
  background: '#FF5B22',
};
