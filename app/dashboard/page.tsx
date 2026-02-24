'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useFetchUsingAuth } from '@/hooks/fetchUsingAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { BookOpen, Trophy, TrendingUp, Clock, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
    const { user, isAuthenticated, isLoading: authLoading, hasRole } = useAuth();
    const { get } = useFetchUsingAuth();
    const router = useRouter();
    const [stats, setStats] = useState({
        totalAttempts: 0,
        averageScore: 0,
        totalExams: 0,
    });
    const [recentAttempts, setRecentAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated) {
            // Double-check localStorage before redirecting (guards against render-cycle race)
            const storedToken = localStorage.getItem('sm_auth_token');
            const storedUser = localStorage.getItem('sm_auth_user');
            if (!storedToken || !storedUser) {
                router.push('/login');
            }
            // If token IS in localStorage, AuthContext will hydrate on next render — just wait
        } else {
            fetchDashboardData();
        }
    }, [isAuthenticated, authLoading, router]);

    const fetchDashboardData = async () => {
        try {
            // Fetch results
            const resultsRes = await get('/api/results');
            const resultsData = await resultsRes.json();

            if (resultsData.success) {
                const attempts = resultsData.data;
                setRecentAttempts(attempts.slice(0, 5));

                const totalScore = attempts.reduce((sum: number, a: any) => sum + a.percentage, 0);
                setStats({
                    totalAttempts: attempts.length,
                    averageScore: attempts.length > 0 ? Math.round(totalScore / attempts.length) : 0,
                    totalExams: attempts.length,
                });
            }

            // Fetch available exams count
            const examsRes = await get('/api/exams');
            const examsData = await examsRes.json();
            if (examsData.success) {
                setStats((prev) => ({ ...prev, totalExams: examsData.data.length }));
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    const isAdmin = hasRole('admin');

    return (
        <div className="min-h-screen bg-surface">
            <div className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome back, <span className="gradient-text">{user?.name}</span>!
                    </h1>
                    <p className="text-text-secondary">
                        {isAdmin ? 'Manage your exams and questions' : 'Continue your learning journey'}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card variant="glass" hover className="animate-fadeIn">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-secondary text-sm mb-1">Tests Taken</p>
                                <p className="text-3xl font-bold">{stats.totalAttempts}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-primary rounded-full flex items-center justify-center">
                                <BookOpen className="text-white" size={28} />
                            </div>
                        </div>
                    </Card>

                    <Card variant="glass" hover className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-secondary text-sm mb-1">Average Score</p>
                                <p className="text-3xl font-bold">{stats.averageScore}%</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-secondary rounded-full flex items-center justify-center">
                                <Trophy className="text-white" size={28} />
                            </div>
                        </div>
                    </Card>

                    <Card variant="glass" hover className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-secondary text-sm mb-1">Available Exams</p>
                                <p className="text-3xl font-bold">{stats.totalExams}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-success rounded-full flex items-center justify-center">
                                <Award className="text-white" size={28} />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Card variant="gradient" className="p-8">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            {isAdmin ? 'Create New Exam' : 'Start Learning'}
                        </h2>
                        <p className="text-white/90 mb-6">
                            {isAdmin
                                ? 'Add questions and create exams for students'
                                : 'Browse available exams and test your knowledge'}
                        </p>
                        <Link href={isAdmin ? '/admin/exams/new' : '/exams'}>
                            <Button variant="outline" className="bg-white text-primary hover:bg-gray-100">
                                {isAdmin ? 'Create Exam' : 'Browse Exams'}
                                <ArrowRight className="ml-2" size={20} />
                            </Button>
                        </Link>
                    </Card>

                    <Card variant="glass" className="p-8">
                        <h2 className="text-2xl font-bold mb-4">
                            {isAdmin ? 'Question Bank' : 'View Results'}
                        </h2>
                        <p className="text-text-secondary mb-6">
                            {isAdmin
                                ? 'Manage your question bank and categories'
                                : 'Check your performance and track progress'}
                        </p>
                        <Link href={isAdmin ? '/admin/questions' : '/results'}>
                            <Button variant="primary">
                                {isAdmin ? 'Manage Questions' : 'View Results'}
                                <ArrowRight className="ml-2" size={20} />
                            </Button>
                        </Link>
                    </Card>
                </div>

                {/* Recent Activity */}
                {!isAdmin && recentAttempts.length > 0 && (
                    <Card variant="default" className="animate-fadeIn">
                        <h2 className="text-2xl font-bold mb-6">Recent Test Attempts</h2>
                        <div className="space-y-4">
                            {recentAttempts.map((attempt: any) => (
                                <div
                                    key={attempt._id}
                                    className="flex items-center justify-between p-4 bg-surface rounded-lg hover:bg-border transition-colors"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg">{attempt.exam?.title}</h3>
                                        <p className="text-sm text-text-secondary">
                                            {formatDate(attempt.submittedAt)}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-primary">{Math.round(attempt.percentage)}%</p>
                                            <p className="text-xs text-text-secondary">
                                                {attempt.correctAnswers}/{attempt.totalQuestions} correct
                                            </p>
                                        </div>
                                        <Link href={`/results/${attempt._id}`}>
                                            <Button variant="outline" size="sm">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
