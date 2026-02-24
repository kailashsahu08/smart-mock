'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

/* ─── Data ─────────────────────────────────────────── */
const heroSlides = [
  {
    tag: 'India\'s #1 Mock Test Platform',
    heading: 'Excellence.\nKnowledge.\nAchievement.',
    sub: 'Prepare smarter with AI-powered mock tests, detailed analytics, and expert-curated content.',
    bg: 'linear-gradient(135deg,rgba(10,14,35,0.88),rgba(10,14,35,0.7)), url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80") center/cover no-repeat',
  },
  {
    tag: 'Trusted by 50,000+ Students',
    heading: 'Prepare.\nPractice.\nSucceed.',
    sub: 'Access thousands of questions across all major competitive exams with instant result analysis.',
    bg: 'linear-gradient(135deg,rgba(10,14,35,0.88),rgba(10,14,35,0.7)), url("https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80") center/cover no-repeat',
  },
  {
    tag: 'Real Exam Experience',
    heading: 'Focus.\nDiscipline.\nResults.',
    sub: 'Simulate actual exam conditions with timed tests, negative marking and performance insights.',
    bg: 'linear-gradient(135deg,rgba(10,14,35,0.88),rgba(10,14,35,0.7)), url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80") center/cover no-repeat',
  },
];

const examCategories = [
  { icon: '⚖️', title: 'UPSC & Civil Services', desc: 'Comprehensive tests covering Prelims, Mains, and CSAT for all UPSC aspirants.' },
  { icon: '🏦', title: 'Banking & Finance', desc: 'SBI PO, IBPS Clerk, RBI Grade B, and all banking exams with latest patterns.' },
  { icon: '🎓', title: 'Engineering Entrance', desc: 'JEE Main, JEE Advanced, BITSAT mock tests with detailed solutions.' },
  { icon: '🩺', title: 'Medical Entrance', desc: 'NEET UG, NEET PG, AIIMS — chapter-wise and full-length mock tests.' },
  { icon: '💻', title: 'IT & Technology', desc: 'GATE CS, TCS, Infosys aptitude & coding assessment mock tests.' },
  { icon: '📋', title: 'SSC & Railways', desc: 'SSC CGL, CHSL, MTS, RRB NTPC — practice with real exam patterns.' },
];

const instructors = [
  {
    name: 'Dr. Aarav Sharma',
    role: 'UPSC Expert & IAS Coach',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    desc: '12 years of experience coaching IAS aspirants. Trained 500+ successful candidates.',
  },
  {
    name: 'Priya Mehta',
    role: 'Banking & Finance Specialist',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
    desc: 'Former SBI PO with expertise in Quant, Reasoning and English sections.',
  },
  {
    name: 'Rohit Kumar',
    role: 'JEE & Engineering Expert',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
    desc: 'IIT Delhi alumnus with 8 years of JEE coaching and 1000+ top rankers.',
  },
];

const whyUs = [
  { icon: '🎯', title: 'Exam-Specific Preparation', desc: 'Tests designed by experts familiar with each exam\'s latest pattern and difficulty.' },
  { icon: '👥', title: 'Expert Faculty Team', desc: 'Learn from verified subject matter experts with proven track records.' },
  { icon: '📊', title: 'Detailed Analytics', desc: 'Topic-wise performance reports, time analysis, and improvement suggestions.' },
  { icon: '🏆', title: 'Proven Success Rate', desc: '95% of our students report significant score improvement after using SmartMock.' },
];

const stats = [
  { value: '50K+', label: 'Active Students' },
  { value: '1000+', label: 'Mock Tests' },
  { value: '95%', label: 'Success Rate' },
  { value: '6+', label: 'Exam Categories' },
];

const testimonials = [
  {
    quote: 'SmartMock helped me crack UPSC Prelims in my first attempt. The test series is spot-on with the actual exam pattern.',
    name: 'Ankit Verma',
    role: 'IAS Aspirant, Rank 47',
    img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
  },
  {
    quote: 'The banking mock tests are incredibly realistic. I cleared SBI PO and IBPS PO in the same year, thanks to SmartMock!',
    name: 'Neha Gupta',
    role: 'SBI PO, Selected 2024',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
  },
  {
    quote: 'Detailed analytics showed exactly where I was losing marks. My JEE percentile jumped from 82 to 97 in 3 months.',
    name: 'Karan Singh',
    role: 'JEE Advanced Qualifier',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
  },
];

/* ─── Helper styles ─────────────────────────────────── */
const sectionTitle = (light = false): React.CSSProperties => ({
  fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
  fontWeight: 800,
  lineHeight: 1.2,
  color: light ? '#fff' : '#0a0e23',
  marginBottom: '1rem',
});

const sectionSub = (light = false): React.CSSProperties => ({
  fontSize: '1rem',
  color: light ? 'rgba(255,255,255,0.65)' : '#6b7280',
  lineHeight: 1.75,
  maxWidth: '520px',
});

const goldDivider: React.CSSProperties = {
  display: 'inline-block',
  width: '50px',
  height: '3px',
  background: 'linear-gradient(90deg, #c9a84c, #f5d080)',
  borderRadius: '2px',
  marginBottom: '1rem',
};

/* ─── Animated Counter ──────────────────────────────── */
function Counter({ target }: { target: string }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const num = parseInt(target.replace(/\D/g, ''), 10);
          const suffix = target.replace(/[0-9]/g, '');
          let current = 0;
          const step = Math.ceil(num / 60);
          const timer = setInterval(() => {
            current = Math.min(current + step, num);
            setDisplay(`${current}${suffix}`);
            if (current >= num) clearInterval(timer);
          }, 30);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref}>{display}</div>;
}

/* ─── Page ──────────────────────────────────────────── */
export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [slide, setSlide] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // useEffect(() => {
  //   if (isAuthenticated) router.push('/dashboard');
  // }, [isAuthenticated, router]);

  useEffect(() => {
    const t = setInterval(() => setSlide((p) => (p + 1) % heroSlides.length), 5500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial((p) => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0e23' }}>
        <div className="spinner" />
      </div>
    );
  }

  const current = heroSlides[slide];

  return (
    <>
      <Header />

      <main>

        <section
          id="home"
          style={{
            minHeight: '100vh',
            background: current.bg,
            paddingTop: '72px',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            transition: 'background 1s ease',
          }}
        >
          {/* Decorative shapes */}
          <div style={{
            position: 'absolute', top: '10%', right: '8%', width: '350px', height: '350px',
            background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem', width: '100%' }}>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(201,168,76,0.15)',
                border: '1px solid rgba(201,168,76,0.35)',
                color: '#c9a84c',
                padding: '0.35rem 1rem',
                borderRadius: '50px',
                fontSize: '0.82rem',
                fontWeight: 600,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
              }}
            >
              {current.tag}
            </span>

            <h1
              style={{
                fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1,
                marginBottom: '0.7rem',
                whiteSpace: 'pre-line',
              }}
            >
              {current.heading}
            </h1>

            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(255,255,255,0.75)', maxWidth: '560px', lineHeight: 1.75, marginBottom: '2.5rem' }}>
              {current.sub}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '4rem' }}>
              <Link href="/register" style={{
                background: 'linear-gradient(135deg,#c9a84c,#f5d080)',
                color: '#0a0e23', textDecoration: 'none', fontWeight: 700,
                padding: '0.875rem 2rem', borderRadius: '8px', fontSize: '1rem',
                boxShadow: '0 8px 24px rgba(201,168,76,0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}>
                Start Free Trial
              </Link>
              <Link href="#about" style={{
                background: 'transparent', color: '#fff', textDecoration: 'none',
                fontWeight: 600, padding: '0.875rem 2rem', borderRadius: '8px',
                fontSize: '1rem', border: '2px solid rgba(255,255,255,0.3)',
                transition: 'border-color 0.2s, background 0.2s',
              }}>
                Explore More
              </Link>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem' }}>
              {stats.map((s) => (
                <div key={s.label} style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#c9a84c', lineHeight: 1 }}>
                    <Counter target={s.value} />
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Dots */}
          <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  width: slide === i ? '28px' : '10px',
                  height: '10px',
                  borderRadius: '5px',
                  background: slide === i ? '#c9a84c' : 'rgba(255,255,255,0.35)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            ABOUT SECTION
           ══════════════════════════════════════════════════ */}
        <section id="about" style={{ padding: '6rem 1.5rem', background: '#fff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            {/* Image Panel */}
            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: '16px', overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(10,14,35,0.15)',
                aspectRatio: '4/3',
              }}>
                <img
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80"
                  alt="Students studying"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              {/* Floating card */}
              <div style={{
                position: 'absolute', bottom: '-1.5rem', right: '-1.5rem',
                background: 'linear-gradient(135deg,#c9a84c,#f5d080)',
                color: '#0a0e23', borderRadius: '14px',
                padding: '1.25rem 1.5rem',
                boxShadow: '0 12px 30px rgba(201,168,76,0.4)',
                minWidth: '150px',
              }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1 }}>95%</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '0.25rem', opacity: 0.85 }}>Success Rate</div>
              </div>
            </div>

            {/* Text */}
            <div>
              <div style={goldDivider} />
              <h2 style={sectionTitle()}>About Our Platform</h2>
              <p style={{ ...sectionSub(), marginBottom: '1.25rem' }}>
                SmartMock is India&apos;s most comprehensive exam preparation platform, founded with the mission to democratize quality education. We provide carefully crafted mock tests designed by subject experts who have cracked the very exams you are preparing for.
              </p>
              <p style={{ ...sectionSub(), marginBottom: '2rem' }}>
                Our AI-powered analytics engine analyses your performance in real-time, identifies weak areas, and builds a personalized study plan — helping you prepare smarter, not harder.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                {['Expert-curated tests', 'AI performance analytics', 'Real exam simulation', 'Detailed explanations'].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#374151', fontWeight: 500 }}>
                    <span style={{ color: '#c9a84c', fontSize: '1.1rem' }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>

              <Link href="/register" style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg,#0a0e23,#1a2150)',
                color: '#c9a84c', textDecoration: 'none', fontWeight: 700,
                padding: '0.875rem 2rem', borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(10,14,35,0.2)',
              }}>
                Start For Free →
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            EXAM CATEGORIES SECTION
           ══════════════════════════════════════════════════ */}
        <section id="exams" style={{ padding: '6rem 1.5rem', background: '#f8f9ff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div style={{ ...goldDivider, display: 'block', margin: '0 auto 1rem' }} />
              <h2 style={{ ...sectionTitle(), textAlign: 'center' }}>Exam Categories</h2>
              <p style={{ ...sectionSub(), textAlign: 'center', margin: '0 auto' }}>
                Comprehensive mock test series for all major competitive exams — designed to simulate real exam conditions.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {examCategories.map((cat, i) => (
                <div
                  key={i}
                  style={{
                    background: '#fff',
                    borderRadius: '14px',
                    padding: '2rem 1.75rem',
                    boxShadow: '0 4px 20px rgba(10,14,35,0.07)',
                    border: '1px solid rgba(10,14,35,0.06)',
                    transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 16px 40px rgba(10,14,35,0.12)';
                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(10,14,35,0.07)';
                    e.currentTarget.style.borderColor = 'rgba(10,14,35,0.06)';
                  }}
                >
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(245,208,128,0.2))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.6rem', marginBottom: '1.25rem',
                    border: '1px solid rgba(201,168,76,0.2)',
                  }}>
                    {cat.icon}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0a0e23', marginBottom: '0.6rem' }}>{cat.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.7 }}>{cat.desc}</p>
                  <Link href="/register" style={{
                    display: 'inline-block', marginTop: '1.25rem',
                    color: '#c9a84c', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem',
                  }}>
                    Explore Tests →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            INSTRUCTORS SECTION
           ══════════════════════════════════════════════════ */}
        <section id="instructors" style={{ padding: '6rem 1.5rem', background: '#fff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div style={{ ...goldDivider, display: 'block', margin: '0 auto 1rem' }} />
              <h2 style={{ ...sectionTitle(), textAlign: 'center' }}>Expert Instructors</h2>
              <p style={{ ...sectionSub(), textAlign: 'center', margin: '0 auto' }}>
                Learn from the best. Our instructors are seasoned educators and industry veterans with proven results.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {instructors.map((inst, i) => (
                <div
                  key={i}
                  style={{
                    background: '#fff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 24px rgba(10,14,35,0.09)',
                    border: '1px solid rgba(10,14,35,0.06)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    textAlign: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 20px 48px rgba(10,14,35,0.14)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 24px rgba(10,14,35,0.09)';
                  }}
                >
                  {/* Photo */}
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                    <img src={inst.img} alt={inst.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(10,14,35,0.7) 0%, transparent 60%)',
                    }} />
                    {/* Social overlay icons */}
                    <div style={{
                      position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)',
                      display: 'flex', gap: '0.5rem',
                    }}>
                      {['in', 'tw'].map((s) => (
                        <div key={s} style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          background: 'rgba(201,168,76,0.9)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.7rem', fontWeight: 700, color: '#0a0e23', cursor: 'pointer',
                        }}>
                          {s === 'in' ? '💼' : '🐦'}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0a0e23', marginBottom: '0.3rem' }}>{inst.name}</h3>
                    <p style={{ color: '#c9a84c', fontSize: '0.83rem', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{inst.role}</p>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.65 }}>{inst.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            WHY US SECTION (dark bg like reference)
           ══════════════════════════════════════════════════ */}
        <section
          id="whyus"
          style={{
            padding: '6rem 1.5rem',
            background: 'linear-gradient(135deg, #0a0e23, #111a3a)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* decorative circles */}
          {[
            { top: '-80px', right: '-80px', size: '320px' },
            { bottom: '-60px', left: '-60px', size: '250px' },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: pos.size, height: pos.size,
                borderRadius: '50%',
                border: '1px solid rgba(201,168,76,0.1)',
                top: (pos as { top?: string }).top,
                bottom: (pos as { bottom?: string }).bottom,
                left: (pos as { left?: string }).left,
                right: (pos as { right?: string }).right,
                pointerEvents: 'none',
              }}
            />
          ))}

          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: '4rem', alignItems: 'center' }}>
              {/* Left */}
              <div>
                <div style={{ ...goldDivider }} />
                <h2 style={sectionTitle(true)}>Why Choose SmartMock?</h2>
                <p style={{ ...sectionSub(true), marginBottom: '2rem' }}>
                  We combine extensive question banks, expert guidance, and intelligent analytics to give you a true competitive edge.
                </p>
                <Link href="/register" style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg,#c9a84c,#f5d080)',
                  color: '#0a0e23', textDecoration: 'none', fontWeight: 700,
                  padding: '0.875rem 2rem', borderRadius: '8px',
                  boxShadow: '0 6px 20px rgba(201,168,76,0.35)',
                }}>
                  Get Started Free →
                </Link>
              </div>

              {/* Right grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                {whyUs.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      borderRadius: '14px',
                      padding: '1.5rem',
                      transition: 'background 0.3s, border-color 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(201,168,76,0.08)';
                      e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
                    }}
                  >
                    <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.825rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats strip */}
            <div style={{
              marginTop: '4rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))',
              gap: '1px',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '14px',
              overflow: 'hidden',
            }}>
              {stats.map((s) => (
                <div key={s.label} style={{
                  background: 'rgba(10,14,35,0.6)',
                  padding: '2rem 1rem',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: '#c9a84c', lineHeight: 1 }}>
                    <Counter target={s.value} />
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            TESTIMONIALS SECTION
           ══════════════════════════════════════════════════ */}
        <section id="testimonials" style={{ padding: '6rem 1.5rem', background: '#f8f9ff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div style={{ ...goldDivider, display: 'block', margin: '0 auto 1rem' }} />
              <h2 style={{ ...sectionTitle(), textAlign: 'center' }}>Student Feedback</h2>
              <p style={{ ...sectionSub(), textAlign: 'center', margin: '0 auto' }}>
                Real stories from students who transformed their exam preparation with SmartMock.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '2rem',
                    boxShadow: '0 4px 24px rgba(10,14,35,0.06)',
                    border: activeTestimonial === i ? '2px solid rgba(201,168,76,0.5)' : '2px solid transparent',
                    transition: 'border-color 0.4s, transform 0.3s',
                    transform: activeTestimonial === i ? 'translateY(-4px)' : 'none',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onClick={() => setActiveTestimonial(i)}
                >
                  {/* Quote mark */}
                  <div style={{ fontSize: '4rem', lineHeight: 0.8, color: 'rgba(201,168,76,0.25)', fontFamily: 'Georgia, serif', marginBottom: '1rem' }}>&ldquo;</div>
                  <p style={{ color: '#374151', fontSize: '0.925rem', lineHeight: 1.75, marginBottom: '1.5rem', fontStyle: 'italic' }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <img src={t.img} alt={t.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(201,168,76,0.4)' }} />
                    <div>
                      <div style={{ fontWeight: 700, color: '#0a0e23', fontSize: '0.95rem' }}>{t.name}</div>
                      <div style={{ color: '#c9a84c', fontSize: '0.78rem', fontWeight: 600 }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            FREE TRIAL CTA SECTION
           ══════════════════════════════════════════════════ */}
        <section
          id="freetrial"
          style={{
            padding: '6rem 1.5rem',
            background: 'linear-gradient(135deg,#c9a84c 0%,#f5d080 50%,#c9a84c 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* decorative */}
          <div style={{
            position: 'absolute', top: '-60px', right: '-60px',
            width: '300px', height: '300px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-80px', left: '-40px',
            width: '250px', height: '250px', borderRadius: '50%',
            background: 'rgba(10,14,35,0.07)', pointerEvents: 'none',
          }} />

          <div style={{
            maxWidth: '900px', margin: '0 auto',
            textAlign: 'center', position: 'relative',
          }}>
            <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, color: '#0a0e23', marginBottom: '1rem', lineHeight: 1.2 }}>
              Start Your Free Trial Today
            </h2>
            <p style={{ color: 'rgba(10,14,35,0.7)', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '560px', margin: '0 auto 2.5rem' }}>
              Join 50,000+ students already preparing smarter. No credit card required — access 100 free questions instantly.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/register" style={{
                background: '#0a0e23', color: '#c9a84c', textDecoration: 'none',
                fontWeight: 700, padding: '1rem 2.5rem', borderRadius: '8px',
                fontSize: '1.05rem', boxShadow: '0 8px 24px rgba(10,14,35,0.2)',
                transition: 'transform 0.2s',
              }}>
                Get Free Access →
              </Link>
              <Link href="/login" style={{
                background: 'rgba(255,255,255,0.35)', color: '#0a0e23', textDecoration: 'none',
                fontWeight: 700, padding: '1rem 2.5rem', borderRadius: '8px',
                fontSize: '1.05rem', border: '2px solid rgba(10,14,35,0.15)',
                transition: 'background 0.2s',
              }}>
                Already a member? Sign In
              </Link>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginTop: '3rem' }}>
              {['✅ No Credit Card', '✅ Instant Access', '✅ 100 Free Questions', '✅ Cancel Anytime'].map((badge) => (
                <span key={badge} style={{ color: 'rgba(10,14,35,0.75)', fontSize: '0.875rem', fontWeight: 600 }}>{badge}</span>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}