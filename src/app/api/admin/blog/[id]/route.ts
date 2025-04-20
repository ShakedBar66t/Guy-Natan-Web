import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/BlogPost';

// Get a single blog post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    // Extract id from params
    const id = params.id;
    
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
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { id } = params;
    const data = await request.json();
    
    // Handle slug updates
    if (data.title && !data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      
      // Check if slug already exists and is not the current post
      const existingSlug = await BlogPost.findOne({ 
        slug: data.slug,
        _id: { $ne: id }
      });
      
      if (existingSlug) {
        data.slug = `${data.slug}-${Date.now()}`;
      }
    }
    
    // Set published date if being published for the first time
    if (data.isPublished === true) {
      const currentPost = await BlogPost.findById(id);
      if (!currentPost.isPublished) {
        data.publishedAt = new Date();
      }
    }
    
    const updatedPost = await BlogPost.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).populate({ path: 'relatedTerms', strictPopulate: false });
    
    if (!updatedPost) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }
    
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
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const deletedPost = await BlogPost.findByIdAndDelete(params.id);
    
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