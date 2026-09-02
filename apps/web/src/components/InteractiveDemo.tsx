import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Link as LinkIcon,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  Volume2,
  Clock,
  ListChecks,
  Flame,
  Mic,
  RefreshCw,
} from 'lucide-react';

interface InteractiveDemoProps {
  selectedUrl: string;
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
      whyItWorks: 'Uses pattern disruption and curiosity gap by challenging common culinary mistakes.',
    },
    keyTakeaways: [
      'Pat salmon dry with paper towels to get a crisp outer sear.',
      'Sear skin-side down for 4 minutes on medium-high before flipping.',
      'Baste with garlic, fresh thyme, and cold butter during the last 60 seconds.',
    ],
    timestampedMoments: [
      { timestamp: '00:03', seconds: 3, label: 'Preparation', summary: 'Drying & seasoning fillet with sea salt and cracked pepper' },
      { timestamp: '00:14', seconds: 14, label: 'Sear Phase', summary: 'Skin-down sear in hot cast iron skillet' },
      { timestamp: '00:28', seconds: 28, label: 'Garlic Butter Baste', summary: 'Adding garlic cloves, butter, and basting for glaze' },
    ],
    stepByStepInstructions: [
      { stepNumber: 1, title: 'Dry Fillet', detail: 'Remove surface moisture completely using paper towels.', timestamp: '00:03' },
      { stepNumber: 2, title: 'Heat Pan', detail: 'Preheat skillet with 1 tbsp olive oil until shimmering.', timestamp: '00:08' },
      { stepNumber: 3, title: 'Baste & Rest', detail: 'Baste for 60s with garlic butter, then rest 2 minutes before serving.', timestamp: '00:30' },
    ],
    audioAnalysis: {
      fullTranscript: "Stop overcooking your salmon! If you want restaurant-quality crispiness, always pat the skin completely dry first. Get your pan blazing hot, drop it skin-side down, and don't touch it for 4 minutes. Finish with fresh garlic, thyme, and cold butter. Perfection every single time.",
      speakerTone: 'Energetic & Instructional',
      backgroundMusic: 'Upbeat Lo-Fi Chill Hop Beat',
      speechPace: 'fast',
      wordsPerMinute: 172,
    },
  },
};

export const InteractiveDemo: React.FC<InteractiveDemoProps> = ({ selectedUrl }) => {
  const [url, setUrl] = useState(selectedUrl || 'https://www.instagram.com/reel/C8SalmonDemo/');
  const [customPrompt, setCustomPrompt] = useState('');
  const [status, setStatus] = useState<'idle' | 'extracting' | 'analyzing' | 'completed'>('completed');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'takeaways' | 'transcript' | 'checklist'>('summary');
  const [result, setResult] = useState<any>(MOCK_RESULTS.default);

  useEffect(() => {
    if (selectedUrl) {
      setUrl(selectedUrl);
    }
  }, [selectedUrl]);

  const handleSimulate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStatus('extracting');

    setTimeout(() => {
      setStatus('analyzing');
    }, 1200);

    setTimeout(() => {
      setStatus('completed');
    }, 2800);
  };

  const handleCopy = () => {
    const textToCopy = `${result.title}\n\nSummary:\n${result.summary}\n\nKey Takeaways:\n${result.keyTakeaways.map((t: string) => `• ${t}`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="demo" style={{ padding: '80px 0' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge-pill" style={{ marginBottom: '16px' }}>
            <Sparkles size={14} color="var(--accent-start)" />
            <span>Live Interactive Simulator</span>
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, letterSpacing: '-1px' }}>
            Experience Reel Summarization <span className="gradient-text">Live.</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '12px auto 0 auto' }}>
            Paste any Instagram Reel link or click a preset to simulate instant multimodal analysis.
          </p>
        </div>

        {/* Master Simulator Card */}
        <div className="glass-card" style={{ padding: '36px', maxWidth: '960px', margin: '0 auto' }}>
          {/* Input Form */}
          <form onSubmit={handleSimulate} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
                <LinkIcon size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste Instagram Reel URL (e.g., https://www.instagram.com/reel/...)"
                  required
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 48px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--border-card)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    outline: 'none',
                  }}
                />
              </div>

              <button type="submit" className="btn-yellow" disabled={status === 'extracting' || status === 'analyzing'}>
                {status === 'idle' || status === 'completed' ? (
                  <>
                    <Zap size={18} />
                    <span>Digest Reel</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                )}
              </button>
            </div>

            {/* Custom Focus Prompt Input */}
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Optional focus prompt (e.g., 'Focus on exact ingredient quantities & macros')"
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-card)',
                background: 'var(--bg-glass)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </form>

          {/* Processing Animated Loader State */}
          {(status === 'extracting' || status === 'analyzing') && (
            <div
              style={{
                padding: '40px 24px',
                textAlign: 'center',
                background: 'var(--bg-glass)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-glow)',
                marginBottom: '32px',
              }}
            >
              <div className="animate-pulse-glow" style={{ marginBottom: '16px', display: 'inline-block' }}>
                <Sparkles size={36} color="var(--accent-start)" />
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                {status === 'extracting' ? 'Unpacking Video & Audio Streams...' : 'Running Multimodal Reasoning via OpenRouter...'}
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Listening to audio track transcript • Reading on-screen OCR text
              </p>
            </div>
          )}

          {/* Result Dashboard Output */}
          {status === 'completed' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Result Header Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingBottom: '20px', borderBottom: '1px solid var(--border-card)' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-start)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {result.category}
                  </span>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>{result.title}</h3>
                </div>

                <button
                  onClick={handleCopy}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-card)',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-pill)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {copied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
                  <span>{copied ? 'Copied Insights!' : 'Copy Summary'}</span>
                </button>
              </div>

              {/* Viral Hook Banner */}
              <div
                style={{
                  background: 'rgba(2, 132, 199, 0.06)',
                  border: '1px solid var(--border-glow)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)', fontWeight: 700, fontSize: '14px' }}>
                  <Flame size={20} />
                  <span>Hook Score: {result.viralHook.hookEffectivenessScore}/100</span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', flex: 1, margin: 0 }}>
                  <strong>Opening Hook:</strong> {result.viralHook.hookText}
                </p>
              </div>

              {/* Navigation Tabs */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-card)', paddingBottom: '12px', flexWrap: 'wrap' }}>
                <TabButton active={activeTab === 'summary'} onClick={() => setActiveTab('summary')} icon={<Zap size={15} />} label="Overview" />
                <TabButton active={activeTab === 'takeaways'} onClick={() => setActiveTab('takeaways')} icon={<ListChecks size={15} />} label="Key Takeaways" />
                <TabButton active={activeTab === 'transcript'} onClick={() => setActiveTab('transcript')} icon={<Volume2 size={15} />} label="Audio Transcript" />
                <TabButton active={activeTab === 'checklist'} onClick={() => setActiveTab('checklist')} icon={<CheckCircle2 size={15} />} label="Action Checklist" />
              </div>

              {/* Tab Content Panels */}
              <div style={{ minHeight: '180px' }}>
                {activeTab === 'summary' && (
                  <div>
                    <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--text-primary)', marginBottom: '24px' }}>
                      {result.summary}
                    </p>

                    {/* Timestamped Moments */}
                    <h5 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} color="var(--accent-start)" />
                      <span>Timestamped Chapters:</span>
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {result.timestampedMoments.map((moment: any, idx: number) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-glass)', padding: '10px 16px', borderRadius: 'var(--radius-sm)' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-start)', background: 'var(--hero-pill-bg)', padding: '4px 8px', borderRadius: '4px' }}>
                            {moment.timestamp}
                          </span>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{moment.label}:</span>
                          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{moment.summary}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'takeaways' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {result.keyTakeaways.map((takeaway: string, idx: number) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'var(--bg-glass)', padding: '14px 18px', borderRadius: 'var(--radius-md)' }}>
                        <span style={{ color: 'var(--accent-start)', fontWeight: 800 }}>0{idx + 1}.</span>
                        <span style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.5 }}>{takeaway}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'transcript' && (
                  <div>
                    <div style={{ background: 'var(--bg-main)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)', fontSize: '15px', lineHeight: 1.7, color: 'var(--text-primary)', fontStyle: 'italic', marginBottom: '16px' }}>
                      "{result.audioAnalysis.fullTranscript}"
                    </div>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mic size={14} color="var(--accent-start)" /> Vocal Tone: <strong>{result.audioAnalysis.speakerTone}</strong>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Zap size={14} color="var(--accent-start)" /> Pace: <strong>{result.audioAnalysis.wordsPerMinute} WPM</strong>
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === 'checklist' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {result.stepByStepInstructions.map((step: any, idx: number) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-glass)', padding: '14px 18px', borderRadius: 'var(--radius-md)' }}>
                        <CheckCircle2 size={20} color="#10B981" />
                        <div>
                          <h6 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>{step.title}</h6>
                          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>{step.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 16px',
      borderRadius: 'var(--radius-pill)',
      background: active ? 'var(--accent-gradient)' : 'transparent',
      color: active ? '#FFFFFF' : 'var(--text-secondary)',
      border: 'none',
      fontSize: '13px',
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }}
  >
    {icon}
    <span>{label}</span>
  </button>
);
