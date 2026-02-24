import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TestAttempt from '@/models/TestAttempt';
import Question from '@/models/Question';
import { getAuthUser } from '@/lib/getAuthUser';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ attemptId: string }> }
) {
    const { attemptId } = await params;
    try {
        const authUser = await getAuthUser(request);
        if (!authUser) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const attempt = await TestAttempt.findById(attemptId)
            .populate('exam')
            .populate('user', 'name email');

        if (!attempt) {
            return NextResponse.json({ success: false, message: 'Result not found' }, { status: 404 });
        }

        if (attempt.user._id.toString() !== authUser.id) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
        }

        const questionIds = attempt.answers.map((a: any) => a.questionId);
        const questions = await Question.find({ _id: { $in: questionIds } });

        const detailedAnswers = attempt.answers.map((answer: any) => {
            const question = questions.find((q) => q._id.toString() === answer.questionId.toString());
            return { ...answer.toObject(), question: question || null };
        });

        return NextResponse.json({ success: true, data: { ...attempt.toObject(), answers: detailedAnswers } });
    } catch (error: any) {
        console.error('Error fetching result details:', error);
        return NextResponse.json(
            { success: false, message: 'Server error', error: error.message },
            { status: 500 }
        );
    }
}
