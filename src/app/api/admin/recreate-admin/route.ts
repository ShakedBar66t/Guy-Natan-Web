import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// This is a protected route to reset/recreate the admin user
const ADMIN_SECRET = process.env.ADMIN_CREATION_SECRET || 'admin_secret_change_me';

export async function POST(request: NextRequest) {
  try {
    const { secret, newPassword } = await request.json();
    
    // Check if the secret matches
    if (secret !== ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Not authorized' },
        { status: 403 }
      );
    }
    
    // Connect to the database
    await dbConnect();
    
    // Check if user exists
    const existingUser = await User.findOne({ email: 'alive2154@gmail.com' });
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    if (existingUser) {
      // Update the existing user's password
      existingUser.password = hashedPassword;
      await existingUser.save();
      
      return NextResponse.json(
        { success: true, message: 'Admin password updated successfully' },
        { status: 200 }
      );
    } else {
      // Create a new admin user
      const user = await User.create({
        name: 'Guy Natan',
        email: 'alive2154@gmail.com',
        password: hashedPassword,
        isAdmin: true,
      });
      
      return NextResponse.json(
        { success: true, message: 'Admin user created successfully' },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error modifying admin user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to modify admin user', error: String(error) },
      { status: 500 }
    );
  }
} 