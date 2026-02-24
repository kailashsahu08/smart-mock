import mongoose, { Schema, models, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'student';
  avatar?: string;
  bio?: string;
  age?: number;
  token?: string;
  tokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Don't include password by default in queries
    },
    role: {
      type: String,
      enum: ['admin', 'student'],
      default: 'student',
      required: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    age: {
      type: Number,
    },
    token: {
      type: String,
    },
    tokenExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model<IUser>('User', userSchema);

export default User;