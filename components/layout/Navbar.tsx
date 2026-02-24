'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, FileText, BarChart3, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isAdmin = (session?.user as any)?.role === 'admin';

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Exams', href: '/exams', icon: BookOpen },
        { name: 'Results', href: '/results', icon: BarChart3 },
        ...(isAdmin
            ? [
                { name: 'Questions', href: '/admin/questions', icon: FileText },
                { name: 'Manage Exams', href: '/admin/exams', icon: Settings },
            ]
            : []),
    ];

    return (
        <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-lg bg-opacity-90">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">SM</span>
                        </div>
                        <span className="text-xl font-bold gradient-text hidden sm:block">SmartMock</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${isActive
                                            ? 'bg-primary text-white'
                                            : 'text-text-secondary hover:bg-surface hover:text-foreground'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-foreground">{session?.user?.name}</p>
                            <p className="text-xs text-text-secondary capitalize">{(session?.user as any)?.role}</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="flex items-center space-x-2"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-surface"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 space-y-2 animate-slideIn">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${isActive
                                            ? 'bg-primary text-white'
                                            : 'text-text-secondary hover:bg-surface hover:text-foreground'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                        <div className="border-t border-border pt-4 mt-4">
                            <div className="px-4 mb-3">
                                <p className="text-sm font-medium text-foreground">{session?.user?.name}</p>
                                <p className="text-xs text-text-secondary">{session?.user?.email}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="w-full flex items-center justify-center space-x-2"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
