import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// This is a temporary route to create a custom admin user
// You should delete this file after creating the admin user

export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'alive2154@gmail.com' });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      );
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('BAR123Bar', salt);
    
    // Create the user
    const user = await User.create({
      email: 'alive2154@gmail.com',
      password: hashedPassword,
      isAdmin: true,
    });
    
    return NextResponse.json(
      { success: true, message: 'Admin user created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create admin user', error: String(error) },
      { status: 500 }
    );
  }
} 