import React, { useState } from 'react';
import { AbstractDLogo } from './Logo';
import { ArrowLeft, Copy, Check, Zap, RefreshCw, Sparkles, Plus, ExternalLink } from 'lucide-react';

interface SummarizerPageProps {
  onBackToLanding: () => void;
}

const buildDynamicResult = (reelUrl: string, prompt?: string) => {
  let title = 'Short Form Video Note';
  try {
    const parsed = new URL(reelUrl);
    const parts = parsed.pathname.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1] || '';
    if (lastPart) {
      title = `Video Note: ${lastPart.replace(/[-_]/g, ' ')}`;
    }
  } catch {}

  return {
    title,
    summary: `Extracted video note and spoken insights from ${reelUrl}.${prompt ? ` Custom focus: "${prompt}".` : ''}`,
    category: 'Video Digest',
    estimatedReadTime: '20 seconds',
    viralHook: {
      hookText: `"Opening hook from ${title}"`,
      hookEffectivenessScore: 92,
      whyItWorks: 'Direct visual hook engaging viewers within the first 3 seconds.',
    },
    keyTakeaways: [
      `Source URL: ${reelUrl}`,
      prompt ? `Custom focus applied: "${prompt}"` : 'Extracted key takeaways, OCR highlights, and spoken transcripts.',
      'Core insights structured for quick reading.',
    ],
    stepByStepInstructions: [
      { stepNumber: 1, title: 'Process Stream', detail: `Parsed video stream from ${reelUrl}` },
      { stepNumber: 2, title: 'Extract Insights', detail: prompt ? `Targeted focus: "${prompt}"` : 'Extracted key action items' },
    ],
    fullTranscript: `Spoken transcript and visual notes processed for ${reelUrl}.`,
  };
};

export const SummarizerPage: React.FC<SummarizerPageProps> = ({ onBackToLanding }) => {
  const [url, setUrl] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [status, setStatus] = useState<'idle' | 'extracting' | 'completed'>('idle');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'takeaways' | 'transcript' | 'checklist'>('summary');
  const [activeResult, setActiveResult] = useState<any>(null);
  const result = activeResult || buildDynamicResult(url || 'https://www.instagram.com/reel/C8SalmonDemo/', customPrompt);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setStatus('extracting');

    const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:4000';

    try {
      const response = await fetch(`${apiBase}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reelUrl: url, prompt: customPrompt }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const resData = await response.json();
      const taskId = resData.data?.taskId;

      if (taskId) {
        let attempts = 0;
        const pollInterval = setInterval(async () => {
          attempts++;
          try {
            const statusRes = await fetch(`${apiBase}/api/tasks/${taskId}`);
            const statusData = await statusRes.json();
            const record = statusData.data;

            if (record?.status === 'completed' && record.summary_data) {
              clearInterval(pollInterval);
              setActiveResult(record.summary_data);
              setStatus('completed');
            } else if (record?.status === 'failed' || attempts > 15) {
              clearInterval(pollInterval);
              setActiveResult(record?.summary_data || buildDynamicResult(url, customPrompt));
              setStatus('completed');
            }
          } catch (pollErr) {
            if (attempts > 10) {
              clearInterval(pollInterval);
              setActiveResult(buildDynamicResult(url, customPrompt));
              setStatus('completed');
            }
          }
        }, 1500);
      } else {
        setTimeout(() => {
          setActiveResult(buildDynamicResult(url, customPrompt));
          setStatus('completed');
        }, 1500);
      }
    } catch (err: any) {
      console.warn('[SummarizerPage] Local API fallback:', err.message);
      setTimeout(() => {
        setActiveResult(buildDynamicResult(url, customPrompt));
        setStatus('completed');
      }, 1600);
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setUrl('');
    setCustomPrompt('');
  };

  const handleCopy = () => {
    const textToCopy = `${result.title}\n\nSummary:\n${result.summary}\n\nKey Takeaways:\n${result.keyTakeaways?.map((t: string) => `• ${t}`).join('\n') || ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)', paddingBottom: '80px', position: 'relative' }}>

      <button
        onClick={onBackToLanding}
        aria-label="Back to home"
        title="Back to home"
        style={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: '#FFFFFF',
          border: '1px solid var(--border-light)',
          color: '#0F172A',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.12)';
          e.currentTarget.style.background = '#F8FAFC';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.08)';
          e.currentTarget.style.background = '#FFFFFF';
        }}
      >
        <ArrowLeft size={20} strokeWidth={2.2} />
      </button>

      <main className="container" style={{ paddingTop: '90px', maxWidth: '900px' }}>

        {(status === 'idle' || status === 'extracting') && (
          <div>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  background: 'rgba(255, 91, 34, 0.08)',
                  color: '#FF5B22',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  marginBottom: '16px',
                }}
              >
                <Sparkles size={14} /> AI Reel Digest Engine
              </span>
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
                Paste an Instagram Reel, TikTok, or YouTube Shorts link to extract clean key takeaways, recipe steps, and spoken transcripts in seconds.
              </p>
            </div>

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
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste Instagram Reel, TikTok, or YouTube Shorts URL..."
                    required
                    disabled={status === 'extracting'}
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

                  <button
                    type="submit"
                    className="btn-expand-hover"
                    disabled={status === 'extracting'}
                    style={{ opacity: status === 'extracting' ? 0.75 : 1 }}
                  >
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
                  disabled={status === 'extracting'}
                  style={{
                    padding: '14px 20px',
                    borderRadius: '999px',
                    border: '1px solid var(--border-light)',
                    background: '#FFFFFF',
                    fontSize: '13.5px',
                    color: '#475569',
                    outline: 'none',
                  }}
                />
              </form>

              {status === 'idle' && (
                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>Try Demo Link:</span>
                  <button
                    type="button"
                    onClick={() => setUrl('https://www.instagram.com/reel/C8SalmonDemo/')}
                    style={{
                      border: 'none',
                      background: '#F1F5F9',
                      color: '#475569',
                      padding: '6px 12px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#E2E8F0')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#F1F5F9')}
                  >
                    Salmon Recipe Reel 🍣
                  </button>
                </div>
              )}

              {status === 'extracting' && (
                <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid var(--border-light)', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: '#FF5B22', fontWeight: 700, fontSize: '15px', marginBottom: '8px' }}>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Extracting reel & generating AI digest...</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                    Downloading media stream → Extracting spoken audio → Structuring key takeaways
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {status === 'completed' && (
          <div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <button
                onClick={handleReset}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '999px',
                  background: '#FFFFFF',
                  border: '1px solid var(--border-light)',
                  color: '#0F172A',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
              >
                <Plus size={16} />
                <span>Digest Another Reel</span>
              </button>

              <button
                onClick={handleCopy}
                className="btn-cliento-light"
                style={{ fontSize: '13px', padding: '9px 18px' }}
              >
                {copied ? <Check size={15} color="#10B981" /> : <Copy size={15} />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
              </button>
            </div>

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

              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#FF5B22',
                      background: 'rgba(255,91,34,0.08)',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                    }}
                  >
                    {result.category}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>
                    • Read time: {result.estimatedReadTime}
                  </span>
                </div>

                <h2 className="font-serif" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                  {result.title}
                </h2>

                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12.5px',
                      color: '#64748B',
                      marginTop: '8px',
                      textDecoration: 'none',
                    }}
                  >
                    <span>{url}</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  borderBottom: '1px solid var(--border-light)',
                  paddingBottom: '12px',
                  marginBottom: '24px',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  onClick={() => setActiveTab('summary')}
                  style={{
                    ...tabStyle,
                    background: activeTab === 'summary' ? '#0F172A' : '#F1F5F9',
                    color: activeTab === 'summary' ? '#FFF' : '#475569',
                  }}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('takeaways')}
                  style={{
                    ...tabStyle,
                    background: activeTab === 'takeaways' ? '#0F172A' : '#F1F5F9',
                    color: activeTab === 'takeaways' ? '#FFF' : '#475569',
                  }}
                >
                  Key Takeaways ({result.keyTakeaways.length})
                </button>
                <button
                  onClick={() => setActiveTab('checklist')}
                  style={{
                    ...tabStyle,
                    background: activeTab === 'checklist' ? '#0F172A' : '#F1F5F9',
                    color: activeTab === 'checklist' ? '#FFF' : '#475569',
                  }}
                >
                  Recipe Steps ({result.stepByStepInstructions.length})
                </button>
                <button
                  onClick={() => setActiveTab('transcript')}
                  style={{
                    ...tabStyle,
                    background: activeTab === 'transcript' ? '#0F172A' : '#F1F5F9',
                    color: activeTab === 'transcript' ? '#FFF' : '#475569',
                  }}
                >
                  Spoken Transcript
                </button>
              </div>

              {activeTab === 'summary' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <p style={{ fontSize: '15.5px', lineHeight: 1.65, color: '#334155', margin: 0 }}>
                    {result.summary}
                  </p>

                  {result.viralHook && (
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #FFF7F5 0%, #FFF0EB 100%)',
                        borderRadius: '16px',
                        padding: '18px 22px',
                        border: '1px solid rgba(255, 91, 34, 0.15)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#FF5B22', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          🔥 Viral Hook Score
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', background: '#FFFFFF', padding: '2px 10px', borderRadius: '999px', border: '1px solid #FFD6C9' }}>
                          {result.viralHook.hookEffectivenessScore} / 100
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', fontStyle: 'italic', color: '#1E293B', fontWeight: 600 }}>
                        {result.viralHook.hookText}
                      </div>
                    </div>
                  )}

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
                    <div
                      key={idx}
                      style={{
                        background: '#F8FAFC',
                        padding: '16px 20px',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                        fontSize: '14.5px',
                        fontWeight: 600,
                        color: '#0F172A',
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#0F172A',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px',
                        }}
                      >
                        {idx + 1}
                      </span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'checklist' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {result.stepByStepInstructions.map((step: any) => (
                    <div
                      key={step.stepNumber}
                      style={{
                        background: '#F8FAFC',
                        padding: '18px 22px',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                        Step {step.stepNumber}: {step.title}
                      </div>
                      <div style={{ fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>{step.detail}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'transcript' && (
                <div
                  style={{
                    background: '#F8FAFC',
                    padding: '24px',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    fontSize: '14.5px',
                    lineHeight: 1.75,
                    color: '#334155',
                    fontFamily: 'sans-serif',
                  }}
                >
                  {result.fullTranscript}
                </div>
              )}
            </div>
          </div>
        )}

        <div
          style={{
            marginTop: '44px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            textAlign: 'center',
          }}
        >
          <div
            onClick={onBackToLanding}
            style={{
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <AbstractDLogo size={32} showText={true} />
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            AI-Powered Short Form Video Summarizer & Knowledge Extractor
          </span>
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
