'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/* ── Testimonials cycling on left panel ── */
const testimonials = [
    {
        quote: 'SmartMock helped me crack UPSC Prelims in my first attempt. The analytics are incredibly detailed.',
        name: 'Ankit Verma',
        role: 'IAS Officer, Rank 47',
    },
    {
        quote: 'The banking mock tests perfectly simulate the actual exam. I cleared SBI PO and IBPS PO in the same year!',
        name: 'Neha Gupta',
        role: 'SBI PO, Batch 2024',
    },
    {
        quote: 'My JEE percentile jumped from 82 to 97 in just 3 months of practicing on SmartMock.',
        name: 'Karan Singh',
        role: 'JEE Advanced Qualifier',
    },
];

/* ── Shared input style ── */
const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.875rem 1rem',
    border: '1.5px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '0.95rem',
    color: '#111827',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    background: '#fff',
};

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tIdx, setTIdx] = useState(0);
    const [focusField, setFocusField] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });
            if (result?.error) {
                setError(result.error);
            } else {
                router.push('/dashboard');
                router.refresh();
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Geist', -apple-system, sans-serif" }}>

            {/* ── LEFT PANEL ── */}
            <div
                style={{
                    width: '38%',
                    minWidth: '320px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '2.5rem',
                    background: '#0a0e23',
                }}
                className="left-panel"
            >
                {/* BG image with overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=80") center/cover no-repeat',
                    opacity: 0.25,
                }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, rgba(10,14,35,0.6) 0%, rgba(10,14,35,0.95) 100%)',
                }} />

                {/* Logo */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        <div style={{
                            width: '38px', height: '38px', borderRadius: '9px',
                            background: 'linear-gradient(135deg, #c9a84c, #f5d080)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 800, fontSize: '0.95rem', color: '#0a0e23',
                        }}>
                            SM
                        </div>
                        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                            Smart<span style={{ color: '#c9a84c' }}>Mock</span>
                        </span>
                    </Link>
                </div>

                {/* Testimonial */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                    {/* Big quote mark */}
                    <div style={{ fontSize: '5rem', color: '#c9a84c', lineHeight: 0.8, fontFamily: 'Georgia, serif', marginBottom: '1.5rem', opacity: 0.7 }}>
                        &ldquo;
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                        {testimonials[tIdx].quote}
                    </p>
                    <div>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.92rem' }}>{testimonials[tIdx].name}</div>
                        <div style={{ color: '#c9a84c', fontSize: '0.78rem', fontWeight: 600 }}>{testimonials[tIdx].role}</div>
                    </div>

                    {/* Dots */}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '1.25rem' }}>
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setTIdx(i)}
                                aria-label={`Testimonial ${i + 1}`}
                                style={{
                                    width: tIdx === i ? '24px' : '8px',
                                    height: '8px',
                                    borderRadius: '4px',
                                    background: tIdx === i ? '#c9a84c' : 'rgba(255,255,255,0.3)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    transition: 'all 0.3s',
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Bottom badges */}
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                    {['🏆 Top Rated', '✅ Trusted', '🎓 Expert Faculty', '📊 Analytics'].map((b) => (
                        <span key={b} style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', fontWeight: 500 }}>{b}</span>
                    ))}
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#fafafa',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Top-right link */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1.75rem 2.5rem 0' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Don&apos;t have an account?{' '}
                        <Link href="/register" style={{ color: '#c9a84c', fontWeight: 700, textDecoration: 'none' }}>
                            Register now!
                        </Link>
                    </span>
                </div>

                {/* Decorative dots */}
                <div style={{ position: 'absolute', top: '120px', right: '80px', opacity: 0.18, pointerEvents: 'none' }}>
                    {[0, 1, 2].map((r) => (
                        <div key={r} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            {[0, 1, 2, 3, 4, 5, 6].map((c) => (
                                <div key={c} style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0a0e23' }} />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Decorative curl */}
                <div style={{
                    position: 'absolute', bottom: '-20px', right: '-20px',
                    width: '220px', height: '220px',
                    border: '2px solid rgba(10,14,35,0.08)',
                    borderRadius: '50%', pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', bottom: '20px', right: '20px',
                    width: '150px', height: '150px',
                    border: '2px solid rgba(201,168,76,0.12)',
                    borderRadius: '50%', pointerEvents: 'none',
                }} />

                {/* Form area */}
                <div style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '2rem 3rem',
                }}>
                    <div style={{ width: '100%', maxWidth: '440px' }}>
                        <p style={{ fontSize: '0.85rem', color: '#c9a84c', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                            Welcome back!
                        </p>
                        <h1 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, color: '#0a0e23', lineHeight: 1.2, marginBottom: '0.75rem' }}>
                            Sign in to your<br />Account
                        </h1>
                        <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.7, marginBottom: '2.25rem' }}>
                            Enter your credentials to access your dashboard,<br />
                            mock tests and performance analytics.
                        </p>

                        {/* Error */}
                        {error && (
                            <div style={{
                                padding: '0.75rem 1rem', borderRadius: '8px',
                                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                                color: '#dc2626', fontSize: '0.875rem', marginBottom: '1.25rem',
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                            {/* Email */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.5rem' }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="example@domain.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    onFocus={() => setFocusField('email')}
                                    onBlur={() => setFocusField(null)}
                                    required
                                    style={{
                                        ...inputStyle,
                                        borderColor: focusField === 'email' ? '#c9a84c' : '#e5e7eb',
                                        boxShadow: focusField === 'email' ? '0 0 0 3px rgba(201,168,76,0.15)' : 'none',
                                    }}
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.5rem' }}>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    onFocus={() => setFocusField('password')}
                                    onBlur={() => setFocusField(null)}
                                    required
                                    style={{
                                        ...inputStyle,
                                        borderColor: focusField === 'password' ? '#c9a84c' : '#e5e7eb',
                                        boxShadow: focusField === 'password' ? '0 0 0 3px rgba(201,168,76,0.15)' : 'none',
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Link href="#" style={{ fontSize: '0.82rem', color: '#c9a84c', fontWeight: 600, textDecoration: 'none' }}>
                                    Forgot Password?
                                </Link>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    padding: '0.9rem 1.5rem',
                                    background: isLoading ? '#a0896b' : 'linear-gradient(135deg, #0a0e23, #1a2150)',
                                    color: '#c9a84c',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.95rem',
                                    fontWeight: 700,
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    letterSpacing: '0.5px',
                                    boxShadow: '0 4px 16px rgba(10,14,35,0.2)',
                                    marginTop: '0.5rem',
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid #c9a84c', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                        Signing in...
                                    </>
                                ) : (
                                    <>SIGN IN &nbsp;→</>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.75rem 0' }}>
                            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                            <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>or continue with</span>
                            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                        </div>

                        {/* Social buttons */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            {[{ icon: '🔵', label: 'Google' }, { icon: '🔗', label: 'LinkedIn' }].map((s) => (
                                <button key={s.label} style={{
                                    padding: '0.7rem', borderRadius: '8px', border: '1.5px solid #e5e7eb',
                                    background: '#fff', cursor: 'pointer', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                    fontSize: '0.875rem', color: '#374151', fontWeight: 600,
                                    transition: 'border-color 0.2s',
                                }}>
                                    <span>{s.icon}</span> {s.label}
                                </button>
                            ))}
                        </div>

                        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: '#9ca3af' }}>
                            <Link href="/" style={{ color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>
                                ← Back to home
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .left-panel { display: none !important; } }
      `}</style>
        </div>
    );
}
