'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Trophy, Clock, CheckCircle, XCircle, MinusCircle, Eye } from 'lucide-react';
import { formatDate, getScoreColor } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';

export default function ResultsPage() {
    const router = useRouter();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const res = await fetch('/api/results');
            const data = await res.json();
            if (data.success) {
                setResults(data.data);
            }
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-surface">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 gradient-text">Test Results</h1>
                    <p className="text-text-secondary">View your performance and track your progress</p>
                </div>

                {results.length === 0 ? (
                    <Card variant="default" className="text-center p-12">
                        <Trophy size={64} className="mx-auto mb-4 text-text-muted" />
                        <h2 className="text-2xl font-bold mb-2">No Results Yet</h2>
                        <p className="text-text-secondary mb-6">Take an exam to see your results here</p>
                        <Button variant="primary" onClick={() => router.push('/exams')}>
                            Browse Exams
                        </Button>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {results.map((result: any, index: number) => (
                            <Card
                                key={result._id}
                                variant="glass"
                                hover
                                className="animate-fadeIn"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                    {/* Exam Info */}
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold mb-2">{result.exam?.title}</h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                                            <div className="flex items-center">
                                                <Clock size={16} className="mr-2" />
                                                <span>{formatDate(result.submittedAt)}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <CheckCircle size={16} className="mr-2 text-green-500" />
                                                <span>{result.correctAnswers} Correct</span>
                                            </div>
                                            <div className="flex items-center">
                                                <XCircle size={16} className="mr-2 text-red-500" />
                                                <span>{result.wrongAnswers} Wrong</span>
                                            </div>
                                            <div className="flex items-center">
                                                <MinusCircle size={16} className="mr-2 text-yellow-500" />
                                                <span>{result.skippedQuestions} Skipped</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Score */}
                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <div className={`text-5xl font-bold ${getScoreColor(result.percentage)}`}>
                                                {Math.round(result.percentage)}%
                                            </div>
                                            <p className="text-sm text-text-secondary mt-1">
                                                {result.score}/{result.exam?.totalMarks || 0} marks
                                            </p>
                                        </div>

                                        <Button
                                            variant="primary"
                                            onClick={() => router.push(`/results/${result._id}`)}
                                        >
                                            <Eye size={20} className="mr-2" />
                                            View Details
                                        </Button>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-6">
                                    <div className="w-full bg-surface rounded-full h-3 overflow-hidden">
                                        <div
                                            className="bg-gradient-primary h-full transition-all duration-500 rounded-full"
                                            style={{ width: `${result.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
