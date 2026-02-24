import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Exam from '@/models/Exam';

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

        let query: any = {};

        // Students can only see published exams
        if ((session.user as any).role === 'student') {
            query.isPublished = true;
        }

        if (category) query.category = category;
        if (difficulty) query.difficulty = difficulty;

        const exams = await Exam.find(query)
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name email')
            .select('-questions'); // Don't send questions in list view

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
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            title,
            description,
            duration,
            totalMarks,
            passingMarks,
            questions,
            category,
            difficulty,
            instructions,
            isPublished,
        } = body;

        // Validation
        if (!title || !description || !duration || !totalMarks || !passingMarks || !category || !difficulty) {
            return NextResponse.json(
                { success: false, message: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        await connectDB();

        const newExam = await Exam.create({
            title,
            description,
            duration,
            totalMarks,
            passingMarks,
            questions: questions || [],
            category,
            difficulty,
            instructions,
            isPublished: isPublished || false,
            createdBy: (session.user as any).id,
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
