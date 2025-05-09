import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';
import { verifyTokenWithClaims } from '@/lib/auth';

// GET - Fetch a specific YNET article by ID
export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    await dbConnect();
    
    const id = context.params.id;
    
    const article = await YnetArticle.findById(id).lean();
    
    if (!article) {
      return NextResponse.json(
        { success: false, message: 'YNET article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    console.error('Error fetching YNET article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch YNET article', error: String(error) },
      { status: 500 }
    );
  }
}

// PATCH - Update a specific YNET article
export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
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
    
    const article = await YnetArticle.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();
    
    if (!article) {
      return NextResponse.json(
        { success: false, message: 'YNET article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    console.error('Error updating YNET article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update YNET article', error: String(error) },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific YNET article
export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
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
    
    const article = await YnetArticle.findByIdAndDelete(id).lean();
    
    if (!article) {
      return NextResponse.json(
        { success: false, message: 'YNET article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'YNET article deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting YNET article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete YNET article', error: String(error) },
      { status: 500 }
    );
  }
} 