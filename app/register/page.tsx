'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { Mail, Lock, User, UserCircle } from 'lucide-react';

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
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
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 p-4">
            <div className="w-full max-w-md animate-fadeIn">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-2">Create Account</h1>
                    <p className="text-text-secondary">Join SmartMock and start learning</p>
                </div>

                <Card variant="glass" className="backdrop-blur-xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            icon={<User size={20} />}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />

                        <Input
                            label="Email"
                            type="email"
                            placeholder="your@email.com"
                            icon={<Mail size={20} />}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            icon={<Lock size={20} />}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            icon={<Lock size={20} />}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                I am a
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={formData.role === 'student'}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">Student</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="admin"
                                        checked={formData.role === 'admin'}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">Admin</span>
                                </label>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-text-secondary">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary font-semibold hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </Card>

                <div className="mt-6 text-center">
                    <Link href="/" className="text-sm text-text-secondary hover:text-primary transition-colors">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
