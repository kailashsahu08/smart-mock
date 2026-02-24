import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import TestAttempt from '@/models/TestAttempt';
import Question from '@/models/Question';

export async function GET(
    request: NextRequest,
    { params }: { params: { attemptId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const attempt = await TestAttempt.findById(params.attemptId)
            .populate('exam')
            .populate('user', 'name email');

        if (!attempt) {
            return NextResponse.json({ success: false, message: 'Result not found' }, { status: 404 });
        }

        // Check if user owns this attempt
        if (attempt.user._id.toString() !== (session.user as any).id) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
        }

        // Get all questions with details
        const questionIds = attempt.answers.map((a: any) => a.questionId);
        const questions = await Question.find({ _id: { $in: questionIds } });

        // Combine answers with question details
        const detailedAnswers = attempt.answers.map((answer: any) => {
            const question = questions.find((q) => q._id.toString() === answer.questionId.toString());
            return {
                ...answer.toObject(),
                question: question || null,
            };
        });

        const result = {
            ...attempt.toObject(),
            answers: detailedAnswers,
        };

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error('Error fetching result details:', error);
        return NextResponse.json(
            { success: false, message: 'Server error', error: error.message },
            { status: 500 }
        );
    }
}
