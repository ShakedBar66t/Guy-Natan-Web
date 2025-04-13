import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// This should be secured with a secret token in a production environment
const ADMIN_SECRET = process.env.ADMIN_CREATION_SECRET || 'admin_secret_change_me';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { email, password, secret } = await request.json();
    
    // Verify the secret token before allowing password reset
    if (secret !== ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to reset password' },
        { status: 403 }
      );
    }
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Update the user's password
    user.password = hashedPassword;
    await user.save();
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Password reset successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: String(error) },
      { status: 500 }
    );
  }
} 