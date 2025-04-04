import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import YnetArticle from '@/models/YnetArticle';

interface IParams {
  params: {
    id: string;
  };
}

// GET a single YNET article by ID
export async function GET(req: NextRequest, { params }: IParams) {
  try {
    await connectToDatabase();
    
    const ynetArticle = await YnetArticle.findById(params.id);
    
    if (!ynetArticle) {
      return NextResponse.json(
        { error: 'YNET article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(ynetArticle);
  } catch (error) {
    console.error('Error fetching YNET article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch YNET article' },
      { status: 500 }
    );
  }
}

// PUT (update) a YNET article by ID
export async function PUT(req: NextRequest, { params }: IParams) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    
    const updatedYnetArticle = await YnetArticle.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!updatedYnetArticle) {
      return NextResponse.json(
        { error: 'YNET article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedYnetArticle);
  } catch (error) {
    console.error('Error updating YNET article:', error);
    return NextResponse.json(
      { error: 'Failed to update YNET article' },
      { status: 500 }
    );
  }
}

// DELETE a YNET article by ID
export async function DELETE(req: NextRequest, { params }: IParams) {
  try {
    await connectToDatabase();
    
    const deletedYnetArticle = await YnetArticle.findByIdAndDelete(params.id);
    
    if (!deletedYnetArticle) {
      return NextResponse.json(
        { error: 'YNET article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting YNET article:', error);
    return NextResponse.json(
      { error: 'Failed to delete YNET article' },
      { status: 500 }
    );
  }
} 