import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Exam from '@/models/Exam';
import { getAuthUser } from '@/lib/getAuthUser';

export async function GET(request: NextRequest) {
    try {
        const authUser = await getAuthUser(request);
        console.log(authUser);
        if (!authUser) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        console.log('[GET /api/exams] Verified:', authUser.email, '| Role:', authUser.role);

        await connectDB();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const difficulty = searchParams.get('difficulty');

        let query: any = {};

        if (authUser.role === 'student') {
            query.isPublished = true;
        }

        if (category) query.category = category;
        if (difficulty) query.difficulty = difficulty;

        const exams = await Exam.find(query)
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name email')
            .select('-questions');

        return NextResponse.json({ success: true, data: exams });
    } catch (error: any) {
        console.error('Error fetching exams:', error);
        return NextResponse.json(
            { success: false, message: 'Server error', error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const authUser = await getAuthUser(request);
        console.log(authUser);
        if (!authUser || authUser.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, duration, totalMarks, passingMarks, questions, category, difficulty, instructions, isPublished } = body;

        if (!title || !description || !duration || !totalMarks || !passingMarks || !category || !difficulty) {
            return NextResponse.json(
                { success: false, message: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        await connectDB();

        const newExam = await Exam.create({
            title, description, duration, totalMarks, passingMarks,
            questions: questions || [],
            category, difficulty, instructions,
            isPublished: isPublished || false,
            createdBy: authUser.id,
        });

        return NextResponse.json(
            { success: true, message: 'Exam created successfully', data: newExam },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Error creating exam:', error);
        return NextResponse.json(
            { success: false, message: 'Server error', error: error.message },
            { status: 500 }
        );
    }
}