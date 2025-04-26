import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// JWT Secret should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_me';
const JWT_EXPIRY = '7d'; // Token expires in 7 days

export async function POST(request: NextRequest) {
  try {
    console.log('Login attempt received');
    await dbConnect();
    
    const { email, password } = await request.json();
    console.log('Login attempt for email:', email);
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    console.log('User found, checking password');
    
    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password validation result:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Check if user is admin
    if (!user.isAdmin) {
      console.log('User is not an admin:', email);
      return NextResponse.json(
        { success: false, message: 'Not authorized as admin' },
        { status: 403 }
      );
    }
    
    console.log('Admin authentication successful for:', email);
    
    // Create JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
    
    console.log('JWT token created successfully');
    
    // Set the token in a HTTP-only cookie
    const response = NextResponse.json(
      { success: true, message: 'Login successful' },
      { status: 200 }
    );
    
    // Set cookie with SameSite=Lax to ensure it works across pages on the same site
    response.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/',
    });
    
    console.log('Cookie set, returning successful response');
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: String(error) },
      { status: 500 }
    );
  }
} 