import type { Metadata } from 'next';
import { ResolvingMetadata } from 'next';
import dbConnect from '@/lib/db';

// Import the YNET article model
import YnetArticle from '@/models/YnetArticle';

// Define the GenerateMetadataProps interface
interface GenerateMetadataProps {
  params: { slug: string };
}

export async function generateMetadata(
  { params }: GenerateMetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Connect to the database
  await dbConnect();

  // Get the slug from the params
  const { slug } = params;

  let article: any = null;
  try {
    // Fetch the YNET article by slug
    article = await YnetArticle.findOne({ slug }).lean();
  } catch (error) {
    console.error('Error fetching YNET article for metadata:', error);
  }

  // If article not found, return default metadata
  if (!article) {
    return {
      title: 'מאמר לא נמצא | גיא נתן',
      description: 'המאמר המבוקש מ-YNET לא נמצא באתר של גיא נתן.',
    };
  }

  // Extract article data with proper type casting
  const title = article.title || 'מאמר YNET';
  const excerpt = article.excerpt || '';
  const content = article.content || '';
  const coverImage = article.coverImage || article.imageUrl || '';

  // Create a description from excerpt or content
  const description = excerpt || 
    (content ? content.substring(0, 150).replace(/<[^>]*>?/gm, '') : 'מאמר מקצועי מאת גיא נתן שפורסם ב-YNET');

  // Resolve image path
  const imageUrl = coverImage || 'https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png';

  // Return the metadata
  return {
    title: `${title} | מאמרי YNET | גיא נתן`,
    description,
    openGraph: {
      title: `${title} | מאמרי YNET | גיא נתן`,
      description,
      url: `https://guy-natan.vercel.app/ynet/${slug}`,
      siteName: 'גיא נתן',
      locale: 'he_IL',
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | מאמרי YNET | גיא נתן`,
      description,
      images: [imageUrl],
    },
  };
} 