import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HubDiagram } from './components/HubDiagram';
import { BentoGrid } from './components/BentoGrid';
import { HowItWorks } from './components/HowItWorks';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { SummarizerPage } from './components/SummarizerPage';
import { LegalPage } from './components/LegalPage';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'summarizer' | 'terms' | 'privacy' | 'security'>('landing');

  const goToSummarizer = () => {
    setCurrentView('summarizer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToLanding = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToLegal = (type: 'terms' | 'privacy' | 'security') => {
    setCurrentView(type);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)', position: 'relative' }}>

      {currentView === 'landing' && (
        <Navbar onNavigateToSummarizer={goToSummarizer} onNavigateToHome={goToLanding} />
      )}

      {currentView === 'summarizer' && (
        <SummarizerPage onBackToLanding={goToLanding} />
      )}

      {(currentView === 'terms' || currentView === 'privacy' || currentView === 'security') && (
        <LegalPage onBackToHome={goToLanding} type={currentView} />
      )}

      {currentView === 'landing' && (
        <>
          <main>
            <Hero onNavigateToSummarizer={goToSummarizer} />
            <HubDiagram />
            <BentoGrid />
            <HowItWorks />
            <Pricing onNavigateToSummarizer={goToSummarizer} />
            <FAQ />
          </main>
          <Footer onNavigateToSummarizer={goToSummarizer} onNavigateToLegal={goToLegal} />
        </>
      )}
    </div>
  );
};
