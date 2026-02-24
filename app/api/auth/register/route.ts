import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'smartmock-secret-key';

export async function POST(request: NextRequest) {
    try {
        const { name, email, password, role } = await request.json();

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, message: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { success: false, message: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: 'User with this email already exists' },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(password);
        const userRole = role || 'student';

        // Pre-generate _id so we can sign the JWT BEFORE creating the document
        const userId = new mongoose.Types.ObjectId();

        // Generate JWT using the pre-generated _id
        const token = jwt.sign(
            {
                id: userId.toString(),
                name,
                email,
                role: userRole,
                avatar: '',
                bio: '',
                age: undefined,
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Single DB write — token is stored atomically with the user document
        const user = await User.create({
            _id: userId,
            name,
            email,
            password: hashedPassword,
            role: userRole,
            token,
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Registration successful',
                token,
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar || '',
                    bio: user.bio || '',
                    age: user.age,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { success: false, message: 'Server error', error: error.message },
            { status: 500 }
        );
    }
}
