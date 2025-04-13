import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Create a response that will clear the admin_token cookie
  const response = NextResponse.json(
    { success: true, message: 'Logged out successfully' },
    { status: 200 }
  );
  
  // Get cookie store and clear the admin_token cookie
  const cookieStore = await cookies();
  
  // Clear the cookie by setting its expiration to a past date
  response.cookies.set({
    name: 'admin_token',
    value: '',
    expires: new Date(0),
    path: '/',
  });
  
  console.log('Admin token cookie cleared');
  return response;
} 