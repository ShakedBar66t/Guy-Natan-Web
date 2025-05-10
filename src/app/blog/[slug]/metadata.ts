import type { Metadata } from 'next';
import { ResolvingMetadata } from 'next';
import dbConnect from '@/lib/db';

// Import the blog post model
import BlogPost, { IBlogPost } from '@/models/BlogPost';

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

  let blogPost: any = null;
  try {
    // Fetch the blog post by slug
    blogPost = await BlogPost.findOne({ slug }).lean();
  } catch (error) {
    console.error('Error fetching blog post for metadata:', error);
  }

  // If blog post not found, return default metadata
  if (!blogPost) {
    return {
      title: 'מאמר לא נמצא | גיא נתן',
      description: 'המאמר המבוקש לא נמצא באתר של גיא נתן.',
    };
  }

  // Extract post data with proper type casting
  const title = blogPost.title || 'מאמר ללא כותרת';
  const excerpt = blogPost.excerpt || '';
  const content = blogPost.content || '';
  const coverImage = blogPost.coverImage || '';

  // Create a description from excerpt or content
  const description = excerpt || 
    (content ? content.substring(0, 150).replace(/<[^>]*>?/gm, '') : 'מאמר מקצועי מאת גיא נתן');

  // Resolve image path
  const imageUrl = coverImage || 'https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png';

  // Return the metadata
  return {
    title: `${title} | גיא נתן`,
    description,
    openGraph: {
      title: `${title} | גיא נתן`,
      description,
      url: `https://guy-natan.vercel.app/blog/${slug}`,
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
      title: `${title} | גיא נתן`,
      description,
      images: [imageUrl],
    },
  };
} 