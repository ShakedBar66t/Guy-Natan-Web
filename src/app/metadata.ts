import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'גיא נתן | ייעוץ פיננסי, השקעות וליווי כלכלי',
  description: 'כל הכלים והידע להחלטות פיננסיות חכמות. ייעוץ אישי, קורסים, מאמרים וליווי בעולם ההשקעות והכלכלה האישית.',
  openGraph: {
    title: 'גיא נתן | ייעוץ פיננסי, השקעות וליווי כלכלי',
    description: 'כל הכלים והידע להחלטות פיננסיות חכמות. ייעוץ אישי, קורסים, מאמרים וליווי בעולם ההשקעות והכלכלה האישית.',
    url: 'https://guy-natan.vercel.app',
    siteName: 'גיא נתן',
    locale: 'he_IL',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png',
        width: 1200,
        height: 630,
        alt: 'גיא נתן - ייעוץ פיננסי וליווי השקעות',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'גיא נתן | ייעוץ פיננסי, השקעות וליווי כלכלי',
    description: 'כל הכלים והידע להחלטות פיננסיות חכמות. ייעוץ אישי, קורסים ומאמרים.',
    images: ['https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png'],
  },
  keywords: [
    'גיא נתן', 
    'ייעוץ פיננסי', 
    'השקעות', 
    'כלכלה אישית', 
    'ליווי פיננסי', 
    'מסלולי השקעה',
    'ייעוץ השקעות',
    'תכנון פיננסי'
  ],
  authors: [{ name: 'גיא נתן' }],
  verification: {
    google: 'verification_token',
  },
};

export default metadata; 