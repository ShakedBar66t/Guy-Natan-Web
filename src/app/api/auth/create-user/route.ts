import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

const ADMIN_CREATION_SECRET = process.env.ADMIN_CREATION_SECRET || 'admin-secret-change-in-production';

export async function POST(req: NextRequest) {
  try {
    // Validate the request includes the correct secret
    const { name, email, password, secret } = await req.json();
    
    if (secret !== ADMIN_CREATION_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid secret' },
        { status: 401 }
      );
    }
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Create the admin user
    const user = await User.create({
      name,
      email,
      password,
      isAdmin: true
    });
    
    // Return success but don't include the password
    return NextResponse.json(
      { 
        success: true, 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create admin user' },
      { status: 500 }
    );
  }
} 