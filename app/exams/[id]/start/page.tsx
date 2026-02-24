'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Clock, BookOpen, Award, AlertCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

export default function ExamStartPage() {
    const router = useRouter();
    const params = useParams();
    const [exam, setExam] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExam();
    }, []);

    const fetchExam = async () => {
        try {
            const res = await fetch(`/api/exams/${params.id}`);
            const data = await res.json();
            if (data.success) {
                setExam(data.data);
            }
        } catch (error) {
            console.error('Error fetching exam:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartExam = async () => {
        try {
            const res = await fetch(`/api/exams/${params.id}/start`, {
                method: 'POST',
            });
            const data = await res.json();
            if (data.success) {
                router.push(`/exams/${params.id}/test?attemptId=${data.data.attemptId}`);
            }
        } catch (error) {
            console.error('Error starting exam:', error);
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

    if (!exam) {
        return (
            <div className="min-h-screen bg-surface">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <Card variant="default" className="text-center p-12">
                        <h2 className="text-2xl font-bold mb-2">Exam Not Found</h2>
                        <Button variant="primary" onClick={() => router.push('/exams')}>
                            Back to Exams
                        </Button>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface">
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Card variant="glass" className="p-8 animate-fadeIn">
                    <h1 className="text-3xl font-bold mb-4 gradient-text">{exam.title}</h1>
                    <p className="text-text-secondary mb-8">{exam.description}</p>

                    {/* Exam Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                                <Clock className="text-white" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-text-secondary">Duration</p>
                                <p className="font-bold">{exam.duration} minutes</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                                <BookOpen className="text-white" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-text-secondary">Questions</p>
                                <p className="font-bold">{exam.questions?.length || 0}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center">
                                <Award className="text-white" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-text-secondary">Total Marks</p>
                                <p className="font-bold">{exam.totalMarks}</p>
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" size={24} />
                            <div>
                                <h3 className="font-bold text-lg mb-3 text-blue-900 dark:text-blue-100">Instructions</h3>
                                <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                                    {exam.instructions?.map((instruction: string, index: number) => (
                                        <li key={index} className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>{instruction}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={() => router.push('/exams')} className="flex-1">
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleStartExam} className="flex-1">
                            Start Exam
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
