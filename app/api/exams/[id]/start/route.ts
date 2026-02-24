import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/getAuthUser';
import connectDB from '@/lib/mongodb';
import Exam from '@/models/Exam';
import TestAttempt from '@/models/TestAttempt';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authUser = getAuthUser(request);
        if (!authUser) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const exam = await Exam.findById(params.id).populate('questions');
        if (!exam) {
            return NextResponse.json({ success: false, message: 'Exam not found' }, { status: 404 });
        }

        if (!exam.isPublished) {
            return NextResponse.json({ success: false, message: 'Exam not available' }, { status: 403 });
        }

        const attempt = await TestAttempt.create({
            user: authUser.id,
            exam: exam._id,
            totalQuestions: exam.questions.length,
            answers: exam.questions.map((q: any) => ({
                questionId: q._id,
                selectedOption: -1,
                isCorrect: false,
                timeTaken: 0,
            })),
            status: 'in-progress',
        });

        return NextResponse.json({
            success: true,
            data: {
                attemptId: attempt._id,
                exam: {
                    id: exam._id,
                    title: exam.title,
                    duration: exam.duration,
                    totalMarks: exam.totalMarks,
                    questions: exam.questions,
                },
            },
        });
    } catch (error: any) {
        console.error('Error starting exam:', error);
        return NextResponse.json(
            { success: false, message: 'Server error', error: error.message },
            { status: 500 }
        );
    }
}
