'use client';

import Link from 'next/link';

const footerLinks = {
    'Quick Links': [
        { label: 'Home', href: '#home' },
        { label: 'About Us', href: '#about' },
        { label: 'Exam Categories', href: '#exams' },
        { label: 'Our Instructors', href: '#instructors' },
        { label: 'Why Choose Us', href: '#whyus' },
    ],
    'Exam Categories': [
        { label: 'Competitive Exams', href: '#exams' },
        { label: 'Government Jobs', href: '#exams' },
        { label: 'Engineering Entrance', href: '#exams' },
        { label: 'Medical Entrance', href: '#exams' },
        { label: 'Banking & Finance', href: '#exams' },
    ],
    'Resources': [
        { label: 'Blog', href: '/blog' },
        { label: 'Study Material', href: '/resources' },
        { label: 'Practice Tests', href: '/dashboard' },
        { label: 'FAQs', href: '#' },
        { label: 'Privacy Policy', href: '#' },
    ],
};

const recentPosts = [
    'Top 5 strategies for cracking competitive exams',
    'How mock tests boost your confidence',
    'Time management tips for exam day',
];

export default function Footer() {
    return (
        <footer
            style={{
                background: 'linear-gradient(180deg, #0a0e23 0%, #060810 100%)',
                color: '#fff',
                paddingTop: '4rem',
                borderTop: '1px solid rgba(201,168,76,0.15)',
            }}
        >
            <div
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 1.5rem',
                }}
            >
                {/* Top Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '2.5rem',
                        paddingBottom: '3rem',
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                    }}
                >
                    {/* Brand Column */}
                    <div>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '1.25rem' }}>
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #c9a84c, #f5d080)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 800,
                                    fontSize: '1rem',
                                    color: '#0a0e23',
                                    flexShrink: 0,
                                }}
                            >
                                SM
                            </div>
                            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                                Smart<span style={{ color: '#c9a84c' }}>Mock</span>
                            </span>
                        </Link>
                        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', lineHeight: 1.8 }}>
                            India&apos;s leading mock test platform. Prepare smarter, score higher, and achieve your dreams with our comprehensive exam preparation tools.
                        </p>

                        {/* Contact Info */}
                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {[
                                { icon: '📍', text: '12 Education Hub, Bhopal, MP 462001' },
                                { icon: '📞', text: '+91 98765 43210' },
                                { icon: '✉️', text: 'support@smartmock.in' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>
                                    <span>{item.icon}</span>
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Link Columns */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4
                                style={{
                                    fontSize: '0.95rem',
                                    fontWeight: 700,
                                    color: '#c9a84c',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    marginBottom: '1.25rem',
                                }}
                            >
                                {title}
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            style={{
                                                color: 'rgba(255,255,255,0.55)',
                                                textDecoration: 'none',
                                                fontSize: '0.875rem',
                                                transition: 'color 0.2s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a84c')}
                                            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                                        >
                                            <span style={{ color: '#c9a84c', fontSize: '0.7rem' }}>▶</span>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Blog Posts */}
                    <div>
                        <h4
                            style={{
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                color: '#c9a84c',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                marginBottom: '1.25rem',
                            }}
                        >
                            Blog Posts
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {recentPosts.map((post, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    style={{
                                        color: 'rgba(255,255,255,0.65)',
                                        textDecoration: 'none',
                                        fontSize: '0.85rem',
                                        lineHeight: 1.6,
                                        padding: '0.5rem 0',
                                        borderBottom: '1px solid rgba(255,255,255,0.07)',
                                        transition: 'color 0.2s',
                                        display: 'block',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a84c')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                                >
                                    {post}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        padding: '1.5rem 0',
                    }}
                >
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', margin: 0 }}>
                        &copy; {new Date().getFullYear()} SmartMock. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {['Privacy Policy', 'Terms of Service'].map((item) => (
                            <Link
                                key={item}
                                href="#"
                                style={{
                                    color: 'rgba(255,255,255,0.4)',
                                    textDecoration: 'none',
                                    fontSize: '0.82rem',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a84c')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
