import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    // Connect to the database
    await dbConnect();
    
    // Check if the admin user exists (without returning sensitive data)
    const user = await User.findOne({ email: 'alive2154@gmail.com' });
    
    if (user) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Admin user found', 
          userExists: true,
          // Don't return the password or the entire user object for security
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: 'User not found', userExists: false },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { success: false, message: 'Database error', error: String(error) },
      { status: 500 }
    );
  }
} 