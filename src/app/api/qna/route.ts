import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FAQ from '@/models/FAQ';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    console.log('Connected to MongoDB for FAQs');
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    
    // Parse limit if provided
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    
    // Build query - only published FAQs
    let query = FAQ.find({ isPublished: true }).sort({ order: 1 }); // Sort by order
    
    // Apply limit if specified
    if (limit && !isNaN(limit)) {
      query = query.limit(limit);
    }
    
    // Execute query
    const faqs = await query.lean(); // Convert to plain JavaScript objects
    
    console.log(`Fetched ${faqs.length} published FAQs`);
    
    // Check if there are any FAQs, if not, initialize with default ones
    if (faqs.length === 0) {
      console.log('No FAQs found, returning fallback data from API');
      
      // Create default FAQs - these will not be saved to DB
      // Just returned as response for now
      const defaultFaqs = [
        {
          _id: '1',
          question: "איך יודעים מה המסלול שהכי מתאים לי?",
          answer: "עבדנו כבר עם מאות לקוחות ולמדנו שצריך לעשות איפון מלא כדי לייצר תכנית מותאמת אישית לכל אדם.",
          isPublished: true,
          order: 1
        },
        {
          _id: '2',
          question: "אני לא במצב פיננסי הכי טוב, התכנית רלוונטית לי?",
          answer: "הייחוד של התכניות שלנו הוא ההתאמה המוחלטת אליכם, כך שהתכנית והמטרות שלה הן נגזרות של המצב והמטרות האישיות שלכם.",
          isPublished: true,
          order: 2
        },
        {
          _id: '3',
          question: "אני משקיע/ה כבר תקופה, מרגיש/ה שאני מוכן לNext-step, איזו תכנית מתאימה לי?",
          answer: "אם אתם מגיעים עם ידע בסיסי בפיננסים, נמליץ לרוב על תכנית \"המשקיע האקטיבי\" בה הופכים ממשקיעים פסיביים למשקיעים אקטיביים שיודעים לנתח מגמות בשוק ההון. בכל מקרה אפשר להתחיל מפגישה חד פעמית להתאמת תוכנית מושלמת עבורך.",
          isPublished: true,
          order: 3
        },
        {
          _id: '4',
          question: "כסף תמיד מלחיץ אותי ואני חושש/ת שזה קצת גדול עליי.",
          answer: "השינוי במצב הפיננסי הוא לא קסם וסיימנו, אלא תהליך שקורה בצעדים קטנים, בקצב שמתאים לך ולא בקצב שלנו. אחרת זה לא יעבוד. בכל מקרה הצעד הראשון הוא להבין מה המצב המצוי ומה הרצוי ורק משם ממשיכים.",
          isPublished: true,
          order: 4
        }
      ];
      
      return NextResponse.json(defaultFaqs, { status: 200 });
    }
    
    return NextResponse.json(faqs, { status: 200 });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch FAQs', error: String(error) },
      { status: 500 }
    );
  }
} 