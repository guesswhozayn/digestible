import React, { useState } from 'react';
import { Plus, Minus, Check, Zap } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '(01)',
      title: 'Paste any reel link',
      description: 'Copy any Instagram Reel, Shorts, or video URL. Paste it directly into Digestible for instant summary generation.',
    },
    {
      num: '(02)',
      title: 'Instant smart extraction',
      description: 'Extract spoken audio, on-screen text overlays, and key recipe or tutorial moments without watching full videos.',
    },
    {
      num: '(03)',
      title: 'Export 15-sec knowledge',
      description: 'Get clear bullet points, clean transcripts, and actionable step-by-step checklists ready to save or share.',
    },
  ];

  return (
    <section
      id="how-it-works"
      style={{
        padding: '100px 0',
        background: 'transparent',
      }}
    >
      <div className="container" style={{ textAlign: 'center' }}>
        {/* Badge Pill */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <span className="badge-pill-cliento">How it works</span>
        </div>

        {/* Serif Headline */}
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
          Simple workflow built for clarity
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
          From pasting video links to saving actionable notes, everything flows in a structure built to save you time.
        </p>

        {/* 2-Column Accordion Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'center',
            textAlign: 'left',
          }}
        >
          {/* Left Column */}
          <div
            style={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF5B22 100%)',
              borderRadius: 'var(--radius-lg)',
              padding: '50px 30px',
              display: 'flex',
              justifyContent: 'center',
              boxShadow: '0 25px 50px -10px rgba(255, 91, 34, 0.3)',
            }}
          >
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '30px 24px',
                width: '100%',
                maxWidth: '320px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                color: '#0F172A',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#FF5B22',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px auto',
                  }}
                >
                  <Zap size={22} color="#FFF" />
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>Source Input</div>
                <div style={{ fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <span>Instagram Reel Link</span>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#FF5B22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={10} color="#FFF" />
                  </div>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', fontSize: '11px', color: '#475569' }}>
                instagram.com/reel/C8SalmonDemo/
              </div>

              {/* Action Button */}
              <div
                style={{
                  background: '#1C1E22',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  padding: '12px',
                  borderRadius: '999px',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <span>Digest Reel Now</span>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#FF5B22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={12} color="#FFF" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Numbered Accordion List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {steps.map((step, idx) => {
              const isOpen = activeStep === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  style={{
                    background: isOpen ? 'linear-gradient(135deg, #FF6B35 0%, #FF5B22 100%)' : '#FFFFFF',
                    color: isOpen ? '#FFFFFF' : '#0F172A',
                    borderRadius: '24px',
                    padding: '24px 28px',
                    border: isOpen ? 'none' : '1px solid var(--border-light)',
                    boxShadow: isOpen ? '0 15px 35px rgba(255, 91, 34, 0.25)' : '0 4px 14px rgba(0,0,0,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span className="font-serif" style={{ fontSize: '20px', fontWeight: 800, opacity: isOpen ? 0.9 : 0.6 }}>
                        {step.num}
                      </span>
                      <h3 className="font-serif" style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>
                        {step.title}
                      </h3>
                    </div>

                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isOpen ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isOpen ? <Minus size={18} color="#FFF" /> : <Plus size={18} color="#FF5B22" />}
                    </div>
                  </div>

                  {isOpen && (
                    <p style={{ marginTop: '16px', fontSize: '14px', opacity: 0.95, lineHeight: 1.6, margin: '16px 0 0 0' }}>
                      {step.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
