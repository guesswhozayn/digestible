import React, { useState, useEffect } from 'react';
import { AbstractDLogo } from './Logo';
import { ArrowUpRight, Menu, X, ArrowRight } from 'lucide-react';

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        {/* Left: Brand Logo */}
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToHome?.(); }} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <AbstractDLogo size={30} textColor="#0F172A" />
        </a>

        {/* Center: Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          className="desktop-nav"
        >
          <a href="#diagram" style={navLinkStyle}>
            Overview
          </a>
          <a href="#features" style={navLinkStyle}>
            Features
          </a>
          <a href="#how-it-works" style={navLinkStyle}>
            How it works
          </a>
          <a href="#pricing" style={navLinkStyle}>
            Pricing
          </a>
        </nav>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>



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

      {/* Full-Screen Mobile Overlay Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(251, 251, 252, 0.95)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            zIndex: 110,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '32px',
          }}
          className="animate-fade-in"
        >
          {/* Explicit Close Button inside Menu */}
          <button 
            onClick={() => setMobileMenuOpen(false)}
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
            <X size={32} />
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
          
          <div style={{ position: 'absolute', bottom: '60px', animationDelay: '0.2s' }} className="animate-fade-in">
            <AbstractDLogo size={30} textColor="#0F172A" />
          </div>
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
  color: 'var(--text-primary)',
  textDecoration: 'none',
  fontSize: '42px',
  fontWeight: 800,
  letterSpacing: '-1px',
};
