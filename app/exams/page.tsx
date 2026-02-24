'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Clock, BookOpen, Award, Filter } from 'lucide-react';
import { getDifficultyColor } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';

export default function ExamsPage() {
    const router = useRouter();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ category: '', difficulty: '' });

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const res = await fetch('/api/exams');
            const data = await res.json();
            if (data.success) {
                setExams(data.data);
            }
        } catch (error) {
            console.error('Error fetching exams:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartExam = async (examId: string) => {
        router.push(`/exams/${examId}/start`);
    };

    const filteredExams = exams.filter((exam: any) => {
        if (filter.category && exam.category !== filter.category) return false;
        if (filter.difficulty && exam.difficulty !== filter.difficulty) return false;
        return true;
    });

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
                    <h1 className="text-4xl font-bold mb-2 gradient-text">Available Exams</h1>
                    <p className="text-text-secondary">Choose an exam and test your knowledge</p>
                </div>

                {/* Filters */}
                <Card variant="glass" className="mb-8 p-6">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <Filter size={20} className="text-text-secondary" />
                            <span className="font-medium">Filters:</span>
                        </div>
                        <select
                            className="input max-w-xs"
                            value={filter.difficulty}
                            onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
                        >
                            <option value="">All Difficulties</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                </Card>

                {/* Exams Grid */}
                {filteredExams.length === 0 ? (
                    <Card variant="default" className="text-center p-12">
                        <BookOpen size={64} className="mx-auto mb-4 text-text-muted" />
                        <h2 className="text-2xl font-bold mb-2">No Exams Available</h2>
                        <p className="text-text-secondary">Check back later for new exams</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredExams.map((exam: any, index: number) => (
                            <Card
                                key={exam._id}
                                variant="glass"
                                hover
                                className="animate-fadeIn"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(exam.difficulty)}`}>
                                            {exam.difficulty}
                                        </span>
                                        <span className="text-sm text-text-secondary">{exam.category}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{exam.title}</h3>
                                    <p className="text-text-secondary text-sm line-clamp-2">{exam.description}</p>
                                </div>

                                <div className="space-y-2 mb-4 text-sm">
                                    <div className="flex items-center text-text-secondary">
                                        <Clock size={16} className="mr-2" />
                                        <span>{exam.duration} minutes</span>
                                    </div>
                                    <div className="flex items-center text-text-secondary">
                                        <BookOpen size={16} className="mr-2" />
                                        <span>{exam.questions?.length || 0} questions</span>
                                    </div>
                                    <div className="flex items-center text-text-secondary">
                                        <Award size={16} className="mr-2" />
                                        <span>{exam.totalMarks} marks</span>
                                    </div>
                                </div>

                                <Button
                                    variant="primary"
                                    className="w-full"
                                    onClick={() => handleStartExam(exam._id)}
                                >
                                    Start Exam
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
