'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { getDifficultyColor } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';

export default function AdminQuestionsPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        category: '',
        difficulty: 'medium',
        tags: '',
    });

    useEffect(() => {
        if (status === 'authenticated') {
            if ((session?.user as any)?.role !== 'admin') {
                router.push('/dashboard');
            } else {
                fetchQuestions();
            }
        }
    }, [status, session, router]);

    const fetchQuestions = async () => {
        try {
            const res = await fetch('/api/questions');
            const data = await res.json();
            if (data.success) {
                setQuestions(data.data);
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    tags: formData.tags.split(',').map((t) => t.trim()).filter((t) => t),
                }),
            });

            const data = await res.json();
            if (data.success) {
                setShowModal(false);
                setFormData({
                    question: '',
                    options: ['', '', '', ''],
                    correctAnswer: 0,
                    explanation: '',
                    category: '',
                    difficulty: 'medium',
                    tags: '',
                });
                fetchQuestions();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error creating question:', error);
            alert('Failed to create question');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this question?')) return;

        try {
            const res = await fetch(`/api/questions/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                fetchQuestions();
            }
        } catch (error) {
            console.error('Error deleting question:', error);
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
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 gradient-text">Question Bank</h1>
                        <p className="text-text-secondary">Manage your questions and categories</p>
                    </div>
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        <Plus size={20} className="mr-2" />
                        Add Question
                    </Button>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                    {questions.map((q: any, index: number) => (
                        <Card
                            key={q._id}
                            variant="glass"
                            hover
                            className="animate-fadeIn"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(q.difficulty)}`}>
                                            {q.difficulty}
                                        </span>
                                        <span className="text-sm text-text-secondary">{q.category}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{q.question}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                        {q.options.map((opt: string, i: number) => (
                                            <div
                                                key={i}
                                                className={`p-2 rounded ${i === q.correctAnswer ? 'bg-green-100 dark:bg-green-900/30 font-semibold' : 'bg-surface'
                                                    }`}
                                            >
                                                {i + 1}. {opt}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(q._id)}>
                                        <Trash2 size={18} className="text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Add Question Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <Card variant="default" className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-6">Add New Question</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    label="Question"
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    required
                                />

                                <div>
                                    <label className="block text-sm font-medium mb-2">Options</label>
                                    {formData.options.map((opt, i) => (
                                        <Input
                                            key={i}
                                            placeholder={`Option ${i + 1}`}
                                            value={opt}
                                            onChange={(e) => {
                                                const newOptions = [...formData.options];
                                                newOptions[i] = e.target.value;
                                                setFormData({ ...formData, options: newOptions });
                                            }}
                                            className="mb-2"
                                            required
                                        />
                                    ))}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Correct Answer</label>
                                    <select
                                        className="input"
                                        value={formData.correctAnswer}
                                        onChange={(e) => setFormData({ ...formData, correctAnswer: parseInt(e.target.value) })}
                                    >
                                        <option value={0}>Option 1</option>
                                        <option value={1}>Option 2</option>
                                        <option value={2}>Option 3</option>
                                        <option value={3}>Option 4</option>
                                    </select>
                                </div>

                                <Input
                                    label="Explanation"
                                    value={formData.explanation}
                                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                                    required
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Category"
                                        placeholder="e.g., Mathematics"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        required
                                    />

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Difficulty</label>
                                        <select
                                            className="input"
                                            value={formData.difficulty}
                                            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                        >
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </div>
                                </div>

                                <Input
                                    label="Tags (comma-separated)"
                                    placeholder="algebra, equations"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                />

                                <div className="flex gap-4 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="primary" className="flex-1">
                                        Create Question
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
