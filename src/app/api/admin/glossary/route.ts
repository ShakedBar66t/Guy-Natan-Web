import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FinancialTerm from '@/models/FinancialTerm';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { customAlphabet } from 'nanoid';

// Create a custom ID generator with only alphanumeric characters
const generateSlug = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);

// Middleware to check if the user is an admin
async function isAdmin() {
  try {
    const cookieStore = await cookies();
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
    console.error('Admin verification error:', error);
    return false;
  }
}

// GET all financial terms for admin (including unpublished ones)
export async function GET() {
  try {
    // Check if user is admin
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    // Fetch all terms, ordered by order field and term
    const terms = await FinancialTerm.find()
      .sort({ order: 1, term: 1 })
      .lean();
    
    return NextResponse.json(terms);
  } catch (error) {
    console.error('Error fetching financial terms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch financial terms' },
      { status: 500 }
    );
  }
}

// POST create a new financial term
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const data = await request.json();
    
    // Generate a unique slug (random ID)
    data.slug = generateSlug();
    
    // Create the new term
    const newTerm = await FinancialTerm.create(data);
    
    return NextResponse.json(newTerm, { status: 201 });
  } catch (error) {
    console.error('Error creating financial term:', error);
    return NextResponse.json(
      { error: 'Failed to create financial term' },
      { status: 500 }
    );
  }
} 