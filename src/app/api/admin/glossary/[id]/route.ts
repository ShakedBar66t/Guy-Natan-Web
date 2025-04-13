import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FinancialTerm from '@/models/FinancialTerm';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

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

// GET a single financial term by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const term = await FinancialTerm.findById(params.id).lean();
    
    if (!term) {
      return NextResponse.json(
        { error: 'Term not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(term);
  } catch (error) {
    console.error('Error fetching financial term:', error);
    return NextResponse.json(
      { error: 'Failed to fetch financial term' },
      { status: 500 }
    );
  }
}

// PUT update a financial term
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Remove slug from data to prevent changes to the auto-generated slug
    delete data.slug;
    
    // Update the term
    const updatedTerm = await FinancialTerm.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!updatedTerm) {
      return NextResponse.json(
        { error: 'Term not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedTerm);
  } catch (error) {
    console.error('Error updating financial term:', error);
    return NextResponse.json(
      { error: 'Failed to update financial term' },
      { status: 500 }
    );
  }
}

// DELETE a financial term
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const deletedTerm = await FinancialTerm.findByIdAndDelete(params.id);
    
    if (!deletedTerm) {
      return NextResponse.json(
        { error: 'Term not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting financial term:', error);
    return NextResponse.json(
      { error: 'Failed to delete financial term' },
      { status: 500 }
    );
  }
} 