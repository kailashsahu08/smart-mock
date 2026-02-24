'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useFetchUsingAuth } from '@/hooks/fetchUsingAuth';
import Navbar from '@/components/layout/Navbar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function CreateExamPage() {
    const router = useRouter();
    const { isAuthenticated, hasRole } = useAuth();
    const { post } = useFetchUsingAuth();

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: '',
        description: '',
        duration: '',
        totalMarks: '',
        passingMarks: '',
        category: '',
        difficulty: 'easy',
        instructions: '',
        isPublished: false,
    });

    // Frontend protection
    if (!isAuthenticated || !hasRole('admin')) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface">
                <h1 className="text-xl font-semibold">Unauthorized Access</h1>
            </div>
        );
    }

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await post('/api/exams', {
                ...form,
                duration: Number(form.duration),
                totalMarks: Number(form.totalMarks),
                passingMarks: Number(form.passingMarks),
            });

            const data = await res.json();

            if (!data.success) {
                alert(data.message);
                return;
            }

            alert('Exam created successfully!');
            router.push('/exams'); // redirect to list page
        } catch (error) {
            console.error('Error creating exam:', error);
            alert('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface">
            <Navbar />

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <h1 className="text-3xl font-bold mb-6 gradient-text">
                    Create New Exam
                </h1>

                <Card variant="glass" className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Title */}
                        <div>
                            <label className="label">Title</label>
                            <input
                                name="title"
                                className="input w-full"
                                value={form.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="label">Description</label>
                            <textarea
                                name="description"
                                className="input w-full"
                                rows={3}
                                value={form.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="label">Duration (minutes)</label>
                            <input
                                name="duration"
                                type="number"
                                className="input w-full"
                                value={form.duration}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Marks Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">Total Marks</label>
                                <input
                                    name="totalMarks"
                                    type="number"
                                    className="input w-full"
                                    value={form.totalMarks}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Passing Marks</label>
                                <input
                                    name="passingMarks"
                                    type="number"
                                    className="input w-full"
                                    value={form.passingMarks}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="label">Category</label>
                            <input
                                name="category"
                                className="input w-full"
                                value={form.category}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Difficulty */}
                        <div>
                            <label className="label">Difficulty</label>
                            <select
                                name="difficulty"
                                className="input w-full"
                                value={form.difficulty}
                                onChange={handleChange}
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>

                        {/* Instructions */}
                        <div>
                            <label className="label">Instructions</label>
                            <textarea
                                name="instructions"
                                className="input w-full"
                                rows={4}
                                value={form.instructions}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Publish */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="isPublished"
                                checked={form.isPublished}
                                onChange={handleChange}
                            />
                            <label>Publish immediately</label>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Exam'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}