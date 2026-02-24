import mongoose, { Schema, models, Document, Types } from 'mongoose';

export interface IAnswer {
    questionId: Types.ObjectId;
    selectedOption: number;
    isCorrect: boolean;
    timeTaken: number; // in seconds
}

export interface ITestAttempt extends Document {
    user: Types.ObjectId;
    exam: Types.ObjectId;
    answers: IAnswer[];
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    skippedQuestions: number;
    percentage: number;
    startedAt: Date;
    submittedAt?: Date;
    timeTaken: number; // in seconds
    status: 'in-progress' | 'completed' | 'abandoned';
}

const answerSchema = new Schema<IAnswer>({
    questionId: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
    },
    selectedOption: {
        type: Number,
        min: -1, // -1 means not answered
        max: 3,
        default: -1,
    },
    isCorrect: {
        type: Boolean,
        default: false,
    },
    timeTaken: {
        type: Number,
        default: 0,
    },
}, { _id: false });

const testAttemptSchema = new Schema<ITestAttempt>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        exam: {
            type: Schema.Types.ObjectId,
            ref: 'Exam',
            required: true,
        },
        answers: [answerSchema],
        score: {
            type: Number,
            default: 0,
        },
        totalQuestions: {
            type: Number,
            required: true,
        },
        correctAnswers: {
            type: Number,
            default: 0,
        },
        wrongAnswers: {
            type: Number,
            default: 0,
        },
        skippedQuestions: {
            type: Number,
            default: 0,
        },
        percentage: {
            type: Number,
            default: 0,
        },
        startedAt: {
            type: Date,
            default: Date.now,
        },
        submittedAt: {
            type: Date,
        },
        timeTaken: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['in-progress', 'completed', 'abandoned'],
            default: 'in-progress',
        },
    },
    { timestamps: true }
);

// Index for faster queries
testAttemptSchema.index({ user: 1, exam: 1 });
testAttemptSchema.index({ status: 1 });

const TestAttempt = models.TestAttempt || mongoose.model<ITestAttempt>('TestAttempt', testAttemptSchema);

export default TestAttempt;
