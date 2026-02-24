import mongoose, { Schema, models, Document, Types } from 'mongoose';

export interface IExam extends Document {
    title: string;
    description: string;
    duration: number; // in minutes
    totalMarks: number;
    passingMarks: number;
    questions: Types.ObjectId[];
    isPublished: boolean;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    instructions: string[];
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const examSchema = new Schema<IExam>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        duration: {
            type: Number,
            required: true,
            min: 1,
        },
        totalMarks: {
            type: Number,
            required: true,
            min: 1,
        },
        passingMarks: {
            type: Number,
            required: true,
            min: 0,
        },
        questions: [{
            type: Schema.Types.ObjectId,
            ref: 'Question',
        }],
        isPublished: {
            type: Boolean,
            default: false,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            required: true,
        },
        instructions: {
            type: [String],
            default: [
                'Read all questions carefully before answering.',
                'Each question carries equal marks.',
                'There is no negative marking.',
                'Click Submit button to finish the exam.',
            ],
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

// Index for faster queries
examSchema.index({ isPublished: 1, category: 1 });
examSchema.index({ difficulty: 1 });

const Exam = models.Exam || mongoose.model<IExam>('Exam', examSchema);

export default Exam;
