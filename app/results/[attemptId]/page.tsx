'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Trophy, Clock, CheckCircle, XCircle, MinusCircle, ArrowLeft, Award } from 'lucide-react';
import { formatDate, formatTime, getScoreColor } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';

export default function ResultDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResult();
    }, []);

    const fetchResult = async () => {
        try {
            const res = await fetch(`/api/results/${params.attemptId}`);
            const data = await res.json();
            if (data.success) {
                setResult(data.data);
            }
        } catch (error) {
            console.error('Error fetching result:', error);
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

    if (!result) {
        return (
            <div className="min-h-screen bg-surface">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <Card variant="default" className="text-center p-12">
                        <h2 className="text-2xl font-bold mb-2">Result Not Found</h2>
                        <Button variant="primary" onClick={() => router.push('/results')}>
                            Back to Results
                        </Button>
                    </Card>
                </div>
            </div>
        );
    }

    const isPassed = result.percentage >= ((result.exam?.passingMarks / result.exam?.totalMarks) * 100);

    return (
        <div className="min-h-screen bg-surface">
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Back Button */}
                <Button variant="ghost" onClick={() => router.push('/results')} className="mb-6">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Results
                </Button>

                {/* Score Card */}
                <Card variant="gradient" className="text-center p-12 mb-8 animate-fadeIn">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
                        {isPassed ? (
                            <Trophy className="text-yellow-500" size={40} />
                        ) : (
                            <Award className="text-gray-500" size={40} />
                        )}
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        {isPassed ? 'Congratulations!' : 'Keep Practicing!'}
                    </h1>
                    <p className="text-white/90 mb-6">{result.exam?.title}</p>
                    <div className="text-7xl font-bold text-white mb-4">
                        {Math.round(result.percentage)}%
                    </div>
                    <p className="text-white/90 text-lg">
                        You scored {result.score} out of {result.exam?.totalMarks} marks
                    </p>
                </Card>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card variant="glass" className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mb-3">
                            <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
                        </div>
                        <p className="text-3xl font-bold mb-1">{result.correctAnswers}</p>
                        <p className="text-sm text-text-secondary">Correct</p>
                    </Card>

                    <Card variant="glass" className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full mb-3">
                            <XCircle className="text-red-600 dark:text-red-400" size={24} />
                        </div>
                        <p className="text-3xl font-bold mb-1">{result.wrongAnswers}</p>
                        <p className="text-sm text-text-secondary">Wrong</p>
                    </Card>

                    <Card variant="glass" className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-3">
                            <MinusCircle className="text-yellow-600 dark:text-yellow-400" size={24} />
                        </div>
                        <p className="text-3xl font-bold mb-1">{result.skippedQuestions}</p>
                        <p className="text-sm text-text-secondary">Skipped</p>
                    </Card>

                    <Card variant="glass" className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-3">
                            <Clock className="text-blue-600 dark:text-blue-400" size={24} />
                        </div>
                        <p className="text-3xl font-bold mb-1">{formatTime(result.timeTaken)}</p>
                        <p className="text-sm text-text-secondary">Time Taken</p>
                    </Card>
                </div>

                {/* Question Review */}
                <Card variant="default" className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Question Review</h2>
                    <div className="space-y-6">
                        {result.answers?.map((answer: any, index: number) => {
                            const question = answer.question;
                            if (!question) return null;

                            const isCorrect = answer.isCorrect;
                            const wasAnswered = answer.selectedOption !== -1;

                            return (
                                <div
                                    key={index}
                                    className={`p-6 rounded-lg border-2 ${isCorrect
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                                            : wasAnswered
                                                ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
                                                : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="font-bold text-lg flex-1">
                                            {index + 1}. {question.question}
                                        </h3>
                                        <div className="flex items-center space-x-2">
                                            {isCorrect ? (
                                                <CheckCircle className="text-green-600" size={24} />
                                            ) : wasAnswered ? (
                                                <XCircle className="text-red-600" size={24} />
                                            ) : (
                                                <MinusCircle className="text-yellow-600" size={24} />
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        {question.options?.map((option: string, optIndex: number) => {
                                            const isSelected = answer.selectedOption === optIndex;
                                            const isCorrectOption = question.correctAnswer === optIndex;

                                            return (
                                                <div
                                                    key={optIndex}
                                                    className={`p-3 rounded-lg ${isCorrectOption
                                                            ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
                                                            : isSelected
                                                                ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500'
                                                                : 'bg-surface'
                                                        }`}
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        {isCorrectOption && <CheckCircle className="text-green-600" size={16} />}
                                                        {isSelected && !isCorrectOption && <XCircle className="text-red-600" size={16} />}
                                                        <span className={isCorrectOption || isSelected ? 'font-semibold' : ''}>
                                                            {option}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {question.explanation && (
                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                                Explanation:
                                            </p>
                                            <p className="text-sm text-blue-800 dark:text-blue-200">{question.explanation}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8">
                    <Button variant="outline" onClick={() => router.push('/results')} className="flex-1">
                        Back to Results
                    </Button>
                    <Button variant="primary" onClick={() => router.push('/exams')} className="flex-1">
                        Take Another Exam
                    </Button>
                </div>
            </div>
        </div>
    );
}
