import mongoose, { Schema, models, Document, Types } from 'mongoose';

export interface IQuestion extends Document {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    tags: string[];
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>(
    {
        question: {
            type: String,
            required: true,
            trim: true,
        },
        options: {
            type: [String],
            required: true,
            validate: {
                validator: function (v: string[]) {
                    return v.length === 4;
                },
                message: 'Question must have exactly 4 options',
            },
        },
        correctAnswer: {
            type: Number,
            required: true,
            min: 0,
            max: 3,
        },
        explanation: {
            type: String,
            required: true,
            trim: true,
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
        tags: {
            type: [String],
            default: [],
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
questionSchema.index({ category: 1, difficulty: 1 });
questionSchema.index({ tags: 1 });

const Question = models.Question || mongoose.model<IQuestion>('Question', questionSchema);

export default Question;
