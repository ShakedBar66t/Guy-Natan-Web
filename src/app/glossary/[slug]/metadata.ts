import type { Metadata } from 'next';
import { ResolvingMetadata } from 'next';
import dbConnect from '@/lib/db';

// Import the financial term model
import FinancialTerm from '@/models/FinancialTerm';

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

  let term: any = null;
  try {
    // Fetch the financial term by slug
    term = await FinancialTerm.findOne({ slug }).lean();
  } catch (error) {
    console.error('Error fetching financial term for metadata:', error);
  }

  // If term not found, return default metadata
  if (!term) {
    return {
      title: 'מושג לא נמצא | גיא נתן',
      description: 'המושג הפיננסי המבוקש לא נמצא במילון המושגים של גיא נתן.',
    };
  }

  // Extract term data with proper type casting
  const termName = term.term || 'מושג פיננסי';
  const definition = term.definition || '';

  // Create a description from the definition
  const description = definition 
    ? definition.substring(0, 150).replace(/<[^>]*>?/gm, '') + '...'
    : 'מושג פיננסי מהמילון של גיא נתן';

  // Return the metadata
  return {
    title: `${termName} | מילון מושגים פיננסיים | גיא נתן`,
    description,
    openGraph: {
      title: `${termName} | מילון מושגים פיננסיים | גיא נתן`,
      description,
      url: `https://guy-natan.vercel.app/glossary/${slug}`,
      siteName: 'גיא נתן',
      locale: 'he_IL',
      type: 'article',
      images: [
        {
          url: 'https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png',
          width: 1200,
          height: 630,
          alt: termName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${termName} | מילון מושגים פיננסיים | גיא נתן`,
      description,
      images: ['https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png'],
    },
  };
} 