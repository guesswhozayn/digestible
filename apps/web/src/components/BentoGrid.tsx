import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

export const BentoGrid: React.FC = () => {
  return (
    <section
      id="features"
      style={{
        padding: '100px 0',
        background: '#121316',
        color: '#FFFFFF',
      }}
    >
      <div className="container" style={{ textAlign: 'center' }}>
        {/* Top Centered Pill Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <span style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#CBD5E1', padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 600 }}>
            Built for clarity
          </span>
        </div>

        {/* Serif Headline */}
        <h2
          className="font-serif"
          style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.1,
            letterSpacing: '-1px',
            maxWidth: '860px',
            margin: '0 auto 16px auto',
          }}
        >
          The way video learning <br />
          should have worked from the start
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '16px',
            color: '#94A3B8',
            maxWidth: '620px',
            margin: '0 auto 60px auto',
            lineHeight: 1.5,
          }}
        >
          A simple workflow where you always know what to watch, what to learn, and what to keep.
        </p>

        {/* Top 3-Column Bento Feature Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '40px',
            textAlign: 'left',
          }}
        >
          {/* Bento Card 1 */}
          <div style={bentoCardStyle}>
            <div style={floaterBoxStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FF5B22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 700 }}>
                  AI
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Digestible Workspace</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Personal Video Library</div>
                </div>
              </div>

              <div style={listItemStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={orangeDotStyle} />
                  <span>Reel digests</span>
                </div>
                <div style={arrowCircleStyle}><ArrowRight size={12} color="#FFF" /></div>
              </div>

              <div style={listItemStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={orangeDotStyle} />
                  <span>Saved transcripts</span>
                </div>
                <div style={arrowCircleStyle}><ArrowRight size={12} color="#FFF" /></div>
              </div>
            </div>

            <h3 className="font-serif" style={cardTitleStyle}>Create your video knowledge base</h3>
            <p style={cardDescStyle}>Organize all your processed reels, recipe steps, and workout guides in one clean workspace.</p>
          </div>

          {/* Bento Card 2 */}
          <div style={bentoCardStyle}>
            <div style={{ ...floaterBoxStyle, position: 'relative' }}>
              <div style={timelineRowStyle}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} />
                <span style={{ flex: 1 }}>Full transcript extracted</span>
                <span style={{ fontSize: '10px', color: '#94A3B8' }}>2m ago</span>
              </div>

              <div style={timelineRowStyle}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} />
                <span style={{ flex: 1 }}>Key takeaways generated</span>
                <span style={{ fontSize: '10px', color: '#94A3B8' }}>1m ago</span>
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: '-14px',
                  right: '16px',
                  background: '#1C1E22',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '6px 14px',
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                }}
              >
                <span>Ready to share</span>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#FF5B22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={10} color="#FFF" />
                </div>
              </div>
            </div>

            <h3 className="font-serif" style={cardTitleStyle}>Share every summary instantly</h3>
            <p style={cardDescStyle}>Instantly share 15-second summaries with your team, friends, or personal bookmarks without long video friction.</p>
          </div>

          {/* Bento Card 3 */}
          <div style={bentoCardStyle}>
            <div style={floaterBoxStyle}>
              <div style={{ background: '#F8FAFC', padding: '8px 12px', borderRadius: '10px', fontSize: '11px', color: '#475569', marginBottom: '8px' }}>
                Expect 15-sec summary in seconds!
              </div>

              <div style={{ background: '#FF5B22', color: '#FFFFFF', padding: '8px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, width: 'fit-content', marginLeft: 'auto', marginBottom: '8px' }}>
                Reel processed!
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '8px 12px', borderRadius: '10px', fontSize: '11px', color: '#0F172A', fontWeight: 600 }}>
                Key takeaways ready to copy
              </div>
            </div>

            <h3 className="font-serif" style={cardTitleStyle}>Never miss an important step</h3>
            <p style={cardDescStyle}>Never miss critical cooking instructions or tutorial steps with automatic step-by-step checklists.</p>
          </div>
        </div>

        {/* Bottom Row Bento Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            textAlign: 'left',
          }}
        >
          {/* Orange Metric Card 1 */}
          <div
            style={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF5B22 100%)',
              borderRadius: 'var(--radius-lg)',
              padding: '40px 32px',
              color: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '220px',
              boxShadow: '0 20px 40px rgba(255, 91, 34, 0.25)',
            }}
          >
            <h3 className="font-serif" style={{ fontSize: '4.2rem', fontWeight: 800, lineHeight: 1, margin: 0 }}>
              3✕
            </h3>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>faster learning turnaround</div>
              <div style={{ fontSize: '13px', opacity: 0.85 }}>Extract core value in 15 seconds instead of 10 minutes</div>
            </div>
          </div>

          {/* Orange Metric Card 2 */}
          <div
            style={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF5B22 100%)',
              borderRadius: 'var(--radius-lg)',
              padding: '40px 32px',
              color: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '220px',
              boxShadow: '0 20px 40px rgba(255, 91, 34, 0.25)',
            }}
          >
            <h3 className="font-serif" style={{ fontSize: '4.2rem', fontWeight: 800, lineHeight: 1, margin: 0 }}>
              40%
            </h3>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>less screen time waste</div>
              <div style={{ fontSize: '13px', opacity: 0.85 }}>Skip algorithm rabbit holes with direct knowledge digests</div>
            </div>
          </div>

          {/* White Card 3 */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '36px 32px',
              color: '#0F172A',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: '220px',
            }}
          >
            <h3 className="font-serif" style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px 0' }}>
              Clean updates
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
              Get key takeaways, step-by-step guides, and notes ready for export without noise.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const bentoCardStyle: React.CSSProperties = {
  background: '#1C1E22',
  borderRadius: '24px',
  padding: '32px 28px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  display: 'flex',
  flexDirection: 'column',
};

const floaterBoxStyle: React.CSSProperties = {
  background: '#FFFFFF',
  borderRadius: '18px',
  padding: '20px',
  marginBottom: '24px',
  color: '#0F172A',
  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
};

const listItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 14px',
  background: '#F8FAFC',
  borderRadius: '12px',
  fontSize: '13px',
  fontWeight: 600,
  marginBottom: '8px',
};

const orangeDotStyle: React.CSSProperties = {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  background: '#FF5B22',
};

const arrowCircleStyle: React.CSSProperties = {
  width: '22px',
  height: '22px',
  borderRadius: '50%',
  background: '#0F172A',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const timelineRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#0F172A',
  padding: '8px 0',
  borderBottom: '1px solid #F1F5F9',
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 800,
  color: '#FFFFFF',
  marginBottom: '8px',
};

const cardDescStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#94A3B8',
  lineHeight: 1.5,
  margin: 0,
};
