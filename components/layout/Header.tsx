'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Exams', href: '#exams' },
    { label: 'Instructors', href: '#instructors' },
    { label: 'Why Us', href: '#whyus' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Free Trial', href: '#freetrial' },
];

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                transition: 'background 0.3s ease, box-shadow 0.3s ease',
                background: scrolled ? 'rgba(10,14,35,0.97)' : 'transparent',
                boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.25)' : 'none',
                backdropFilter: scrolled ? 'blur(12px)' : 'none',
            }}
        >
            <div
                style={{
                    // maxWidth: '1200px',
                    margin: '0 50px',
                    padding: '0 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '72px',
                }}
            >
                {/* Logo */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <div
                        style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #c9a84c, #f5d080)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '1.1rem',
                            color: '#0a0e23',
                            flexShrink: 0,
                            boxShadow: '0 4px 14px rgba(201,168,76,0.4)',
                        }}
                    >
                        SM
                    </div>
                    <span
                        style={{
                            fontSize: '1.35rem',
                            fontWeight: 700,
                            color: '#fff',
                            letterSpacing: '-0.3px',
                        }}
                    >
                        Smart<span style={{ color: '#c9a84c' }}>Mock</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{
                                color: 'rgba(255,255,255,0.85)',
                                textDecoration: 'none',
                                fontSize: '0.92rem',
                                fontWeight: 500,
                                letterSpacing: '0.3px',
                                transition: 'color 0.2s',
                                textTransform: 'uppercase',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a84c')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="desktop-nav">
                    <Link
                        href="/login"
                        style={{
                            color: '#c9a84c',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            padding: '0.45rem 1rem',
                            borderRadius: '6px',
                            border: '1px solid rgba(201,168,76,0.4)',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(201,168,76,0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        style={{
                            background: 'linear-gradient(135deg, #c9a84c, #f5d080)',
                            color: '#0a0e23',
                            textDecoration: 'none',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            padding: '0.5rem 1.25rem',
                            borderRadius: '6px',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(201,168,76,0.35)',
                        }}
                    >
                        Get Started
                    </Link>
                </div>

                {/* Hamburger */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'none',
                        flexDirection: 'column',
                        gap: '5px',
                        padding: '4px',
                    }}
                    aria-label="Toggle menu"
                >
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            style={{
                                display: 'block',
                                width: '26px',
                                height: '2px',
                                background: '#fff',
                                borderRadius: '2px',
                                transition: 'all 0.3s',
                            }}
                        />
                    ))}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div
                    style={{
                        background: 'rgba(10,14,35,0.98)',
                        padding: '1rem 1.5rem 1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                    }}
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            style={{
                                color: 'rgba(255,255,255,0.85)',
                                textDecoration: 'none',
                                fontSize: '1rem',
                                fontWeight: 500,
                                padding: '0.5rem 0',
                                borderBottom: '1px solid rgba(255,255,255,0.06)',
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <Link
                            href="/login"
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                padding: '0.6rem',
                                border: '1px solid rgba(201,168,76,0.5)',
                                borderRadius: '6px',
                                color: '#c9a84c',
                                textDecoration: 'none',
                                fontWeight: 600,
                            }}
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                padding: '0.6rem',
                                background: 'linear-gradient(135deg, #c9a84c, #f5d080)',
                                borderRadius: '6px',
                                color: '#0a0e23',
                                textDecoration: 'none',
                                fontWeight: 700,
                            }}
                        >
                            Register
                        </Link>
                    </div>
                </div>
            )}

            <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
        </header>
    );
}
