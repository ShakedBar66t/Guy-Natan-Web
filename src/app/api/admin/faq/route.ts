import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FAQ from '@/models/FAQ';
import { verifyTokenWithClaims } from '@/lib/auth';

// GET - Fetch all FAQs
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    console.log('Connected to MongoDB for FAQs');
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const publishedOnly = searchParams.get('published') === 'true';
    
    // Build query
    let query = FAQ.find();
    
    // Filter by published status if needed
    if (publishedOnly) {
      query = query.find({ isPublished: true });
    }
    
    // Sort by order
    query = query.sort({ order: 1 });
    
    const faqs = await query.lean();
    
    console.log(`Fetched ${faqs.length} FAQs`);
    
    return NextResponse.json(faqs, { status: 200 });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch FAQs', error: String(error) },
      { status: 500 }
    );
  }
}

// POST - Create new FAQ
export async function POST(request: NextRequest) {
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
    
    const data = await request.json();
    
    // Create a new FAQ
    const faq = await FAQ.create(data);
    
    return NextResponse.json(faq, { status: 201 });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create FAQ', error: String(error) },
      { status: 500 }
    );
  }
} 