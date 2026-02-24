'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentBg, setCurrentBg] = useState(0);

  // Background images array - using gradient overlays for a professional look
  const backgrounds = [
    'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1)), url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80")',
    'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(239, 68, 68, 0.1)), url("https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80")',
    'linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(59, 130, 246, 0.1)), url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80")',
    'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1)), url("https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1920&q=80")',
  ];

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  // Auto-change background every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: backgrounds[currentBg],
            animation: 'fadeIn 1s ease-in-out',
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20">
        <div className="flex items-center justify-between mx-20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SM
              </span>
            </div>
            <span className="text-2xl font-bold text-white hidden sm:block">SmartMock</span>
          </div>

          <div className="hidden md:flex items-center space-x-8 gap-6 text-white">
            <Link href="#features" className="hover:text-white/80 transition-colors">
              Features
            </Link>
            <Link href="#about" className="hover:text-white/80 transition-colors">
              About
            </Link>
            <Link href="/login" className="hover:text-white/80 transition-colors">
              Login
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="md:hidden">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="sm" className="bg-white text-indigo-600 hover:bg-white/90 border-0">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 px-4 flex items-center min-h-[calc(100vh-88px)] mx-20">
        <div className=" text-center lg:text-left lg:mx-0 py-12 lg:py-0">
          {/* Main Heading */}
          <div className="mb-8 animate-fadeIn">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight mb-6">
              Excellence.
              <br />
              Knowledge.
              <br />
              Achievement.
            </h1>
          </div>

          {/* Subtitle */}
          <div className="mb-10 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl sm:text-2xl lg:text-3xl text-white/90  leading-relaxed">
              As a comprehensive learning platform, we empower you in every phase of your educational journey
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <Link href="/register">
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-indigo-600 hover:bg-white/90 border-0 px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-xl transition-all"
              >
                Start Learning Now
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent text-white border-2 border-white hover:bg-white/10 px-8 py-6 text-lg font-semibold"
              >
                Sign In
              </Button>
            </Link>
          </div>

          {/* Stats or Features */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
            <div className="text-center lg:text-left">
              <div className="text-4xl font-bold text-white mb-2">1000+</div>
              <div className="text-white/80 text-sm">Questions</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-white/80 text-sm">Mock Tests</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-white/80 text-sm">Success Rate</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/80 text-sm">Access</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Indicators */}
      <div className="absolute bottom-8 right-8 z-20 flex space-x-2">
        {backgrounds.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBg(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentBg === index ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'
              }`}
            aria-label={`Background ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce hidden lg:block">
        <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
}