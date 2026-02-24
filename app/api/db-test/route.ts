import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);
    
    // Attempt to connect
    await connectDB();
    
    // Check connection state
    const connectionState = mongoose.connection.readyState;
    const states: Record<number, string> = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
        };
    
    console.log('Connection state:', states[connectionState]);
    
    // Get database name
    const dbName = mongoose.connection.db?.databaseName;
    
    // Try to list collections
    const collections = await mongoose.connection.db?.listCollections().toArray();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful!',
      details: {
        status: states[connectionState],
        database: dbName,
        collections: collections?.map(c => c.name) || [],
        host: mongoose.connection.host,
      }
    });
  } catch (error: any) {
    console.error('MongoDB connection failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: {
        name: error.name,
        code: error.code,
        mongoUri: process.env.MONGODB_URI ? 'Set (hidden)' : 'NOT SET',
      }
    }, { status: 500 });
  }
}