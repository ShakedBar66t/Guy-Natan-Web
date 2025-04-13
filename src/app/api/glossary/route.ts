import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FinancialTerm from '@/models/FinancialTerm';

export async function GET() {
  try {
    await dbConnect();
    
    // Fetch all published financial terms, ordered first by order field, then by term
    const terms = await FinancialTerm.find({ isPublished: true })
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