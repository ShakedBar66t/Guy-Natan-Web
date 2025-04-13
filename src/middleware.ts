import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;

  // If there's no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    // Verify the token (using jose instead of jsonwebtoken for Edge compatibility)
    const secretKey = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_change_me'
    );
    
    await jwtVerify(token, secretKey);
    
    // If token is valid, continue to the page
    return NextResponse.next();
  } catch (error) {
    // If token is invalid, redirect to login
    console.error('Auth middleware error:', error);
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
} 