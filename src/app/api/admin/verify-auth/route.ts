import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    console.log('Verify auth request received');
    
    // Get the token from the request cookies - must be awaited in Next.js 14
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    
    if (!token) {
      console.log('No admin_token cookie found');
      return NextResponse.json({ isAdmin: false }, { status: 200 });
    }
    
    console.log('Admin token found, verifying...');
    
    // Verify the token
    const secretKey = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_change_me'
    );
    
    const { payload } = await jwtVerify(token, secretKey);
    
    // Check if the user is an admin
    const isAdmin = payload.isAdmin === true;
    
    console.log('Token verification result: isAdmin =', isAdmin);
    
    return NextResponse.json({ isAdmin }, { status: 200 });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ isAdmin: false }, { status: 200 });
  }
} 