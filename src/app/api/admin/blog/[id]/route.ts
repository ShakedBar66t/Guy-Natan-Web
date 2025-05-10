import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import '@/models/FinancialTerm'; // Import to ensure model is registered

// Get a single blog post by ID
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    // Extract id from params using context.params directly to avoid the warning
    const id = context.params.id;
    
    const blogPost = await BlogPost.findById(id)
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

// Update a blog post
export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    // Access id directly from context.params
    const id = context.params.id;
    const data = await request.json();
    
    // Get the current post first to check its state
    const currentPost = await BlogPost.findById(id);
    if (!currentPost) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Handle slug updates - slug is always auto-generated
    // But for edited posts, we'll keep the existing slug if it's not explicitly changed
    if (!data.slug) {
      // Generate slug from title
      const titleSlug = data.title
        .toLowerCase()
        .replace(/[^\w\s-]/gi, '') // Remove special chars except hyphens
        .replace(/\s+/g, '-')      // Replace spaces with dashes
        .replace(/-+/g, '-')       // Replace multiple hyphens with a single one
        .replace(/^-|-$/g, '');    // Trim leading/trailing hyphens
      
      // Keep existing slug timestamp part for consistency
      const existingSlugParts = currentPost.slug.split('-');
      const timestamp = existingSlugParts[existingSlugParts.length - 1];
      
      // Use the timestamp from the existing slug if it looks like a timestamp (numeric)
      if (timestamp && /^\d+$/.test(timestamp)) {
        data.slug = `${titleSlug}-${timestamp}`;
      } else {
        data.slug = `${titleSlug}-${Date.now()}`;
      }
    }
    
    // Handle publishing status changes
    if (data.isPublished === true && !currentPost.isPublished) {
      // If being published for the first time, set publishedAt date
      data.publishedAt = new Date();
      data.scheduledPublishDate = null; // Clear schedule when published immediately
    } else if (data.isPublished === false) {
      // If unpublishing, preserve or set scheduledPublishDate
      if (data.scheduledPublishDate) {
        data.scheduledPublishDate = new Date(data.scheduledPublishDate);
      }
    }
    
    const updatedPost = await BlogPost.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).populate({ path: 'relatedTerms', strictPopulate: false });
    
    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update blog post', error: String(error) },
      { status: 500 }
    );
  }
}

// Delete a blog post
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    // Access id directly from context.params
    const id = context.params.id;
    
    const deletedPost = await BlogPost.findByIdAndDelete(id);
    
    if (!deletedPost) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Blog post deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete blog post', error: String(error) },
      { status: 500 }
    );
  }
} 