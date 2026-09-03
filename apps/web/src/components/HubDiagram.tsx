import React from 'react';
import { AbstractDLogo } from './Logo';

export const HubDiagram: React.FC = () => {
  return (
    <section id="diagram" style={{ padding: '100px 0', background: 'transparent' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <span className="badge-pill-cliento">Before → After</span>
        </div>
        <h2 className="font-serif" style={headlineStyle}>
          Stop re-watching.<br />Start doing.
        </h2>
        <p style={subtitleStyle}>
          Clear insights, zero wasted time, and every video summary organized in one space without clutter.
        </p>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '20px',
          marginTop: '40px'
        }}>
          {/* Left Side (Mess) */}
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ ...scatteredTagStyle, marginLeft: '40px' }}>Wasted time watching</div>
            <div style={{ ...scatteredTagStyle, marginLeft: '10px' }}>Confusing instructions</div>
            <div style={{ ...scatteredTagStyle, marginLeft: '30px' }}>Messy phone screenshots</div>
            <div style={{ ...scatteredTagStyle, marginLeft: '0px' }}>Skipping around to find it</div>
            <div style={{ ...scatteredTagStyle, marginLeft: '20px' }}>Forgetting the main point</div>
          </div>
          
          {/* Funnel middle */}
          <div style={{ 
            flex: '0.6', 
            height: '140px', 
            background: 'linear-gradient(to right, rgba(226, 232, 240, 0.4), rgba(255, 91, 34, 0.15))',
            clipPath: 'polygon(0 0, 100% 35%, 100% 65%, 0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '15px'
          }}>
            <div style={{ background: '#fff', borderRadius: '50%', padding: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <AbstractDLogo size={40} showText={false} color="#FF5B22" />
            </div>
          </div>

          {/* Right Side (Clean Bento Card) */}
          <div style={{ 
            flex: '1', 
            background: '#fff', 
            border: '1px solid #E2E8F0', 
            borderRadius: '20px', 
            padding: '40px 30px', 
            boxShadow: '0 12px 30px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent-orange)', marginBottom: '4px', textAlign: 'left', letterSpacing: '1px' }}>
              THE MAGIC
            </div>
            <div style={cleanListStyle}><span style={orangeDotStyle} /><span>Quick 15-second reads</span></div>
            <div style={cleanListStyle}><span style={orangeDotStyle} /><span>Clear, easy checklists</span></div>
            <div style={cleanListStyle}><span style={orangeDotStyle} /><span>Everything in one place</span></div>
            <div style={cleanListStyle}><span style={orangeDotStyle} /><span>Find what you need instantly</span></div>
            <div style={cleanListStyle}><span style={orangeDotStyle} /><span>Ready-to-use takeaways</span></div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Extracted shared styles
const headlineStyle: React.CSSProperties = {
  fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
  fontWeight: 800,
  color: 'var(--text-primary)',
  lineHeight: 1.1,
  letterSpacing: '-1px',
  maxWidth: '820px',
  margin: '0 auto 16px auto',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '16px',
  color: 'var(--text-secondary)',
  maxWidth: '620px',
  margin: '0 auto 20px auto',
  lineHeight: 1.5,
};

const scatteredTagStyle: React.CSSProperties = {
  background: '#F1F5F9',
  color: '#64748B',
  fontSize: '13px',
  fontWeight: 600,
  padding: '8px 18px',
  borderRadius: '999px',
  border: '1px solid #E2E8F0',
  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
  whiteSpace: 'nowrap'
};

const cleanListStyle: React.CSSProperties = {
  color: '#0F172A',
  fontSize: '14px',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '8px 0'
};

const orangeDotStyle: React.CSSProperties = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  background: '#FF5B22',
  flexShrink: 0
};
