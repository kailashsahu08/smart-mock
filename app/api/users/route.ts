import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// GET: Fetch all users
export async function GET() {
  try {
    await connectDB();
    const users = await User.find({});
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST: Create a new user
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const user = await User.create(body);
    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 400 }
    );
  }
}