import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';

export async function GET() {
  try {
    await dbConnect();
    
    console.log('Connected to MongoDB for adding a single verified YNET article');
    
    // First, delete all existing articles
    const deleteResult = await YnetArticle.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing YNET articles`);
    
    // Create a single article with a verified working URL
    // This URL was manually verified to work correctly
    const article = {
      title: "הקלות מזעריות ותוספת לנטו שהייתה מתעדכנת בכל מקרה | זו תוכנית החירום",
      publishedAt: new Date("2023-01-11"),
      link: "https://www.ynet.co.il/economy/article/rjvwuyhcj",
      slug: "economic-plan-" + Date.now(),
      isPublished: true
    };
    
    // Add the article to the database
    const savedArticle = await YnetArticle.create(article);
    
    console.log('Added a single verified YNET article:', savedArticle);
    
    return NextResponse.json({
      success: true,
      message: 'Added a single verified YNET article',
      article: savedArticle
    });
  } catch (error) {
    console.error('Error adding verified YNET article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add verified YNET article', error: String(error) },
      { status: 500 }
    );
  }
} 