import React, { useState, useEffect } from 'react';
import { AbstractDLogo } from './Logo';
import { Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onNavigateToSummarizer: () => void;
  onNavigateToHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateToSummarizer, onNavigateToHome }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: scrolled ? '12px' : '20px',
        left: 0,
        right: 0,
        margin: '0 auto',
        width: 'calc(100% - 32px)',
        maxWidth: '1240px',
        zIndex: 100,
        padding: '10px 24px',
        borderRadius: 'var(--radius-pill)',
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--border-light)',
        boxShadow: scrolled ? '0 15px 35px -5px rgba(0, 0, 0, 0.08)' : '0 4px 20px rgba(0, 0, 0, 0.03)',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>

        {/* Brand Logo */}
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToHome?.(); }} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <AbstractDLogo size={28} textColor="#0F172A" />
        </a>

        {/* Desktop Centered Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          className="desktop-nav"
        >
          <a href="#diagram" className="header-nav-link">
            Overview
          </a>
          <a href="#features" className="header-nav-link">
            Features
          </a>
          <a href="#how-it-works" className="header-nav-link">
            How it works
          </a>
          <a href="#pricing" className="header-nav-link">
            Pricing
          </a>
          <a href="#faq" className="header-nav-link">
            FAQ
          </a>
        </nav>

        {/* Right Section: Desktop CTA + Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>

          <button
            onClick={onNavigateToSummarizer}
            className="desktop-nav font-serif"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              height: '36px',
              padding: '0 18px',
              borderRadius: '999px',
              background: '#0F172A',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '17px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FF5B22';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#0F172A';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>Digest</span>
            <ArrowRight size={14} />
          </button>

          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: '#0F172A',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(251, 251, 252, 0.98)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            zIndex: 110,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
            padding: '24px',
          }}
          className="animate-fade-in"
        >

          <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
            <AbstractDLogo size={28} textColor="#0F172A" />
          </div>

          <button 
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            <X size={28} />
          </button>

          <a href="#diagram" onClick={() => setMobileMenuOpen(false)} className="font-serif" style={mobileNavLinkStyle}>
            Overview
          </a>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="font-serif" style={mobileNavLinkStyle}>
            Features
          </a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="font-serif" style={mobileNavLinkStyle}>
            How it works
          </a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="font-serif" style={mobileNavLinkStyle}>
            Pricing
          </a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="font-serif" style={mobileNavLinkStyle}>
            FAQ
          </a>

          {/* Primary Action in Mobile Drawer */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigateToSummarizer();
            }}
            className="btn-expand-hover"
            style={{ marginTop: '16px' }}
          >
            <span className="btn-text">Digest</span>
            <div className="btn-icon-wrapper">
              <div className="btn-icon-bg"></div>
              <ArrowRight strokeWidth={2} />
            </div>
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 820px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
};

const mobileNavLinkStyle: React.CSSProperties = {
  color: 'var(--text-primary)',
  textDecoration: 'none',
  fontSize: '34px',
  fontWeight: 800,
  letterSpacing: '-0.5px',
};

