import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HubDiagram } from './components/HubDiagram';
import { BentoGrid } from './components/BentoGrid';
import { MobileAppShowcase } from './components/MobileAppShowcase';
import { HowItWorks } from './components/HowItWorks';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { SummarizerPage } from './components/SummarizerPage';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'summarizer'>('landing');

  const goToSummarizer = () => {
    setCurrentView('summarizer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToLanding = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'summarizer') {
    return <SummarizerPage onBackToLanding={goToLanding} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)', position: 'relative' }}>
      {/* Top Navigation */}
      <Navbar onNavigateToSummarizer={goToSummarizer} />

      {/* Main Landing Sections */}
      <main>
        <Hero onNavigateToSummarizer={goToSummarizer} />
        <HubDiagram />
        <BentoGrid />
        <MobileAppShowcase />
        <HowItWorks />
        <Pricing onNavigateToSummarizer={goToSummarizer} />
        <FAQ />
      </main>

      {/* Editorial Footer */}
      <Footer onNavigateToSummarizer={goToSummarizer} />
    </div>
  );
};
