import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'הבלוג של גיא נתן | מאמרים ומושגים פיננסיים',
  description: 'עדכונים, מחקרים, והסברים בעולם ההשקעות וכלכלה. מאמרים מקצועיים ומושגים פיננסיים שיעזרו לך לקבל החלטות כלכליות חכמות.',
  openGraph: {
    title: 'הבלוג של גיא נתן | מאמרים ומושגים פיננסיים',
    description: 'עדכונים, מחקרים, והסברים בעולם ההשקעות וכלכלה. מאמרים מקצועיים ומושגים פיננסיים שיעזרו לך לקבל החלטות כלכליות חכמות.',
    url: 'https://guy-natan.vercel.app/blog',
    siteName: 'גיא נתן',
    locale: 'he_IL',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png',
        width: 800,
        height: 600,
        alt: 'בלוג גיא נתן',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'הבלוג של גיא נתן | מאמרים ומושגים פיננסיים',
    description: 'עדכונים, מחקרים, והסברים בעולם ההשקעות וכלכלה.',
    images: ['https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png'],
  },
};

export default metadata; 