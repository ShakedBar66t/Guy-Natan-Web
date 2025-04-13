import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// This should be secured with a secret token in a production environment
const ADMIN_SECRET = process.env.ADMIN_CREATION_SECRET || 'admin_secret_change_me';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { name, email, password, secret } = await request.json();
    
    // Verify the secret token before allowing admin creation
    if (secret !== ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to create admin' },
        { status: 403 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      );
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: true, // Always create as admin with this endpoint
    });
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Admin user created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: String(error) },
      { status: 500 }
    );
  }
} 