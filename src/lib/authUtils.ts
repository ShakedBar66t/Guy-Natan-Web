import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Server-side function to check if user is admin
export async function isAdmin() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token')?.value;
    
    if (!token) {
      return false;
    }
    
    const secretKey = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_change_me'
    );
    
    const { payload } = await jwtVerify(token, secretKey);
    
    return payload.isAdmin === true;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

// Function to get the auth token on the client
export function getAuthToken() {
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('admin_token=')) {
        return cookie.substring('admin_token='.length, cookie.length);
      }
    }
  }
  return null;
} 