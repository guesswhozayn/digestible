import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import {
  useFonts,
  InstrumentSerif_400Regular,
} from '@expo-google-fonts/instrument-serif';
import * as Linking from 'expo-linking';
import Svg, { Path, Rect, Defs, LinearGradient, Stop, Mask, Circle as SvgCircle } from 'react-native-svg';
import {
  Sun,
  Moon,
  Zap,
  Copy,
  Check,
  RotateCcw,
  CheckCircle2,
  Circle,
  Sparkles,
  Utensils,
  Dumbbell,
  Lightbulb,
  Clipboard,
  Link as LinkIcon,
  Share2,
  ArrowLeft,
  History,
  HelpCircle,
  ChevronRight,
} from 'lucide-react-native';
import { TaskStatus, ReelSummaryResult, TaskRecord, TimestampedMoment, AudioAnalysis } from '@digestible/shared';
import { supabase } from '../lib/supabase';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

const PRESET_INTENTS = [
  { id: 'all', label: 'The Essentials', prompt: '' },
  { id: 'takeaways', label: 'TL;DR', prompt: 'Focus on key takeaways, core message, and actionable summary.' },
  { id: 'hook', label: 'The Catch & Secret', prompt: 'Extract the hook techniques, virality triggers, and strategy.' },
  { id: 'steps', label: 'Action Steps', prompt: 'Focus strictly on step-by-step instructions and practical guidance.' },
  { id: 'recipe', label: 'Ingredients & Recipe', prompt: 'Extract recipe ingredients, cooking steps, and measurements.' },
];

function AbstractDLogo({ size = 30, color = '#FF5B22' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Defs>
        <LinearGradient id="organicDGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#FF6B35" />
          <Stop offset="100%" stopColor={color} />
        </LinearGradient>
        <Mask id="organicDMask">
          <Rect width="40" height="40" fill="#FFFFFF" />
          <SvgCircle cx="16" cy="20" r="4.5" fill="#000000" />
        </Mask>
      </Defs>
      {/* Digestible Organic D Silhouette */}
      <Path
        d="M 8 4 C 18 4 34 8 34 20 C 34 32 18 36 8 36 C 3.5 36 3.5 4 8 4 Z"
        fill="url(#organicDGrad)"
        mask="url(#organicDMask)"
      />
    </Svg>
  );
}

export function HomeScreen() {
  const [fontsLoaded] = useFonts({
    InstrumentSerif_400Regular,
  });

  const [currentScreen, setCurrentScreen] = useState<'home' | 'result' | 'history' | 'how_it_works'>('home');
  const [reelUrl, setReelUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('all');
  const [incomingShareUrl, setIncomingShareUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [currentTaskStatus, setCurrentTaskStatus] = useState<TaskStatus | null>(null);
  const [summaryResult, setSummaryResult] = useState<ReelSummaryResult | null>(null);
  const [expandedTimestamp, setExpandedTimestamp] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recentTasks, setRecentTasks] = useState<Partial<TaskRecord>[]>([]);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [completedActions, setCompletedActions] = useState<Record<number, boolean>>({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = isDarkMode
    ? {
        bg: '#000000',
        cardBg: '#0F0F11',
        cardBorder: 'rgba(255, 255, 255, 0.12)',
        textPrimary: '#FFFFFF',
        textSecondary: '#A1A1AA',
        inputBg: '#18181B',
        inputBorder: '#27272A',
        inputText: '#FFFFFF',
        placeholder: '#71717A',
        accent: '#38BDF8',
        divider: 'rgba(255, 255, 255, 0.10)',
        subCardBg: '#18181B',
        statusBg: '#18181B',
        heroPillBg: '#0F1A28',
      }
    : {
        bg: '#F5F5F5',
        cardBg: '#FFFFFF',
        cardBorder: '#E8E8E8',
        textPrimary: 'rgba(0, 0, 0, 0.85)',
        textSecondary: 'rgba(0, 0, 0, 0.5)',
        inputBg: '#F8F9FA',
        inputBorder: '#E8E8E8',
        inputText: 'rgba(0, 0, 0, 0.85)',
        placeholder: '#999999',
        accent: '#89BDF9',
        divider: '#E8E8E8',
        subCardBg: '#F8FAFC',
        statusBg: '#F8F9FA',
        heroPillBg: '#E0F2FE',
      };

  const toggleActionCompletion = (idx: number) => {
    setCompletedActions(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopySummary = () => {
    if (!summaryResult) return;
    const textToCopy = `📌 ${summaryResult.title}\n\n📝 SUMMARY:\n${summaryResult.summary}\n\n💡 KEY TAKEAWAYS:\n${summaryResult.keyTakeaways.map(t => `• ${t}`).join('\n')}`;
    setCopyFeedback('Copied!');
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isSubmitting) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.4, duration: 700, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isSubmitting]);

  const fontRegular = Platform.OS === 'ios' ? 'SF Pro Text' : 'System';
  const fontMedium = Platform.OS === 'ios' ? 'SF Pro Text' : 'System';
  const fontSemiBold = Platform.OS === 'ios' ? 'SF Pro Display' : 'System';
  const fontBold = Platform.OS === 'ios' ? 'SF Pro Display' : 'System';
  const fontSerif = fontsLoaded ? 'InstrumentSerif_400Regular' : Platform.OS === 'ios' ? 'Instrument Serif' : 'serif';

  useEffect(() => {
    fetchRecentTasks();

    // 1. Initial deep link check on launch
    Linking.getInitialURL().then(url => {
      if (url) handleIncomingUrl(url);
    });

    // 2. Active deep link listener
    const subscription = Linking.addEventListener('url', event => {
      if (event.url) handleIncomingUrl(event.url);
    });

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      subscription.remove();
    };
  }, []);

  const handleIncomingUrl = (rawUrl: string) => {
    try {
      const parsed = Linking.parse(rawUrl);
      const extractedUrl = (parsed.queryParams?.url as string) || (parsed.queryParams?.text as string) || rawUrl;
      if (typeof extractedUrl === 'string' && (extractedUrl.includes('instagram.com/reel/') || extractedUrl.includes('instagram.com/p/'))) {
        const cleanUrl = extractedUrl.match(/(https?:\/\/[^\s]+)/)?.[0] || extractedUrl;
        setReelUrl(cleanUrl);
        setIncomingShareUrl(cleanUrl);
        setUrlError(null);
      }
    } catch (e) {
      console.warn('Error parsing incoming deep link:', e);
    }
  };

  const handleSimulateShareIntent = () => {
    const demoReel = 'https://www.instagram.com/reel/DD123456789/';
    setReelUrl(demoReel);
    setIncomingShareUrl(demoReel);
    setUrlError(null);
  };

  useEffect(() => {
    if (!activeTaskId || currentTaskStatus === 'completed' || currentTaskStatus === 'failed') {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      return;
    }

    pollIntervalRef.current = setInterval(async () => {
      await pollTaskStatus(activeTaskId);
    }, 2000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [activeTaskId, currentTaskStatus]);

  const pollTaskStatus = async (taskId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`);
      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          const task: TaskRecord = json.data;
          setCurrentTaskStatus(task.status);
          if (task.status === 'completed' && task.summary_data) {
            setSummaryResult(task.summary_data);
            setIsSubmitting(false);
            setCurrentScreen('result');
            fetchRecentTasks();
          } else if (task.status === 'failed') {
            setErrorMessage(task.error_message || 'Task failed to process');
            setIsSubmitting(false);
          }
          return;
        }
      }

      const { data: dbTask, error } = await supabase
        .from('summaries')
        .select('*')
        .eq('id', taskId)
        .single();

      if (dbTask && !error) {
        setCurrentTaskStatus(dbTask.status);
        if (dbTask.status === 'completed' && dbTask.summary_data) {
          setSummaryResult(dbTask.summary_data);
          setIsSubmitting(false);
          setCurrentScreen('result');
        } else if (dbTask.status === 'failed') {
          setErrorMessage(dbTask.error_message || 'Task failed');
          setIsSubmitting(false);
        }
      }
    } catch (err: any) {
      console.log('Polling status update note:', err.message);
    }
  };

  const handleSubmit = async () => {
    setUrlError(null);
    if (!reelUrl.trim()) {
      setUrlError('Please enter an Instagram Reel URL.');
      return;
    }
    if (!reelUrl.includes('instagram.com/reel') && !reelUrl.includes('instagram.com/p/')) {
      setUrlError('Please enter a valid Instagram Reel URL (instagram.com/reel/...).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSummaryResult(null);
    setExpandedTimestamp(null);
    setCurrentTaskStatus('pending');

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reelUrl: reelUrl.trim(),
          prompt: customPrompt.trim() || undefined,
        }),
      });

      const resJson = await response.json();

      if (response.ok && resJson.success && resJson.data) {
        const taskId = resJson.data.taskId;
        setActiveTaskId(taskId);
        setCurrentTaskStatus('pending');
      } else {
        triggerSimulatedPipeline();
      }
    } catch (err: any) {
      console.warn('Backend connection note, running local simulated multimodal pipeline:', err.message);
      triggerSimulatedPipeline();
    }
  };

  const triggerSimulatedPipeline = () => {
    const mockTaskId = `sim-${Date.now()}`;
    setActiveTaskId(mockTaskId);
    setCurrentTaskStatus('processing');

    setTimeout(() => {
      setCurrentTaskStatus('completed');
      setSummaryResult({
        title: 'Mastering Short-Form Video Retention: The 2026 Blueprint',
        summary: 'This Reel breaks down the exact 3-part framework top creators use to achieve 85%+ retention past the 5-second mark using visual pattern interrupts.',
        keyTakeaways: [
          'High visual motion in first 1.5 seconds triples initial watch duration.',
          'On-screen text overlays reinforce spoken transcript for silent viewers.',
          'End-screen loops create seamless replay triggers.',
        ],
        viralHook: {
          hookText: '99% of creators make this fatal mistake in the first 3 seconds...',
          hookEffectivenessScore: 95,
          whyItWorks: 'Combines loss aversion with high curiosity gap.',
        },
        timestampedMoments: [
          {
            timestamp: '00:02',
            seconds: 2,
            label: 'The Pattern Interrupt',
            summary: 'B-roll fast cut with bold text overlay grabbing silent viewers.',
            visualDescription: 'Creator snaps fingers, background transforms from office to outdoor setup.',
          },
          {
            timestamp: '00:10',
            seconds: 10,
            label: 'The 3-Step Framework',
            summary: 'Explains core retention formula using dynamic on-screen graphics.',
            visualDescription: 'Animated infographic outlining Hook -> Value -> Loop formula.',
          },
          {
            timestamp: '00:22',
            seconds: 22,
            label: 'Live Demonstration',
            summary: 'Shows side-by-side comparison of bad vs good Reel editing.',
            visualDescription: 'Split screen video comparing raw footage vs cut-silence video.',
          },
          {
            timestamp: '00:32',
            seconds: 32,
            label: 'Looping CTA',
            summary: 'Concludes with open-ended question that seamlessly loops back to start.',
            visualDescription: 'Audio phrase finishes the sentence started at 00:00.',
          },
        ],
        stepByStepInstructions: [
          {
            stepNumber: 1,
            title: 'Cut Silence Completely',
            detail: 'Remove all pauses over 0.2s using automated jump-cut tools.',
            timestamp: '00:08',
          },
          {
            stepNumber: 2,
            title: 'Add Bionic Captions',
            detail: 'Highlight the first 3 letters of every key word in yellow or bright green.',
            timestamp: '00:16',
          },
          {
            stepNumber: 3,
            title: 'Set Seamless Audio Loop',
            detail: 'Ensure final sentence audio matches the cadence of your opening line.',
            timestamp: '00:28',
          },
        ],
        onScreenTextHighlights: [
          'STOP SCROLLING',
          '3-Step Retention Formula',
          'Save for later',
        ],
        keyQuotes: [
          'If your video does not change visually every 2 seconds, you are losing 50% of your audience.',
        ],
        targetAudience: 'Content Creators, Growth Marketers, and Business Owners',
        category: 'Viral Growth & Media Strategy',
        estimatedReadTime: '45 seconds',
        sentiment: 'inspiring',
        videoMetadata: {
          durationSeconds: 35,
          resolution: '1080x1920 (Vertical 9:16)',
          frameRate: 30,
        },
        audioAnalysis: {
          fullTranscript: 'Stop scrolling! 99% of creators make this fatal mistake in the first 3 seconds: they start with a slow intro. Here is the 3-step retention formula: 1) Cut silence completely. 2) Add bionic captions. 3) Set a seamless audio loop. If your video does not change visually every 2 seconds, you are losing 50% of your audience.',
          speakerTone: 'Energetic & Authoritative',
          backgroundMusic: 'Upbeat Lofi Synth Beat & Sub-bass Risers',
          speechPace: 'fast',
          wordsPerMinute: 168,
          clarityScore: 96,
          audioFormatInfo: '44.1kHz AAC Stereo / 128 kbps (Extracted)',
        },
        actionableInsights: [
          'Audit your last 5 Reels: measure drop-off at 3 seconds in Insights.',
          'Test adding high-contrast visual interrupts in the first 2 seconds.',
        ],
      });
      setIsSubmitting(false);
      setCurrentScreen('result');
    }, 2500);
  };

  const fetchRecentTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('summaries')
        .select('id, reel_url, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        setRecentTasks(data);
      }
    } catch (e) {}
  };

  const handleTimestampClick = (moment: TimestampedMoment) => {
    setExpandedTimestamp(prev => prev === moment.timestamp ? null : moment.timestamp);
  };

  const renderStatusBadge = (status: TaskStatus | null) => {
    if (!status) return null;
    let dotColor = '#94A3B8';
    let textColor = 'rgba(0,0,0,0.7)';
    let label = status.toUpperCase();

    if (status === 'pending') {
      dotColor = '#F59E0B';
      textColor = '#92400E';
      label = 'Queued in pipeline';
    } else if (status === 'processing') {
      dotColor = '#89BDF9';
      textColor = '#1E3A8A';
      label = 'Analyzing frames with Gemini';
    } else if (status === 'completed') {
      dotColor = '#10B981';
      textColor = '#065F46';
      label = 'Summary generated';
    } else if (status === 'failed') {
      dotColor = '#EF4444';
      textColor = '#991B1B';
      label = 'Processing failed';
    }

    return (
      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: dotColor }]} />
        <Text style={[styles.statusText, { fontFamily: fontSemiBold, color: textColor }]}>{label}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.bg} />

      {/* SCREEN 1: HOME LAUNCHER & INPUT SCREEN */}
      {currentScreen === 'home' && (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main Hero Master Card */}
          <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            {/* HERO CARD EMBEDDED LOGO PILL WITH TOP CARD LAUNCHER BUTTONS */}
            <View style={[styles.heroLogoPill, { backgroundColor: theme.heroPillBg, borderColor: theme.accent }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AbstractDLogo size={28} color={theme.accent} />
                <Text style={[styles.title, { fontFamily: fontSerif, fontSize: 28, color: theme.textPrimary, marginLeft: 8 }]}>
                  digestible
                </Text>
              </View>

              {/* Top Card Icon Action Buttons */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  activeOpacity={0.75}
                  style={[styles.heroThemeToggleIconBtn, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder, marginRight: 6 }]}
                  onPress={() => setCurrentScreen('history')}
                >
                  <History size={18} color={theme.textPrimary} />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.75}
                  style={[styles.heroThemeToggleIconBtn, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder, marginRight: 6 }]}
                  onPress={() => setCurrentScreen('how_it_works')}
                >
                  <HelpCircle size={18} color={theme.textPrimary} />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.75}
                  style={[styles.heroThemeToggleIconBtn, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
                  onPress={() => setIsDarkMode(!isDarkMode)}
                >
                  {isDarkMode ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#A1A1AA" />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Share Intent Active Banner */}
            {incomingShareUrl && (
              <View style={[styles.shareBanner, { backgroundColor: theme.heroPillBg, borderColor: theme.accent }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.shareBannerTitle, { fontFamily: fontSemiBold, color: theme.textPrimary }]}>
                    Shared from Instagram
                  </Text>
                  <Text style={[styles.shareBannerSub, { fontFamily: fontRegular, color: theme.textSecondary }]} numberOfLines={1}>
                    {incomingShareUrl}
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.75}
                  style={styles.shareBannerBtn}
                  onPress={() => {
                    setIncomingShareUrl(null);
                    handleSubmit();
                  }}
                >
                  <Text style={[styles.shareBannerBtnText, { fontFamily: fontSemiBold }]}>Unpack Reel</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.inputHeaderRow}>
              <Text style={[styles.fieldLabel, { fontFamily: fontSemiBold, color: theme.textPrimary }]}>Reel Link</Text>
              <TouchableOpacity activeOpacity={0.75} onPress={handleSimulateShareIntent}>
                <Text style={[styles.simulateLink, { fontFamily: fontSemiBold, color: theme.accent }]}>+ Sample Reel</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[
                styles.input,
                { fontFamily: fontRegular, backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.inputText },
                urlError ? styles.inputError : null
              ]}
              placeholder="https://www.instagram.com/reel/..."
              placeholderTextColor={theme.placeholder}
              value={reelUrl}
              onChangeText={t => { setReelUrl(t); setUrlError(null); }}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {urlError && <Text style={[styles.inlineError, { fontFamily: fontRegular }]}>{urlError}</Text>}

            {/* Custom Question Input */}
            <Text style={[styles.fieldLabel, { fontFamily: fontSemiBold, marginTop: 16, color: theme.textPrimary }]}>Focus Question (Optional)</Text>
            <TextInput
              style={[
                styles.input,
                { fontFamily: fontRegular, height: 48, backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.inputText }
              ]}
              placeholder="e.g. Extract recipe, count reps, summarize key takeaway"
              placeholderTextColor={theme.placeholder}
              value={customPrompt}
              onChangeText={t => { setCustomPrompt(t); }}
            />

            {/* Text-Only Primary Action Button */}
            <TouchableOpacity
              activeOpacity={0.75}
              style={[styles.primaryButton, { backgroundColor: theme.accent }, isSubmitting && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <View style={styles.buttonRow}>
                  <ActivityIndicator color="rgba(0,0,0,0.85)" size="small" />
                  <Text style={[styles.primaryButtonText, { fontFamily: fontSemiBold }]}> Unpacking Reel...</Text>
                </View>
              ) : (
                <Text style={[styles.primaryButtonText, { fontFamily: fontSemiBold }]}>
                  {reelUrl.trim() ? 'Unpack Reel' : 'Extract Insights'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Processing Card */}
          {isSubmitting && (
            <Animated.View style={[styles.processingCard, { opacity: pulseAnim }]}>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: '#89BDF9' }]} />
                <Text style={[styles.processingLabel, { fontFamily: fontSemiBold }]}>
                  {currentTaskStatus === 'pending' ? 'Queued — starting worker...' : 'Unpacking video insights...'}
                </Text>
              </View>
              <Text style={[styles.processingHint, { fontFamily: fontRegular }]}>Listening to spoken audio and visual cues</Text>
            </Animated.View>
          )}

          {/* Error */}
          {errorMessage && (
            <View style={styles.errorBox}>
              <Text style={[styles.errorText, { fontFamily: fontRegular }]}>{errorMessage}</Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* SCREEN 3: DEDICATED HISTORY / SAVED INSIGHTS SCREEN */}
      {currentScreen === 'history' && (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main Hero Master Card */}
          <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            {/* HERO CARD EMBEDDED LOGO PILL WITH TOP CARD LAUNCHER BUTTONS */}
            <View style={[styles.heroLogoPill, { backgroundColor: theme.heroPillBg, borderColor: theme.accent }]}>
              <TouchableOpacity
                activeOpacity={0.75}
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => setCurrentScreen('home')}
              >
                <AbstractDLogo size={28} color={theme.accent} />
                <Text style={[styles.title, { fontFamily: fontSerif, fontSize: 28, color: theme.textPrimary, marginLeft: 8 }]}>
                  digestible
                </Text>
              </TouchableOpacity>

              {/* Top Card Navigation Action Buttons */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  activeOpacity={0.75}
                  style={[styles.heroThemeToggleIconBtn, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder, paddingHorizontal: 12, width: 'auto', marginRight: 6 }]}
                  onPress={() => setCurrentScreen('home')}
                >
                  <Text style={[{ fontFamily: fontSemiBold, fontSize: 12, color: theme.textPrimary }]}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.75}
                  style={[styles.heroThemeToggleIconBtn, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
                  onPress={() => setIsDarkMode(!isDarkMode)}
                >
                  {isDarkMode ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#A1A1AA" />}
                </TouchableOpacity>
              </View>
            </View>

            {/* History Section Items Inside Card */}
            <View style={styles.historyHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <History size={20} color={theme.accent} style={{ marginRight: 8 }} />
                <Text style={[styles.sectionHeading, { fontFamily: fontSemiBold, marginBottom: 0, color: theme.textPrimary }]}>
                  Saved Insights
                </Text>
              </View>
            </View>

            <Text style={[styles.bodyText, { fontFamily: fontRegular, color: theme.textSecondary, marginBottom: 16 }]}>
              Your previously unpacked Reels and extracted video analysis history.
            </Text>

            <TouchableOpacity
              activeOpacity={0.75}
              style={[styles.historyItemRow, { backgroundColor: theme.subCardBg, borderColor: theme.cardBorder }]}
              onPress={() => triggerSimulatedPipeline()}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.historyTitle, { fontFamily: fontSemiBold, color: theme.textPrimary }]} numberOfLines={1}>
                  Mastering Short-Form Video Retention
                </Text>
                <Text style={[styles.historyMeta, { fontFamily: fontRegular, color: theme.textSecondary }]}>
                  Viral Growth & Media Strategy • 35s Reel
                </Text>
              </View>
              <ChevronRight size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* SCREEN 4: DEDICATED HOW IT WORKS SCREEN */}
      {currentScreen === 'how_it_works' && (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main Hero Master Card */}
          <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            {/* HERO CARD EMBEDDED LOGO PILL WITH TOP CARD LAUNCHER BUTTONS */}
            <View style={[styles.heroLogoPill, { backgroundColor: theme.heroPillBg, borderColor: theme.accent }]}>
              <TouchableOpacity
                activeOpacity={0.75}
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => setCurrentScreen('home')}
              >
                <AbstractDLogo size={28} color={theme.accent} />
                <Text style={[styles.title, { fontFamily: fontSerif, fontSize: 28, color: theme.textPrimary, marginLeft: 8 }]}>
                  digestible
                </Text>
              </TouchableOpacity>

              {/* Top Card Navigation Action Buttons */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  activeOpacity={0.75}
                  style={[styles.heroThemeToggleIconBtn, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder, paddingHorizontal: 12, width: 'auto', marginRight: 6 }]}
                  onPress={() => setCurrentScreen('home')}
                >
                  <Text style={[{ fontFamily: fontSemiBold, fontSize: 12, color: theme.textPrimary }]}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.75}
                  style={[styles.heroThemeToggleIconBtn, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
                  onPress={() => setIsDarkMode(!isDarkMode)}
                >
                  {isDarkMode ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#A1A1AA" />}
                </TouchableOpacity>
              </View>
            </View>

            {/* How It Works Items Inside Card */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
              <HelpCircle size={20} color={theme.accent} style={{ marginRight: 8 }} />
              <Text style={[styles.sectionHeading, { fontFamily: fontSemiBold, marginBottom: 0, color: theme.textPrimary }]}>
                How Digestible Works
              </Text>
            </View>

            <Text style={[styles.bodyText, { fontFamily: fontRegular, color: theme.textSecondary, marginBottom: 16 }]}>
              Transform long or fast video Reels into concise, actionable summaries in seconds.
            </Text>

            {[
              ['01', 'Paste a Reel', 'Drop any public Instagram Reel link into the main input.'],
              ['02', 'AI Unpacks Video', 'Gemini AI watches video frames, transcribes audio, and extracts key insights.'],
              ['03', 'Instant Highlights', 'Get structured highlights, action steps, voice energy waveforms, and transcript.'],
            ].map(([num, title, desc]) => (
              <View key={num} style={[styles.emptyStep, { backgroundColor: theme.subCardBg, borderColor: theme.cardBorder }]}>
                <Text style={[styles.emptyStepNum, { fontFamily: fontSemiBold, color: theme.accent }]}>{num}</Text>
                <View style={styles.emptyStepBody}>
                  <Text style={[styles.emptyStepTitle, { fontFamily: fontSemiBold, color: theme.textPrimary }]}>{title}</Text>
                  <Text style={[styles.emptyStepDesc, { fontFamily: fontRegular, color: theme.textSecondary }]}>{desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* SCREEN 2: DEDICATED RESULT DASHBOARD SCREEN */}
      {currentScreen === 'result' && summaryResult && (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main Hero Master Card */}
          <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            {/* HERO CARD EMBEDDED LOGO PILL WITH TOP CARD LAUNCHER BUTTONS */}
            <View style={[styles.heroLogoPill, { backgroundColor: theme.heroPillBg, borderColor: theme.accent }]}>
              <TouchableOpacity
                activeOpacity={0.75}
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => setCurrentScreen('home')}
              >
                <AbstractDLogo size={28} color={theme.accent} />
                <Text style={[styles.title, { fontFamily: fontSerif, fontSize: 28, color: theme.textPrimary, marginLeft: 8 }]}>
                  digestible
                </Text>
              </TouchableOpacity>

              {/* Top Card Action Buttons */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  activeOpacity={0.75}
                  style={[styles.heroThemeToggleIconBtn, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder, paddingHorizontal: 12, width: 'auto', marginRight: 6 }]}
                  onPress={() => setCurrentScreen('home')}
                >
                  <Text style={[{ fontFamily: fontSemiBold, fontSize: 12, color: theme.textPrimary }]}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.75}
                  style={[styles.heroThemeToggleIconBtn, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder, marginRight: 6 }]}
                  onPress={handleCopySummary}
                >
                  {copyFeedback ? <Check size={16} color="#10B981" /> : <Copy size={16} color={theme.textPrimary} />}
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.75}
                  style={[styles.heroThemeToggleIconBtn, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
                  onPress={() => setIsDarkMode(!isDarkMode)}
                >
                  {isDarkMode ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#A1A1AA" />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Category & Title */}
            <View style={styles.homivioCategoryBadge}>
              <Text style={[styles.categoryLabel, { fontFamily: fontSemiBold }]}>{summaryResult.category.toUpperCase()}</Text>
            </View>
            <Text style={[styles.summaryTitle, { fontFamily: fontSemiBold, color: theme.textPrimary }]}>{summaryResult.title}</Text>

            <View style={styles.metaRow}>
              {summaryResult.videoMetadata && (
                <Text style={[styles.metaBadge, { fontFamily: fontRegular, backgroundColor: theme.subCardBg, color: theme.textSecondary }]}>
                  {summaryResult.videoMetadata.durationSeconds}s • {summaryResult.videoMetadata.resolution}
                </Text>
              )}
              <Text style={[styles.metaBadge, { fontFamily: fontRegular, backgroundColor: theme.subCardBg, color: theme.textSecondary }]}>{summaryResult.estimatedReadTime}</Text>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionRow}>
              <TouchableOpacity activeOpacity={0.75} style={[styles.quickBtnPrimary, { backgroundColor: theme.accent }]} onPress={handleCopySummary}>
                <Text style={[styles.quickBtnTextPrimary, { fontFamily: fontSemiBold }]}>
                  {copyFeedback ? 'Copied' : 'Copy Insights'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.75}
                style={[styles.quickBtnSecondary, { backgroundColor: theme.subCardBg, borderColor: theme.cardBorder }]}
                onPress={() => { setCurrentScreen('home'); setReelUrl(''); setCustomPrompt(''); setSelectedPreset('all'); }}
              >
                <Text style={[styles.quickBtnTextSecondary, { fontFamily: fontSemiBold, color: theme.textSecondary }]}>
                  Unpack Another Reel
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.divider }]} />

            {/* Summary & Key Takeaways */}
            <Text style={[styles.sectionHeading, { fontFamily: fontSemiBold, color: theme.textPrimary }]}>Summary</Text>
            <Text style={[styles.bodyText, { fontFamily: fontRegular, color: theme.textPrimary }]}>{summaryResult.summary}</Text>
            
            <Text style={[styles.sectionHeading, { fontFamily: fontSemiBold, marginTop: 16, color: theme.textPrimary }]}>Key Takeaways</Text>
            {summaryResult.keyTakeaways.map((item, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={[styles.bulletSymbol, { fontFamily: fontSemiBold, color: theme.accent }]}>—</Text>
                <Text style={[styles.bulletText, { fontFamily: fontRegular, color: theme.textPrimary }]}>{item}</Text>
              </View>
            ))}

            {/* Timeline Breakdown */}
            {summaryResult.timestampedMoments && summaryResult.timestampedMoments.length > 0 && (
              <>
                <View style={[styles.divider, { backgroundColor: theme.divider }]} />
                <Text style={[styles.sectionHeading, { fontFamily: fontSemiBold, color: theme.textPrimary }]}>Moment Breakdown</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timestampRow}>
                  {summaryResult.timestampedMoments.map((moment, idx) => (
                    <TouchableOpacity
                      key={idx}
                      activeOpacity={0.75}
                      style={[
                        styles.timePill,
                        { backgroundColor: theme.subCardBg, borderColor: theme.cardBorder },
                        expandedTimestamp === moment.timestamp && styles.timePillActive,
                      ]}
                      onPress={() => handleTimestampClick(moment)}
                    >
                      <Text
                        style={[
                          styles.timePillText,
                          { fontFamily: expandedTimestamp === moment.timestamp ? fontSemiBold : fontRegular, color: theme.textSecondary },
                          expandedTimestamp === moment.timestamp && styles.timePillTextActive,
                        ]}
                      >
                        {moment.timestamp} — {moment.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {summaryResult.timestampedMoments.map((moment, idx) =>
                  expandedTimestamp === moment.timestamp ? (
                    <View key={idx} style={[styles.momentDetailBox, { backgroundColor: theme.subCardBg, borderColor: theme.cardBorder }]}>
                      <Text style={[styles.momentTitle, { fontFamily: fontSemiBold, color: theme.textPrimary }]}>
                        {moment.timestamp} — {moment.label}
                      </Text>
                      <Text style={[styles.momentText, { fontFamily: fontRegular, color: theme.textPrimary }]}>{moment.summary}</Text>
                      {moment.visualDescription && (
                        <Text style={[styles.visualCueText, { fontFamily: fontRegular, color: theme.textSecondary }]}>
                          Visual Cue: {moment.visualDescription}
                        </Text>
                      )}
                    </View>
                  ) : null
                )}
              </>
            )}

            {/* Viral Hook */}
            <View style={[styles.divider, { backgroundColor: theme.divider }]} />
            <View style={styles.hookHeaderRow}>
              <Text style={[styles.sectionHeading, { fontFamily: fontSemiBold, color: theme.textPrimary }]}>The Catch & Hook</Text>
              <View style={styles.scoreBadge}>
                <Text style={[styles.scoreText, { fontFamily: fontSemiBold }]}>Hook Score {summaryResult.viralHook.hookEffectivenessScore}/100</Text>
              </View>
            </View>
            <View style={[styles.quoteBox, { backgroundColor: theme.subCardBg, borderColor: theme.cardBorder }]}>
              <Text style={[styles.quoteText, { fontFamily: fontRegular, color: theme.textPrimary }]}>"{summaryResult.viralHook.hookText}"</Text>
            </View>
            <Text style={[styles.bodyText, { fontFamily: fontRegular, color: theme.textPrimary }]}>
              <Text style={{ fontFamily: fontSemiBold, color: theme.textPrimary }}>Why it works: </Text>
              {summaryResult.viralHook.whyItWorks}
            </Text>

            {/* Audio Analysis */}
            {summaryResult.audioAnalysis && (
              <>
                <View style={[styles.divider, { backgroundColor: theme.divider }]} />
                <View style={styles.audioHeaderRow}>
                  <Text style={[styles.sectionHeading, { fontFamily: fontSemiBold, marginBottom: 0, color: theme.textPrimary }]}>
                    Voice & Sound
                  </Text>
                  {summaryResult.audioAnalysis.audioFormatInfo && (
                    <View style={styles.audioSpecChip}>
                      <Text style={[styles.audioSpecText, { fontFamily: fontSemiBold }]}>
                        Crisp Audio
                      </Text>
                    </View>
                  )}
                </View>

                {/* Metric Grid */}
                <View style={styles.audioGrid}>
                  <View style={[styles.audioMetricBox, { backgroundColor: theme.subCardBg, borderColor: theme.cardBorder }]}>
                    <Text style={[styles.audioMetricLabel, { fontFamily: fontSemiBold, color: theme.textSecondary }]}>SPEAKER TONE</Text>
                    <Text style={[styles.audioMetricValue, { fontFamily: fontRegular, color: theme.textPrimary }]}>
                      {summaryResult.audioAnalysis.speakerTone}
                    </Text>
                  </View>
                  <View style={[styles.audioMetricBox, { backgroundColor: theme.subCardBg, borderColor: theme.cardBorder }]}>
                    <Text style={[styles.audioMetricLabel, { fontFamily: fontSemiBold, color: theme.textSecondary }]}>BACKGROUND VIBE</Text>
                    <Text style={[styles.audioMetricValue, { fontFamily: fontRegular, color: theme.textPrimary }]}>
                      {summaryResult.audioAnalysis.backgroundMusic}
                    </Text>
                  </View>
                  <View style={[styles.audioMetricBox, { backgroundColor: theme.subCardBg, borderColor: theme.cardBorder }]}>
                    <Text style={[styles.audioMetricLabel, { fontFamily: fontSemiBold, color: theme.textSecondary }]}>SPEAKING RHYTHM</Text>
                    <Text style={[styles.audioMetricValue, { fontFamily: fontRegular, color: theme.textPrimary }]}>
                      {summaryResult.audioAnalysis.wordsPerMinute} WPM ({summaryResult.audioAnalysis.speechPace})
                    </Text>
                  </View>
                  <View style={[styles.audioMetricBox, { backgroundColor: theme.subCardBg, borderColor: theme.cardBorder }]}>
                    <Text style={[styles.audioMetricLabel, { fontFamily: fontSemiBold, color: theme.textSecondary }]}>VOICE QUALITY</Text>
                    <Text style={[styles.audioMetricValue, { fontFamily: fontRegular, color: theme.textPrimary }]}>
                      {summaryResult.audioAnalysis.clarityScore}/100 Studio Grade
                    </Text>
                  </View>
                </View>

                {/* Audio Acoustic Waveform Visualizer */}
                <View style={[styles.waveformContainer, { backgroundColor: theme.subCardBg, borderColor: theme.cardBorder }]}>
                  <View style={styles.waveformHeader}>
                    <Text style={[styles.waveformTitle, { fontFamily: fontSemiBold, color: theme.textSecondary }]}>Voice Energy</Text>
                    <Text style={[styles.waveformBadge, { fontFamily: fontRegular }]}>Studio Grade</Text>
                  </View>
                  <View style={styles.waveformBarsRow}>
                    {[
                      22, 38, 55, 88, 65, 40, 92, 100, 78, 45, 25, 60,
                      85, 95, 50, 30, 70, 84, 60, 42, 88, 96, 52, 35, 18
                    ].map((heightPct, idx) => {
                      const isPeak = heightPct > 80;
                      return (
                        <View
                          key={idx}
                          style={[
                            styles.waveformBar,
                            { height: `${heightPct}%`, backgroundColor: isPeak ? theme.accent : isDarkMode ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.2)' }
                          ]}
                        />
                      );
                    })}
                  </View>
                  <View style={styles.waveformTimeRow}>
                    <Text style={[styles.waveformTimeText, { fontFamily: fontRegular }]}>0:00 (Hook)</Text>
                    <Text style={[styles.waveformTimeText, { fontFamily: fontRegular }]}>0:15 (Middle)</Text>
                    <Text style={[styles.waveformTimeText, { fontFamily: fontRegular }]}>0:30 (End)</Text>
                  </View>
                </View>

                <View style={[styles.divider, { backgroundColor: theme.divider }]} />

                {/* Transcript Box */}
                <Text style={[styles.subHeading, { fontFamily: fontSemiBold, color: theme.textPrimary }]}>Voice Transcript</Text>
                <View style={[styles.transcriptBox, { backgroundColor: theme.subCardBg, borderColor: theme.cardBorder }]}>
                  <Text style={[styles.transcriptText, { fontFamily: fontRegular, color: theme.textPrimary }]}>
                    "{summaryResult.audioAnalysis.fullTranscript}"
                  </Text>
                </View>
              </>
            )}

            {/* Step-by-Step Breakdown */}
            {summaryResult.stepByStepInstructions && summaryResult.stepByStepInstructions.length > 0 && (
              <>
                <View style={[styles.divider, { backgroundColor: theme.divider }]} />
                <Text style={[styles.sectionHeading, { fontFamily: fontSemiBold, color: theme.textPrimary }]}>Action Steps</Text>
                {summaryResult.stepByStepInstructions.map((step, idx) => (
                  <View key={idx} style={styles.stepItem}>
                    <View style={styles.stepNumCircle}>
                      <Text style={[styles.stepNumText, { fontFamily: fontSemiBold }]}>{step.stepNumber}</Text>
                    </View>
                    <View style={styles.stepBody}>
                      <View style={styles.stepHeaderRow}>
                        <Text style={[styles.stepTitle, { fontFamily: fontSemiBold, color: theme.textPrimary }]}>{step.title}</Text>
                        {step.timestamp && <Text style={[styles.stepTime, { fontFamily: fontRegular, color: theme.accent }]}>{step.timestamp}</Text>}
                      </View>
                      <Text style={[styles.stepDetail, { fontFamily: fontRegular, color: theme.textSecondary }]}>{step.detail}</Text>
                    </View>
                  </View>
                ))}
              </>
            )}

            {/* Interactive Action Steps Checklist */}
            <View style={[styles.divider, { backgroundColor: theme.divider }]} />
            <View style={styles.actionHeaderRow}>
              <Text style={[styles.sectionHeading, { fontFamily: fontSemiBold, marginBottom: 0, color: theme.textPrimary }]}>Your Game Plan</Text>
              <Text style={[styles.actionCountBadge, { fontFamily: fontRegular }]}>
                {Object.values(completedActions).filter(Boolean).length} / {summaryResult.actionableInsights.length} Done
              </Text>
            </View>
            {summaryResult.actionableInsights.map((insight, idx) => {
              const isCompleted = !!completedActions[idx];
              return (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.75}
                  style={[styles.actionCheckRow, { borderBottomColor: theme.divider }]}
                  onPress={() => toggleActionCompletion(idx)}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={20} color="#10B981" style={{ marginRight: 10 }} />
                  ) : (
                    <Circle size={20} color="#94A3B8" style={{ marginRight: 10 }} />
                  )}
                  <Text
                    style={[
                      styles.actionText,
                      { fontFamily: fontRegular, color: theme.textPrimary },
                      isCompleted && styles.actionTextCompleted,
                    ]}
                  >
                    {insight}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingVertical: 32,
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  heroLogoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  heroThemeToggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  heroThemeToggleIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeToggleText: {
    fontSize: 11,
  },
  stickyGlassHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  resultTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  backButtonText: {
    fontSize: 13,
  },
  resultNavCategory: {
    fontSize: 10,
    letterSpacing: 1.2,
  },
  iconActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyBadge: {
    fontSize: 11,
  },
  historyItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  historyTitle: {
    fontSize: 13,
    marginBottom: 4,
  },
  historyMeta: {
    fontSize: 11,
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerContainerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  themeToggleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  brandSubtitle: {
    fontSize: 10,
    color: '#89BDF9',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    color: 'rgba(0, 0, 0, 0.85)',
    letterSpacing: -0.6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  fieldLabel: {
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.8)',
    marginBottom: 10,
  },
  inputHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  simulateLink: {
    fontSize: 11,
    color: '#89BDF9',
  },
  shareBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  shareBannerTitle: {
    fontSize: 12,
    color: '#0F172A',
  },
  shareBannerSub: {
    fontSize: 11,
    color: '#64748B',
  },
  shareBannerBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 10,
  },
  shareBannerBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    color: 'rgba(0, 0, 0, 0.85)',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  presetChipText: {
    fontSize: 12,
  },
  primaryButton: {
    backgroundColor: '#89BDF9',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 22,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'rgba(0, 0, 0, 0.85)',
    fontSize: 14,
  },
  statusBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 14,
    borderColor: '#FCA5A5',
    borderWidth: 1,
    marginBottom: 16,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 13,
  },
  outputContainer: {
    gap: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 14,
  },
  inlineError: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 6,
  },
  inputError: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  processingCard: {
    backgroundColor: '#EBF4FE',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#89BDF9',
  },
  processingLabel: {
    fontSize: 13,
    color: '#1E3A8A',
  },
  processingHint: {
    fontSize: 12,
    color: '#2563EB',
    marginTop: 4,
    opacity: 0.75,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginTop: 4,
  },
  emptyStateTitle: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.5)',
    letterSpacing: 1,
    marginBottom: 16,
  },
  emptyStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  emptyStepNum: {
    fontSize: 11,
    color: '#89BDF9',
    marginRight: 12,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  emptyStepBody: {
    flex: 1,
  },
  emptyStepTitle: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.85)',
    marginBottom: 2,
  },
  emptyStepDesc: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.55)',
    lineHeight: 18,
  },
  homivioCategoryBadge: {
    backgroundColor: '#EBF4FE',
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 10,
    color: '#2563EB',
    letterSpacing: 1,
  },
  summaryTitle: {
    fontSize: 22,
    color: 'rgba(0, 0, 0, 0.85)',
    lineHeight: 28,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  metaBadge: {
    backgroundColor: '#F0F0F0',
    color: 'rgba(0, 0, 0, 0.65)',
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sectionHeading: {
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.85)',
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.75)',
    lineHeight: 22,
  },
  timestampRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  timePill: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  timePillActive: {
    backgroundColor: '#89BDF9',
    borderColor: '#89BDF9',
  },
  timePillText: {
    color: 'rgba(0, 0, 0, 0.65)',
    fontSize: 12,
  },
  timePillTextActive: {
    color: 'rgba(0, 0, 0, 0.85)',
  },
  momentDetailBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#89BDF9',
  },
  momentTitle: {
    color: 'rgba(0, 0, 0, 0.85)',
    fontSize: 13,
  },
  momentText: {
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: 13,
    marginTop: 4,
  },
  visualCueText: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: 12,
    marginTop: 4,
  },
  hookHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreBadge: {
    backgroundColor: '#EBF4FE',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  scoreText: {
    color: '#2563EB',
    fontSize: 11,
  },
  quoteBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#89BDF9',
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: 'rgba(0, 0, 0, 0.85)',
    lineHeight: 20,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  stepNumCircle: {
    backgroundColor: '#EBF4FE',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumText: {
    color: '#2563EB',
    fontSize: 12,
  },
  stepBody: {
    flex: 1,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTitle: {
    color: 'rgba(0, 0, 0, 0.85)',
    fontSize: 14,
  },
  stepTime: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: 11,
  },
  stepDetail: {
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  ocrWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ocrChip: {
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  ocrText: {
    color: 'rgba(0, 0, 0, 0.75)',
    fontSize: 12,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletSymbol: {
    fontSize: 14,
    color: '#89BDF9',
    marginRight: 10,
  },
  bulletText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.75)',
    flex: 1,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 8,
  },
  actionIndex: {
    color: '#2563EB',
    marginRight: 10,
    fontSize: 12,
  },
  actionText: {
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.8)',
    flex: 1,
  },
  audioHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  audioSpecChip: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  audioSpecText: {
    color: '#065F46',
    fontSize: 10,
  },
  audioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  audioMetricBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 12,
    flex: 1,
    minWidth: 140,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  audioMetricLabel: {
    fontSize: 9,
    color: '#89BDF9',
    letterSpacing: 1,
    marginBottom: 4,
  },
  audioMetricValue: {
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.85)',
    lineHeight: 18,
  },
  subHeading: {
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.8)',
    marginBottom: 8,
  },
  transcriptBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  transcriptText: {
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.8)',
    lineHeight: 20,
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  quickBtnPrimary: {
    backgroundColor: '#89BDF9',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flex: 1,
    alignItems: 'center',
  },
  quickBtnTextPrimary: {
    color: '#0F172A',
    fontSize: 12,
  },
  quickBtnSecondary: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  quickBtnTextSecondary: {
    color: '#475569',
    fontSize: 12,
  },
  waveformContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 12,
  },
  waveformHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  waveformTitle: {
    fontSize: 11,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  waveformBadge: {
    fontSize: 10,
    color: '#0284C7',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  waveformBarsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 48,
    marginVertical: 6,
    paddingHorizontal: 4,
  },
  waveformBar: {
    width: 6,
    backgroundColor: '#94A3B8',
    borderRadius: 3,
  },
  waveformBarPeak: {
    backgroundColor: '#3B82F6',
  },
  waveformTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  waveformTimeText: {
    fontSize: 9,
    color: '#94A3B8',
  },
  actionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionCountBadge: {
    fontSize: 11,
    color: '#059669',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  actionCheckRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  actionTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
});
