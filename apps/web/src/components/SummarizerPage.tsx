import React, { useState } from 'react';
import { AbstractDLogo } from './Logo';
import { ArrowLeft, Copy, Check, Zap, RefreshCw, ListChecks, Mic, FileText } from 'lucide-react';

interface SummarizerPageProps {
  onBackToLanding: () => void;
}

const MOCK_RESULTS: Record<string, any> = {
  default: {
    title: 'High-Protein Garlic Butter Salmon in 20 Minutes',
    summary: 'A fast, nutrient-dense recipe for pan-seared salmon featuring a garlic herb butter glaze. Includes prep, pan temperature control, and serving suggestions for clean macro tracking.',
    category: 'Recipe & Nutrition',
    estimatedReadTime: '25 seconds',
    viralHook: {
      hookText: '"Stop overcooking your salmon! Do this 1 trick instead..."',
      hookEffectivenessScore: 94,
    },
    keyTakeaways: [
      'Pat salmon dry with paper towels to get a crisp outer sear.',
      'Sear skin-side down for 4 minutes on medium-high before flipping.',
      'Baste with garlic, fresh thyme, and cold butter during the last 60 seconds.',
    ],
    stepByStepInstructions: [
      { stepNumber: 1, title: 'Dry Fillet', detail: 'Remove surface moisture completely using paper towels.' },
      { stepNumber: 2, title: 'Heat Pan', detail: 'Preheat skillet with 1 tbsp olive oil until shimmering.' },
      { stepNumber: 3, title: 'Baste & Rest', detail: 'Baste for 60s with garlic butter, then rest 2 minutes before serving.' },
    ],
    fullTranscript: "Stop overcooking your salmon! If you want restaurant-quality crispiness, always pat the skin completely dry first. Get your pan blazing hot, drop it skin-side down, and don't touch it for 4 minutes. Finish with fresh garlic, thyme, and cold butter. Perfection every single time.",
  },
};

export const SummarizerPage: React.FC<SummarizerPageProps> = ({ onBackToLanding }) => {
  const [url, setUrl] = useState('https://www.instagram.com/reel/C8SalmonDemo/');
  const [customPrompt, setCustomPrompt] = useState('');
  const [status, setStatus] = useState<'idle' | 'extracting' | 'completed'>('completed');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'takeaways' | 'transcript' | 'checklist'>('summary');
  const result = MOCK_RESULTS.default;

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('extracting');
    setTimeout(() => {
      setStatus('completed');
    }, 2000);
  };

  const handleCopy = () => {
    const textToCopy = `${result.title}\n\nSummary:\n${result.summary}\n\nKey Takeaways:\n${result.keyTakeaways.map((t: string) => `• ${t}`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)', paddingBottom: '80px' }}>
      {/* Main Container */}
      <main className="container" style={{ paddingTop: '160px', maxWidth: '900px' }}>
        {/* Page Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1
            className="font-serif"
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              margin: '0 0 16px 0',
            }}
          >
            Summarize any reel or video note
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto' }}>
            Paste a video link below to extract key takeaways, recipe steps, and clean spoken transcripts in seconds.
          </p>
        </div>

        {/* Form Card */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-card)',
            padding: '36px',
            marginBottom: '32px',
          }}
        >
          <form onSubmit={handleSimulate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste Instagram Reel or Video URL..."
                required
                style={{
                  flex: 1,
                  minWidth: '280px',
                  padding: '16px 20px',
                  borderRadius: '999px',
                  border: '1px solid var(--border-light)',
                  background: '#F8FAFC',
                  fontSize: '15px',
                  color: '#0F172A',
                  outline: 'none',
                }}
              />

              <button type="submit" className="btn-expand-hover" disabled={status === 'extracting'} style={{ opacity: status === 'extracting' ? 0.7 : 1 }}>
                <span className="btn-text">{status === 'extracting' ? 'Processing...' : 'Digest Reel'}</span>
                <div className="btn-icon-wrapper">
                  <div className="btn-icon-bg"></div>
                  {status === 'extracting' ? (
                    <RefreshCw size={20} strokeWidth={2} className="animate-spin" />
                  ) : (
                    <Zap size={20} strokeWidth={2} />
                  )}
                </div>
              </button>
            </div>

            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Optional focus prompt (e.g., 'Focus on recipe ingredients & macros')"
              style={{
                padding: '12px 20px',
                borderRadius: '999px',
                border: '1px solid var(--border-light)',
                background: '#FFFFFF',
                fontSize: '13px',
                color: '#475569',
                outline: 'none',
              }}
            />
          </form>

          {/* Loading Animation */}
          {status === 'extracting' && (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748B' }}>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A' }}>Extracting video notes & transcripts...</div>
            </div>
          )}

          {/* Results Output */}
          {status === 'completed' && (
            <div style={{ marginTop: '32px', paddingTop: '28px', borderTop: '1px solid var(--border-light)' }}>
              {/* Header Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#FF5B22', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {result.category}
                  </span>
                  <h3 className="font-serif" style={{ fontSize: '24px', fontWeight: 800, margin: '4px 0 0 0' }}>
                    {result.title}
                  </h3>
                </div>

                <button
                  onClick={handleCopy}
                  className="btn-cliento-light"
                  style={{ fontSize: '13px', padding: '8px 16px' }}
                >
                  {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
                </button>
              </div>

              {/* Navigation Tabs */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setActiveTab('summary')}
                  style={{ ...tabStyle, background: activeTab === 'summary' ? '#0F172A' : '#F1F5F9', color: activeTab === 'summary' ? '#FFF' : '#475569' }}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('takeaways')}
                  style={{ ...tabStyle, background: activeTab === 'takeaways' ? '#0F172A' : '#F1F5F9', color: activeTab === 'takeaways' ? '#FFF' : '#475569' }}
                >
                  Key Takeaways
                </button>
                <button
                  onClick={() => setActiveTab('checklist')}
                  style={{ ...tabStyle, background: activeTab === 'checklist' ? '#0F172A' : '#F1F5F9', color: activeTab === 'checklist' ? '#FFF' : '#475569' }}
                >
                  Recipe Steps
                </button>
                <button
                  onClick={() => setActiveTab('transcript')}
                  style={{ ...tabStyle, background: activeTab === 'transcript' ? '#0F172A' : '#F1F5F9', color: activeTab === 'transcript' ? '#FFF' : '#475569' }}
                >
                  Transcript
                </button>
              </div>

              {/* Tab Contents */}
              {activeTab === 'summary' && (
                <div>
                  <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#334155', marginBottom: '20px' }}>
                    {result.summary}
                  </p>
                  <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>Core Highlights</div>
                    <ul style={{ paddingLeft: '20px', margin: 0, color: '#475569', fontSize: '14px', lineHeight: 1.7 }}>
                      {result.keyTakeaways.map((t: string, idx: number) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'takeaways' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {result.keyTakeaways.map((t: string, idx: number) => (
                    <div key={idx} style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '14px', border: '1px solid #E2E8F0', fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
                      {idx + 1}. {t}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'checklist' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {result.stepByStepInstructions.map((step: any) => (
                    <div key={step.stepNumber} style={{ background: '#F8FAFC', padding: '16px 20px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                        Step {step.stepNumber}: {step.title}
                      </div>
                      <div style={{ fontSize: '13.5px', color: '#475569' }}>{step.detail}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'transcript' && (
                <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0', fontSize: '14px', lineHeight: 1.7, color: '#334155' }}>
                  {result.fullTranscript}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const tabStyle: React.CSSProperties = {
  border: 'none',
  padding: '8px 16px',
  borderRadius: '999px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};
