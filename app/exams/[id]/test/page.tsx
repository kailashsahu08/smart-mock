'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Clock, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { formatTime } from '@/lib/utils';

export default function TestPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const attemptId = searchParams.get('attemptId');

    const [exam, setExam] = useState<any>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<any[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (attemptId) {
            fetchAttempt();
        }
    }, [attemptId]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    const fetchAttempt = async () => {
        try {
            const res = await fetch(`/api/attempts/${attemptId}`);
            const data = await res.json();
            if (data.success) {
                const attempt = data.data;
                setAnswers(attempt.answers);

                // Fetch exam details
                const examRes = await fetch(`/api/exams/${params.id}`);
                const examData = await examRes.json();
                if (examData.success) {
                    setExam(examData.data);
                    setTimeLeft(examData.data.duration * 60);
                }
            }
        } catch (error) {
            console.error('Error fetching attempt:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (optionIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = {
            ...newAnswers[currentQuestion],
            selectedOption: optionIndex,
        };
        setAnswers(newAnswers);

        // Auto-save progress
        saveProgress(newAnswers);
    };

    const saveProgress = async (updatedAnswers: any[]) => {
        try {
            await fetch(`/api/attempts/${attemptId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answers: updatedAnswers,
                    timeTaken: (exam.duration * 60) - timeLeft,
                }),
            });
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    };

    const handleSubmit = async () => {
        if (!confirm('Are you sure you want to submit the exam?')) return;

        try {
            const res = await fetch(`/api/attempts/${attemptId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answers,
                    timeTaken: (exam.duration * 60) - timeLeft,
                }),
            });

            const data = await res.json();
            if (data.success) {
                router.push(`/results/${attemptId}`);
            }
        } catch (error) {
            console.error('Error submitting exam:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!exam || !answers.length) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface">
                <Card variant="default" className="text-center p-12">
                    <h2 className="text-2xl font-bold mb-2">Exam Not Found</h2>
                    <Button variant="primary" onClick={() => router.push('/exams')}>
                        Back to Exams
                    </Button>
                </Card>
            </div>
        );
    }

    const question = exam.questions[currentQuestion];
    const currentAnswer = answers[currentQuestion];

    return (
        <div className="min-h-screen bg-surface">
            {/* Header */}
            <div className="bg-card border-b border-border sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold">{exam.title}</h1>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-primary rounded-lg text-white">
                                <Clock size={20} />
                                <span className="font-bold text-lg">{formatTime(timeLeft)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Question Navigation */}
                    <div className="lg:col-span-1">
                        <Card variant="glass" className="sticky top-24">
                            <h3 className="font-bold mb-4">Questions</h3>
                            <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                                {exam.questions.map((_: any, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentQuestion(index)}
                                        className={`w-10 h-10 rounded-lg font-semibold transition-all ${index === currentQuestion
                                                ? 'bg-primary text-white'
                                                : answers[index]?.selectedOption !== -1
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-surface hover:bg-border'
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-6 space-y-2 text-sm">
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                                    <span>Answered</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-surface border border-border rounded"></div>
                                    <span>Not Answered</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Question Content */}
                    <div className="lg:col-span-3">
                        <Card variant="default" className="mb-6">
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm text-text-secondary">
                                        Question {currentQuestion + 1} of {exam.questions.length}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold mb-6">{question.question}</h2>
                            </div>

                            <div className="space-y-3">
                                {question.options.map((option: string, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(index)}
                                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${currentAnswer?.selectedOption === index
                                                ? 'border-primary bg-primary/10'
                                                : 'border-border hover:border-primary/50 hover:bg-surface'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${currentAnswer?.selectedOption === index
                                                        ? 'border-primary bg-primary'
                                                        : 'border-border'
                                                    }`}
                                            >
                                                {currentAnswer?.selectedOption === index && (
                                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                                )}
                                            </div>
                                            <span className="font-medium">{option}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </Card>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                disabled={currentQuestion === 0}
                            >
                                <ChevronLeft size={20} className="mr-2" />
                                Previous
                            </Button>

                            {currentQuestion === exam.questions.length - 1 ? (
                                <Button variant="primary" onClick={handleSubmit}>
                                    Submit Exam
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    onClick={() => setCurrentQuestion(Math.min(exam.questions.length - 1, currentQuestion + 1))}
                                >
                                    Next
                                    <ChevronRight size={20} className="ml-2" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
