import React, { useState, useEffect } from 'react';
import { AbstractDLogo } from './Logo';
import { ArrowUpRight, Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavigateToSummarizer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateToSummarizer }) => {
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
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '1240px',
        zIndex: 100,
        padding: '12px 28px',
        borderRadius: 'var(--radius-pill)',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--border-light)',
        boxShadow: scrolled ? '0 15px 35px -5px rgba(0, 0, 0, 0.08)' : '0 4px 20px rgba(0, 0, 0, 0.03)',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left: Brand Logo */}
        <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <AbstractDLogo size={30} textColor="#0F172A" />
        </a>

        {/* Center: Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
          }}
          className="desktop-nav"
        >
          <a href="#features" style={navLinkStyle}>
            Product
          </a>
          <a href="#diagram" style={navLinkStyle}>
            Features
          </a>
          <a href="#pricing" style={navLinkStyle}>
            Pricing
          </a>
          <a href="#how-it-works" style={navLinkStyle}>
            Resources
          </a>
        </nav>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button onClick={onNavigateToSummarizer} style={{ ...navLinkStyle, background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
            Login
          </button>

          {/* Cliento Action Capsule Button -> Navigates to Summarizer Page */}
          <button onClick={onNavigateToSummarizer} className="btn-cliento">
            <span>Summarize a Reel</span>
            <div className="arrow-square">
              <ArrowUpRight size={18} />
            </div>
          </button>

          {/* Mobile Drawer Toggle */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            left: 0,
            right: 0,
            background: '#FFFFFF',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <a href="#features" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>
            Product
          </a>
          <a href="#diagram" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>
            Features
          </a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>
            Pricing
          </a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>
            Resources
          </a>
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

const navLinkStyle: React.CSSProperties = {
  color: 'var(--text-primary)',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: 500,
  transition: 'color 0.2s ease',
};

const mobileNavLinkStyle: React.CSSProperties = {
  color: '#0F172A',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 600,
};
