import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import '@/models/FinancialTerm'; // Import to ensure model is registered

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Connect to MongoDB
    console.log('Connected to MongoDB');
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    
    // Parse limit if provided
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    
    // Build query
    let query = BlogPost.find({ isPublished: true })
      .populate({ path: 'relatedTerms', strictPopulate: false })
      .sort({ publishedAt: -1 }); // Sort by publish date, newest first
    
    // Apply limit if specified
    if (limit && !isNaN(limit)) {
      query = query.limit(limit);
    }
    
    // Execute query
    const blogPosts = await query.lean(); // Convert to plain JavaScript objects
    
    console.log(`Fetched ${blogPosts.length} published blog posts`);
    
    return NextResponse.json({ 
      posts: blogPosts,
      total: blogPosts.length
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog posts', error: String(error) },
      { status: 500 }
    );
  }
} 