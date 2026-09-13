import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'How does Digestible digest videos so quickly?',
    a: 'Digestible extracts the MP4 video and audio stream, processes spoken audio with speech recognition, and analyzes visual text overlays (OCR) using high-speed OpenRouter multimodal AI models like Gemini 2.5 Flash.',
  },
  {
    q: 'Can I use custom instructions to focus on specific details?',
    a: 'Yes! Digestible supports custom focus prompts. For example, you can enter "Focus on exact recipe ingredient quantities and macro nutrients" or "Extract only coding tips".',
  },
  {
    q: 'Is there a limit on how long the video can be?',
    a: 'Digestible is optimized for short-form videos across Instagram, TikTok, and YouTube Shorts ranging from 15 seconds to 3 minutes long.',
  },
  {
    q: 'Does Digestible store my extracted insights?',
    a: 'Yes! Your extracted insights are cached locally on your device for instant offline reading and seamlessly synced to your cloud account via Supabase.',
  },
  {
    q: 'What AI provider powers Digestible?',
    a: 'Digestible is powered by OpenRouter, allowing unified commercial access to Gemini 2.5 Flash, Claude 3.5, and free auto-router models with zero vendor lock-in.',
  },
];

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" style={{ padding: '100px 0', background: 'transparent' }}>
      <div className="container">

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge-pill-cliento" style={{ marginBottom: '16px' }}>
            <span>Got Questions?</span>
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
              margin: '0 auto',
            }}
          >
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '20px 24px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{faq.q}</h4>
                <ChevronDown
                  size={20}
                  color="var(--accent-start)"
                  style={{
                    transform: openIdx === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </div>

              {openIdx === idx && (
                <p style={{ marginTop: '14px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--border-card)', paddingTop: '12px' }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
