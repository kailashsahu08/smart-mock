import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TestAttempt from '@/models/TestAttempt';
import Question from '@/models/Question';
import { getAuthUser } from '@/lib/getAuthUser';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authUser = await getAuthUser(request);
        if (!authUser) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const attempt = await TestAttempt.findById(params.id)
            .populate('exam')
            .populate('user', 'name email');

        if (!attempt) {
            return NextResponse.json({ success: false, message: 'Attempt not found' }, { status: 404 });
        }

        if (attempt.user._id.toString() !== authUser.id) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
        }

        return NextResponse.json({ success: true, data: attempt });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: 'Server error', error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authUser = await getAuthUser(request);
        if (!authUser) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { answers, timeTaken } = body;

        await connectDB();

        const attempt = await TestAttempt.findById(params.id);
        if (!attempt) {
            return NextResponse.json({ success: false, message: 'Attempt not found' }, { status: 404 });
        }

        if (attempt.user.toString() !== authUser.id) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
        }

        attempt.answers = answers;
        attempt.timeTaken = timeTaken || attempt.timeTaken;
        await attempt.save();

        return NextResponse.json({ success: true, message: 'Progress saved', data: attempt });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: 'Server error', error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authUser = await getAuthUser(request);


        if (!authUser) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { answers, timeTaken } = body;

        await connectDB();

        const attempt = await TestAttempt.findById(params.id).populate('exam');
        if (!attempt) {
            return NextResponse.json({ success: false, message: 'Attempt not found' }, { status: 404 });
        }

        if (attempt.user.toString() !== authUser.id) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
        }

        const questionIds = answers.map((a: any) => a.questionId);
        const questions = await Question.find({ _id: { $in: questionIds } });

        let correctAnswers = 0, wrongAnswers = 0, skippedQuestions = 0;

        const updatedAnswers = answers.map((answer: any) => {
            const question = questions.find((q) => q._id.toString() === answer.questionId.toString());
            if (!question) return answer;
            const isCorrect = question.correctAnswer === answer.selectedOption;
            if (answer.selectedOption === -1) skippedQuestions++;
            else if (isCorrect) correctAnswers++;
            else wrongAnswers++;
            return { ...answer, isCorrect };
        });

        const totalQuestions = answers.length;
        const marksPerQuestion = (attempt.exam as any).totalMarks / totalQuestions;
        const score = correctAnswers * marksPerQuestion;
        const percentage = (correctAnswers / totalQuestions) * 100;

        attempt.answers = updatedAnswers;
        attempt.score = score;
        attempt.correctAnswers = correctAnswers;
        attempt.wrongAnswers = wrongAnswers;
        attempt.skippedQuestions = skippedQuestions;
        attempt.percentage = percentage;
        attempt.timeTaken = timeTaken;
        attempt.submittedAt = new Date();
        attempt.status = 'completed';

        await attempt.save();

        return NextResponse.json({
            success: true,
            message: 'Exam submitted successfully',
            data: { attemptId: attempt._id, score, percentage, correctAnswers, wrongAnswers, skippedQuestions },
        });
    } catch (error: any) {
        console.error('Error submitting exam:', error);
        return NextResponse.json(
            { success: false, message: 'Server error', error: error.message },
            { status: 500 }
        );
    }
}
