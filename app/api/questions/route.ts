import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const difficulty = searchParams.get('difficulty');
        const limit = parseInt(searchParams.get('limit') || '50');

        let query: any = {};
        if (category) query.category = category;
        if (difficulty) query.difficulty = difficulty;

        const questions = await Question.find(query)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name email');

        return NextResponse.json({ success: true, data: questions });
    } catch (error: any) {
        console.error('Error fetching questions:', error);
        return NextResponse.json(
            { success: false, message: 'Server error', error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { question, options, correctAnswer, explanation, category, difficulty, tags } = body;

        // Validation
        if (!question || !options || correctAnswer === undefined || !explanation || !category || !difficulty) {
            return NextResponse.json(
                { success: false, message: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        if (options.length !== 4) {
            return NextResponse.json(
                { success: false, message: 'Question must have exactly 4 options' },
                { status: 400 }
            );
        }

        await connectDB();

        const newQuestion = await Question.create({
            question,
            options,
            correctAnswer,
            explanation,
            category,
            difficulty,
            tags: tags || [],
            createdBy: (session.user as any).id,
        });

        return NextResponse.json(
            { success: true, message: 'Question created successfully', data: newQuestion },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Error creating question:', error);
        return NextResponse.json(
            { success: false, message: 'Server error', error: error.message },
            { status: 500 }
        );
    }
}
