import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Exam from '@/models/Exam';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const exam = await Exam.findById(params.id)
            .populate('questions')
            .populate('createdBy', 'name email');

        if (!exam) {
            return NextResponse.json({ success: false, message: 'Exam not found' }, { status: 404 });
        }

        // Students can only access published exams
        if ((session.user as any).role === 'student' && !exam.isPublished) {
            return NextResponse.json({ success: false, message: 'Exam not available' }, { status: 403 });
        }

        return NextResponse.json({ success: true, data: exam });
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
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        await connectDB();

        const exam = await Exam.findByIdAndUpdate(params.id, body, { new: true });

        if (!exam) {
            return NextResponse.json({ success: false, message: 'Exam not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Exam updated', data: exam });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: 'Server error', error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const exam = await Exam.findByIdAndDelete(params.id);

        if (!exam) {
            return NextResponse.json({ success: false, message: 'Exam not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Exam deleted' });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: 'Server error', error: error.message },
            { status: 500 }
        );
    }
}
