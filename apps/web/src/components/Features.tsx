import React from 'react';
import { Volume2, ScanText, Flame, ListChecks, Clock, ShieldCheck, Sparkles, Cpu } from 'lucide-react';

const FEATURES = [
  {
    icon: <Volume2 size={26} color="#89BDF9" />,
    title: 'Multimodal Audio Transcription',
    description: 'Listens to spoken audio streams to extract verbatim transcripts, vocal tone (energetic vs. instructional), and background acoustic cues.',
  },
  {
    icon: <ScanText size={26} color="#38BDF8" />,
    title: 'On-Screen OCR Text Highlights',
    description: 'Reads text overlays, ingredients, code snippets, and callouts embedded directly into the video frames.',
  },
  {
    icon: <Flame size={26} color="#FBBF24" />,
    title: 'Viral Hook & Psychology Scoring',
    description: 'Analyzes opening lines and visual hooks with an effectiveness score (0-100) explaining why the hook captures audience attention.',
  },
  {
    icon: <ListChecks size={26} color="#34D399" />,
    title: 'Actionable Step-by-Step Checklists',
    description: 'Converts video tutorials, recipes, and workout routines into structured interactive checkable to-do lists.',
  },
  {
    icon: <Clock size={26} color="#F472B6" />,
    title: 'Timestamped Chapter Breakdowns',
    description: 'Automatically segments long reels into timestamped moments with scene labels and exact visual descriptions.',
  },
  {
    icon: <Cpu size={26} color="#A78BFA" />,
    title: 'OpenRouter AI Model Engine',
    description: 'Powered by high-speed multimodal models (Gemini 2.5 Flash / Claude 3.5 / OpenRouter Auto) for instant output.',
  },
];

export const Features: React.FC = () => {
  return (
    <section id="features" style={{ padding: '100px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span className="badge-pill-cliento" style={{ marginBottom: '16px' }}>
            <Sparkles size={14} color="#89BDF9" />
            <span>Multimodal Intelligence</span>
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-1px' }}>
            Everything You Need to <span className="gradient-text">Consume Video 10x Faster.</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '640px', margin: '16px auto 0 auto' }}>
            Stop scrubbing through 60-second Reels. Extract actionable insights and retain core knowledge in seconds.
          </p>
        </div>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '24px' }}>
          {FEATURES.map((feature, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-card)' }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{feature.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
