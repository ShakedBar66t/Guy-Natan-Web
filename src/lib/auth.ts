import { JWTPayload, jwtVerify } from 'jose';

interface TokenClaims extends JWTPayload {
  isAdmin: boolean;
  userId: string;
}

export async function verifyTokenWithClaims(token: string): Promise<TokenClaims> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');
    
    const { payload } = await jwtVerify(token, secret);
    
    return {
      isAdmin: payload.isAdmin as boolean,
      userId: payload.sub as string,
      ...payload
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return {
      isAdmin: false,
      userId: '',
      exp: 0,
      iat: 0
    };
  }
} 