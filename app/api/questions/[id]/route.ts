import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';

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
        const question = await Question.findById(params.id).populate('createdBy', 'name email');

        if (!question) {
            return NextResponse.json({ success: false, message: 'Question not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: question });
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

        const question = await Question.findByIdAndUpdate(params.id, body, { new: true });

        if (!question) {
            return NextResponse.json({ success: false, message: 'Question not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Question updated', data: question });
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
        const question = await Question.findByIdAndDelete(params.id);

        if (!question) {
            return NextResponse.json({ success: false, message: 'Question not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Question deleted' });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: 'Server error', error: error.message },
            { status: 500 }
        );
    }
}
