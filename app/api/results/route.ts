import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TestAttempt from '@/models/TestAttempt';
import { getAuthUser } from '@/lib/getAuthUser';

export async function GET(request: NextRequest) {
    try {
        const authUser = await getAuthUser(request);
        if (!authUser) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const attempts = await TestAttempt.find({
            user: authUser.id,
            status: 'completed',
        })
            .populate('exam', 'title category difficulty')
            .sort({ submittedAt: -1 });

        return NextResponse.json({ success: true, data: attempts });
    } catch (error: any) {
        console.error('Error fetching results:', error);
        return NextResponse.json(
            { success: false, message: 'Server error', error: error.message },
            { status: 500 }
        );
    }
}
