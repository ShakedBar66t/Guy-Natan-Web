import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    await dbConnect();
    
    return NextResponse.json(
      { success: true, message: 'Connected to MongoDB successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to connect to MongoDB', error: String(error) },
      { status: 500 }
    );
  }
} 