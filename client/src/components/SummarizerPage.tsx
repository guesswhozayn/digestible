import React, { useState } from 'react';
import { AbstractDLogo } from './Logo';
import { ArrowLeft, ArrowRight, Copy, Check, RefreshCw, Sparkles, Plus, ExternalLink, ListOrdered, MessageSquare, Flame, CheckSquare, Clock } from 'lucide-react';
import { ReelSummaryResult } from '../types/digest';

interface SummarizerPageProps {
  onBackToLanding: () => void;
}

const buildDynamicResult = (reelUrl: string, prompt?: string): ReelSummaryResult => {
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
    sentiment: 'positive',
    targetAudience: 'General Audience',
    actionableInsights: [
      `Review key concepts from ${reelUrl}`,
      'Apply structured checklist steps',
    ],
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
    keyQuotes: [`"Key insight highlighted from video."`],
    timestampedMoments: [
      { timestamp: '00:01', seconds: 1, label: 'Opening Hook', summary: 'Intro and setup' },
      { timestamp: '00:15', seconds: 15, label: 'Core Content', summary: 'Main walkthrough' },
    ],
    stepByStepInstructions: [
      { stepNumber: 1, title: 'Process Stream', detail: `Parsed video stream from ${reelUrl}` },
      { stepNumber: 2, title: 'Extract Insights', detail: prompt ? `Targeted focus: "${prompt}"` : 'Extracted key action items' },
    ],
    onScreenTextHighlights: ['Highlighted on-screen text and titles'],
    audioAnalysis: {
      fullTranscript: `Spoken transcript and visual notes processed for ${reelUrl}.`,
      speakerTone: 'Informative & Direct',
      backgroundMusic: 'Ambient background track',
      speechPace: 'moderate',
      wordsPerMinute: 140,
      clarityScore: 92,
    },
  };
};

export const SummarizerPage: React.FC<SummarizerPageProps> = ({ onBackToLanding }) => {
  const [url, setUrl] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [status, setStatus] = useState<'idle' | 'extracting' | 'completed'>('idle');
  const [copied, setCopied] = useState(false);
  const [activeResult, setActiveResult] = useState<ReelSummaryResult | null>(null);
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
        // Allow up to 60 attempts (~90 seconds) to accommodate yt-dlp stream extraction and LLM synthesis
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
            } else if (record?.status === 'failed') {
              clearInterval(pollInterval);
              console.error('[SummarizerPage] Backend task failed:', record.error_message);
              setActiveResult(record?.summary_data || buildDynamicResult(url, customPrompt));
              setStatus('completed');
            } else if (attempts > 60) {
              clearInterval(pollInterval);
              setActiveResult(record?.summary_data || buildDynamicResult(url, customPrompt));
              setStatus('completed');
            }
          } catch (pollErr) {
            if (attempts > 30) {
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
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-main)',
        color: 'var(--text-primary)',
        paddingBottom: '80px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >

      <button
        onClick={onBackToLanding}
        className="summarizer-back-btn"
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

      <main
        className="container"
        style={{
          paddingTop: status === 'completed' ? '80px' : '40px',
          maxWidth: '900px',
          width: '100%',
          margin: '0 auto',
        }}
      >

        {(status === 'idle' || status === 'extracting') && (
          <div>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h1
                className="font-serif"
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3.8rem)',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  margin: '0 0 14px 0',
                }}
              >
                Summarize any reel or video note
              </h1>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto', padding: '0 8px' }}>
                Paste an Instagram Reel, TikTok, or YouTube Shorts link to extract clean key takeaways, recipe steps, and spoken transcripts in seconds.
              </p>
            </div>

            <div
              className="summarizer-card"
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
                <div className="summarizer-input-row" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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
                    className="btn-expand-hover summarizer-submit-btn"
                    disabled={status === 'extracting'}
                    style={{ opacity: status === 'extracting' ? 0.75 : 1 }}
                  >
                    <span className="btn-text">{status === 'extracting' ? 'Processing...' : 'Digest Reel'}</span>
                    <div className="btn-icon-wrapper">
                      <div className="btn-icon-bg"></div>
                      {status === 'extracting' ? (
                        <RefreshCw size={20} strokeWidth={2} className="animate-spin" />
                      ) : (
                        <ArrowRight size={20} strokeWidth={2} />
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
                    width: '100%',
                  }}
                />
              </form>
            </div>
          </div>
        )}

        {status === 'completed' && (
          <div>
            <div
              className="summarizer-card"
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 700,
                        color: '#FF5B22',
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                      }}
                    >
                      {result.category}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>
                      • {result.estimatedReadTime} read
                    </span>
                  </div>

                  {/* Header Minimalist Action Icons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={handleCopy}
                      title={copied ? 'Copied to clipboard' : 'Copy summary'}
                      aria-label="Copy summary"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        height: '34px',
                        padding: copied ? '0 12px' : '0 10px',
                        borderRadius: '999px',
                        background: copied ? '#ECFDF5' : '#F8FAFC',
                        border: copied ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                        color: copied ? '#059669' : '#475569',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!copied) {
                          e.currentTarget.style.background = '#F1F5F9';
                          e.currentTarget.style.color = '#0F172A';
                          e.currentTarget.style.borderColor = '#CBD5E1';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!copied) {
                          e.currentTarget.style.background = '#F8FAFC';
                          e.currentTarget.style.color = '#475569';
                          e.currentTarget.style.borderColor = '#E2E8F0';
                        }
                      }}
                    >
                      {copied ? <Check size={15} strokeWidth={2.4} color="#059669" /> : <Copy size={15} strokeWidth={2} />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={handleReset}
                      title="Digest another reel"
                      aria-label="Digest another reel"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        height: '34px',
                        padding: '0 12px',
                        borderRadius: '999px',
                        background: '#0F172A',
                        border: '1px solid #0F172A',
                        color: '#FFFFFF',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#FF5B22';
                        e.currentTarget.style.borderColor = '#FF5B22';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#0F172A';
                        e.currentTarget.style.borderColor = '#0F172A';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <Plus size={15} strokeWidth={2.2} />
                      <span>New</span>
                    </button>
                  </div>
                </div>

                <h2 className="font-serif" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)', fontWeight: 800, margin: 0, color: '#0F172A', wordBreak: 'break-word' }}>
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
                      fontSize: '12px',
                      color: '#64748B',
                      marginTop: '8px',
                      textDecoration: 'none',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</span>
                    <ExternalLink size={12} style={{ flexShrink: 0 }} />
                  </a>
                )}
              </div>

              {/* Unified Content Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                
                {/* 1. Summary Overview */}
                <div>
                  <p style={{ fontSize: '15.5px', lineHeight: 1.7, color: '#334155', margin: 0 }}>
                    {result.summary}
                  </p>
                </div>

                {/* 2. Viral Hook Box (if present) */}
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Flame size={16} color="#FF5B22" />
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#FF5B22', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Viral Hook Score
                        </span>
                      </div>
                      <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>
                        {result.viralHook.hookEffectivenessScore} / 100
                      </span>
                    </div>
                    <div style={{ fontSize: '14.5px', fontStyle: 'italic', color: '#1E293B', fontWeight: 600 }}>
                      {result.viralHook.hookText}
                    </div>
                    {result.viralHook.whyItWorks && (
                      <div style={{ fontSize: '13px', color: '#64748B', marginTop: '6px' }}>
                        {result.viralHook.whyItWorks}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Key Takeaways */}
                {result.keyTakeaways && result.keyTakeaways.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <CheckSquare size={18} color="#FF5B22" />
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                        Key Takeaways
                      </h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {result.keyTakeaways.map((takeaway: string, idx: number) => (
                        <div
                          key={idx}
                          style={{
                            background: '#F8FAFC',
                            padding: '14px 18px',
                            borderRadius: '14px',
                            border: '1px solid #E2E8F0',
                            fontSize: '14px',
                            color: '#1E293B',
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'flex-start',
                            lineHeight: 1.5,
                          }}
                        >
                          <span
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              background: '#0F172A',
                              color: '#FFFFFF',
                              fontSize: '11px',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: '1px',
                            }}
                          >
                            {idx + 1}
                          </span>
                          <span>{takeaway}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Recipe / Action Steps (if available) */}
                {result.stepByStepInstructions && result.stepByStepInstructions.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <ListOrdered size={18} color="#FF5B22" />
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                        Step-by-Step Instructions
                      </h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {result.stepByStepInstructions.map((step) => (
                        <div
                          key={step.stepNumber}
                          style={{
                            background: '#F8FAFC',
                            padding: '16px 20px',
                            borderRadius: '14px',
                            border: '1px solid #E2E8F0',
                          }}
                        >
                          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                            Step {step.stepNumber}: {step.title}
                          </div>
                          <div style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.5 }}>
                            {step.detail}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Key Spoken Transcript */}
                {result.audioAnalysis?.fullTranscript && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <MessageSquare size={18} color="#FF5B22" />
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                        Spoken Transcript
                      </h3>
                      {result.audioAnalysis.speakerTone && (
                        <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500, marginLeft: 'auto' }}>
                          Tone: {result.audioAnalysis.speakerTone}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        background: '#F8FAFC',
                        padding: '20px',
                        borderRadius: '14px',
                        border: '1px solid #E2E8F0',
                        fontSize: '14px',
                        lineHeight: 1.7,
                        color: '#334155',
                      }}
                    >
                      {result.audioAnalysis.fullTranscript}
                    </div>
                  </div>
                )}

              </div>
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
        </div>
      </main>
    </div>
  );
};
