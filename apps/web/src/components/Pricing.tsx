import React, { useState } from 'react';
import { Check, ArrowUpRight, ArrowRight } from 'lucide-react';

interface PricingProps {
  onNavigateToSummarizer: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ onNavigateToSummarizer }) => {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" style={{ padding: '100px 0', background: 'transparent' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="badge-pill-cliento" style={{ marginBottom: '16px' }}>
            <span>Simple transparent pricing</span>
          </span>

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
            Choose the plan built for your workflow
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '540px', margin: '0 auto 32px auto' }}>
            Get started for free or upgrade for unlimited video reel summaries.
          </p>

          {/* Monthly / Annual Toggle */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: '#FFFFFF',
              padding: '6px 16px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-subtle)',
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: annual ? 500 : 700, color: annual ? 'var(--text-muted)' : 'var(--text-primary)' }}>
              Monthly
            </span>

            <button
              onClick={() => setAnnual(!annual)}
              style={{
                width: '44px',
                height: '24px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #FF6B35 0%, #FF5B22 100%)',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                padding: '2px',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  transform: annual ? 'translateX(20px)' : 'translateX(0)',
                  transition: 'transform 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              />
            </button>

            <span style={{ fontSize: '14px', fontWeight: annual ? 700 : 500, color: annual ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              Annual <span style={{ color: 'var(--accent-orange)', fontSize: '12px', fontWeight: 700 }}>(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', maxWidth: '1120px', margin: '0 auto' }}>
          {/* Free Tier */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '40px 32px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-subtle)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h3 className="font-serif" style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
              Free Starter
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Perfect for testing & casual video extraction.</p>

            <div className="font-serif" style={{ fontSize: '42px', fontWeight: 800, marginBottom: '24px' }}>
              $0 <span style={{ fontSize: '14px', fontFamily: 'var(--font-sans)', fontWeight: 500, color: 'var(--text-muted)' }}>/ forever</span>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '36px', flex: 1, padding: 0 }}>
              <PricingFeature text="15 Reel Summaries / month" />
              <PricingFeature text="Instant Key Takeaways" />
              <PricingFeature text="Full Audio & Text Transcripts" />
              <PricingFeature text="Saved Personal History" />
            </ul>

            <button onClick={onNavigateToSummarizer} className="btn-cliento-light" style={{ justifyContent: 'center' }}>
              <span>Start Free Now</span>
            </button>
          </div>

          {/* Pro Tier (Featured) */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '40px 32px',
              border: '2px solid var(--accent-orange)',
              boxShadow: '0 20px 40px -10px rgba(255, 91, 34, 0.2)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-14px',
                right: '28px',
                background: 'linear-gradient(135deg, #FF6B35 0%, #FF5B22 100%)',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 800,
                padding: '4px 14px',
                borderRadius: '999px',
                textTransform: 'uppercase',
                boxShadow: '0 4px 12px rgba(255, 91, 34, 0.3)',
              }}
            >
              Most Popular
            </div>

            <h3 className="font-serif" style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
              Pro Creator
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>For active researchers, creators & marketers.</p>

            <div className="font-serif" style={{ fontSize: '42px', fontWeight: 800, marginBottom: '24px' }}>
              ${annual ? '7.50' : '9'}{' '}
              <span style={{ fontSize: '14px', fontFamily: 'var(--font-sans)', fontWeight: 500, color: 'var(--text-muted)' }}>/ month</span>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '36px', flex: 1, padding: 0 }}>
              <PricingFeature text="Unlimited Reel Summaries" />
              <PricingFeature text="Custom Focus Prompts" />
              <PricingFeature text="Key Video Hook Analysis" />
              <PricingFeature text="Step-by-Step Recipe & Guide Export" />
              <PricingFeature text="Cloud Sync Across Devices" />
            </ul>

            <button onClick={onNavigateToSummarizer} className="btn-expand-hover" style={{ width: '100%', justifyContent: 'center' }}>
              <span className="btn-text">Try Digestible Free</span>
              <div className="btn-icon-wrapper">
                <div className="btn-icon-bg"></div>
                <ArrowRight strokeWidth={2} />
              </div>
            </button>
          </div>

          {/* Team Tier */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '40px 32px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-subtle)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h3 className="font-serif" style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
              Agency & Team
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>For content teams & multi-user agencies.</p>

            <div className="font-serif" style={{ fontSize: '42px', fontWeight: 800, marginBottom: '24px' }}>
              ${annual ? '24' : '29'}{' '}
              <span style={{ fontSize: '14px', fontFamily: 'var(--font-sans)', fontWeight: 500, color: 'var(--text-muted)' }}>/ month</span>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '36px', flex: 1, padding: 0 }}>
              <PricingFeature text="Everything in Pro Plan" />
              <PricingFeature text="Up to 5 Team Seats" />
              <PricingFeature text="Export to Notion & Docs" />
              <PricingFeature text="Batch Reel Import & Digest" />
              <PricingFeature text="Dedicated Priority Support" />
            </ul>

            <button onClick={onNavigateToSummarizer} className="btn-cliento-light" style={{ justifyContent: 'center' }}>
              <span>Contact Team Sales</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const PricingFeature: React.FC<{ text: string }> = ({ text }) => (
  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-primary)' }}>
    <Check size={16} color="#FF5B22" />
    <span>{text}</span>
  </li>
);
