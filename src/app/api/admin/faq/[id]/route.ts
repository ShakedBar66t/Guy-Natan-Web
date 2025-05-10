import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FAQ from '@/models/FAQ';
import { verifyTokenWithClaims } from '@/lib/auth';

// GET - Get a specific FAQ
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const id = context.params.id;
    
    const faq = await FAQ.findById(id).lean();
    
    if (!faq) {
      return NextResponse.json(
        { success: false, message: 'FAQ not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(faq, { status: 200 });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch FAQ', error: String(error) },
      { status: 500 }
    );
  }
}

// PATCH - Update a FAQ
export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Verify admin token
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { isAdmin } = await verifyTokenWithClaims(token);
    
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Admin privileges required' },
        { status: 403 }
      );
    }
    
    await dbConnect();
    
    const id = context.params.id;
    const data = await request.json();
    
    const faq = await FAQ.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();
    
    if (!faq) {
      return NextResponse.json(
        { success: false, message: 'FAQ not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(faq, { status: 200 });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update FAQ', error: String(error) },
      { status: 500 }
    );
  }
}

// DELETE - Delete a FAQ
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Verify admin token
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { isAdmin } = await verifyTokenWithClaims(token);
    
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Admin privileges required' },
        { status: 403 }
      );
    }
    
    await dbConnect();
    
    const id = context.params.id;
    
    const faq = await FAQ.findByIdAndDelete(id).lean();
    
    if (!faq) {
      return NextResponse.json(
        { success: false, message: 'FAQ not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'FAQ deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete FAQ', error: String(error) },
      { status: 500 }
    );
  }
} 