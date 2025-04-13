import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';

// Get a single Ynet article by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const article = await YnetArticle.findById(params.id);
    
    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Ynet article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    console.error('Error fetching Ynet article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch Ynet article', error: String(error) },
      { status: 500 }
    );
  }
}

// Update a Ynet article
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const data = await request.json();
    console.log('Updating Ynet article with data:', data);
    
    // Ensure we have a slug - generate from title as fallback
    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^\w\sא-ת]/g, '')
        .replace(/\s+/g, '-')
        .trim();
        
      // Add timestamp to ensure uniqueness
      data.slug = `${data.slug}-${Date.now()}`;
    }
    
    // Check if slug already exists (excluding the current article)
    if (data.slug) {
      const existingArticle = await YnetArticle.findOne({ 
        slug: data.slug,
        _id: { $ne: params.id }
      });
      
      // If slug exists, make it unique by adding a timestamp
      if (existingArticle) {
        data.slug = `${data.slug}-${Date.now()}`;
      }
    }
    
    const updatedArticle = await YnetArticle.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true, runValidators: true }
    );
    
    if (!updatedArticle) {
      return NextResponse.json(
        { success: false, message: 'Ynet article not found' },
        { status: 404 }
      );
    }
    
    console.log('Ynet article updated successfully:', updatedArticle);
    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error) {
    console.error('Error updating Ynet article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update Ynet article', error: String(error) },
      { status: 500 }
    );
  }
}

// Delete a Ynet article
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const deletedArticle = await YnetArticle.findByIdAndDelete(params.id);
    
    if (!deletedArticle) {
      return NextResponse.json(
        { success: false, message: 'Ynet article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Ynet article deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting Ynet article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete Ynet article', error: String(error) },
      { status: 500 }
    );
  }
} 