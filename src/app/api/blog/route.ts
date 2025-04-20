import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import '@/models/FinancialTerm'; // Import to ensure model is registered

export async function GET() {
  try {
    await dbConnect();
    
    const blogPosts = await BlogPost.find({ isPublished: true })
      .populate({ path: 'relatedTerms', strictPopulate: false })
      .sort({ publishedAt: -1 }) // Sort by publish date, newest first
      .lean(); // Convert to plain JavaScript objects
    
    return NextResponse.json(blogPosts, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog posts', error: String(error) },
      { status: 500 }
    );
  }
} 