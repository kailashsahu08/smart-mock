'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

const stats = [
    { value: '50K+', label: 'Active Students' },
    { value: '1000+', label: 'Mock Tests' },
    { value: '95%', label: 'Success Rate' },
];

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [focusField, setFocusField] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                }),
            });
            const data = await res.json();
            if (!data.success) {
                setError(data.message || 'Registration failed');
            } else {
                router.push('/login?registered=true');
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const fieldFocus = (name: string) => ({
        borderColor: focusField === name ? '#c9a84c' : '#e5e7eb',
        boxShadow: focusField === name ? '0 0 0 3px rgba(201,168,76,0.15)' : 'none',
    });

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
                    background: 'url("https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=900&q=80") center/cover no-repeat',
                    opacity: 0.2,
                }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, rgba(10,14,35,0.55) 0%, rgba(10,14,35,0.97) 100%)',
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

                {/* Center content */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h2 style={{ fontSize: 'clamp(1.6rem,2.5vw,2.2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '1rem' }}>
                        Start your journey<br />
                        <span style={{ color: '#c9a84c' }}>to success today</span>
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', lineHeight: 1.75, marginBottom: '2rem' }}>
                        Join thousands of students who have transformed their exam preparation and achieved their dreams with SmartMock.
                    </p>

                    {/* Stats */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {stats.map((s) => (
                            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '56px', textAlign: 'center',
                                    fontSize: '1.3rem', fontWeight: 900, color: '#c9a84c', lineHeight: 1,
                                }}>
                                    {s.value}
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', borderLeft: '1px solid rgba(255,255,255,0.12)', paddingLeft: '1rem' }}>
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
                        © {new Date().getFullYear()} SmartMock. All rights reserved.
                    </p>
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
                        Already have an account?{' '}
                        <Link href="/login" style={{ color: '#c9a84c', fontWeight: 700, textDecoration: 'none' }}>
                            Log in now!
                        </Link>
                    </span>
                </div>

                {/* Decorative dots */}
                <div style={{ position: 'absolute', top: '100px', right: '60px', opacity: 0.15, pointerEvents: 'none' }}>
                    {[0, 1, 2].map((r) => (
                        <div key={r} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            {[0, 1, 2, 3, 4, 5, 6].map((c) => (
                                <div key={c} style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0a0e23' }} />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Decorative circle */}
                <div style={{
                    position: 'absolute', bottom: '-30px', right: '-30px',
                    width: '240px', height: '240px',
                    border: '2px solid rgba(10,14,35,0.07)',
                    borderRadius: '50%', pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', bottom: '30px', right: '30px',
                    width: '160px', height: '160px',
                    border: '2px solid rgba(201,168,76,0.1)',
                    borderRadius: '50%', pointerEvents: 'none',
                }} />

                {/* Form area */}
                <div style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '2rem 3rem',
                }}>
                    <div style={{ width: '100%', maxWidth: '460px' }}>
                        <p style={{ fontSize: '0.85rem', color: '#c9a84c', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                            Let&apos;s go!
                        </p>
                        <h1 style={{ fontSize: 'clamp(1.7rem,3vw,2.3rem)', fontWeight: 800, color: '#0a0e23', lineHeight: 1.2, marginBottom: '0.75rem' }}>
                            Join with our Platform
                        </h1>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.7, marginBottom: '2rem' }}>
                            Enter your details and complete some easy steps<br />
                            to register your account.
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

                            {/* Name */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.5rem' }}>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    onFocus={() => setFocusField('name')}
                                    onBlur={() => setFocusField(null)}
                                    required
                                    style={{ ...inputStyle, ...fieldFocus('name') }}
                                />
                            </div>

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
                                    style={{ ...inputStyle, ...fieldFocus('email') }}
                                />
                            </div>

                            {/* Password row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
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
                                        style={{ ...inputStyle, ...fieldFocus('password') }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.5rem' }}>
                                        Confirm
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        onFocus={() => setFocusField('confirm')}
                                        onBlur={() => setFocusField(null)}
                                        required
                                        style={{ ...inputStyle, ...fieldFocus('confirm') }}
                                    />
                                </div>
                            </div>

                            {/* Role */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.6rem' }}>
                                    I am a
                                </label>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    {['student', 'admin'].map((r) => (
                                        <label
                                            key={r}
                                            style={{
                                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                gap: '0.5rem', padding: '0.65rem', borderRadius: '8px', cursor: 'pointer',
                                                border: `1.5px solid ${formData.role === r ? '#c9a84c' : '#e5e7eb'}`,
                                                background: formData.role === r ? 'rgba(201,168,76,0.08)' : '#fff',
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="role"
                                                value={r}
                                                checked={formData.role === r}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                style={{ display: 'none' }}
                                            />
                                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: formData.role === r ? '#c9a84c' : '#6b7280', textTransform: 'capitalize' }}>
                                                {r === 'student' ? '🎓 ' : '👤 '}{r.charAt(0).toUpperCase() + r.slice(1)}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    padding: '0.9rem 1.5rem',
                                    background: isLoading ? '#a0896b' : 'linear-gradient(135deg, #c9a84c, #f5d080)',
                                    color: '#0a0e23',
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
                                    boxShadow: '0 6px 20px rgba(201,168,76,0.35)',
                                    marginTop: '0.5rem',
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid #0a0e23', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>LET&apos;S START &nbsp;→</>
                                )}
                            </button>
                        </form>

                        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem', color: '#9ca3af' }}>
                            By registering, you agree to our{' '}
                            <Link href="#" style={{ color: '#c9a84c', textDecoration: 'none', fontWeight: 600 }}>Terms of Service</Link>
                            {' '}and{' '}
                            <Link href="#" style={{ color: '#c9a84c', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link>
                        </p>

                        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#9ca3af' }}>
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
