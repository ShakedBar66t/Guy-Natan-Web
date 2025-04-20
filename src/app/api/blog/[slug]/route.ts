import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import '@/models/FinancialTerm'; // Import to ensure model is registered

interface Params {
  params: {
    slug: string;
  };
}

export async function GET(request: NextRequest, context: Params) {
  try {
    await dbConnect();
    
    const { slug } = context.params;
    
    // Special case for 'new' slug which shouldn't be handled here
    if (slug === 'new') {
      return NextResponse.json(
        { success: false, message: 'Invalid slug: "new" is a reserved path' },
        { status: 404 }
      );
    }
    
    // Find the blog post by slug and ensure it's published
    // Use populate to include related terms data
    const blogPost = await BlogPost.findOne({ 
      slug,
      isPublished: true
    })
    .populate({ path: 'relatedTerms', strictPopulate: false })
    .lean();
    
    if (!blogPost) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(blogPost, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog post', error: String(error) },
      { status: 500 }
    );
  }
} 