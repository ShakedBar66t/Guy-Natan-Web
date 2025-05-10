import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'מילון מושגים פיננסיים | גיא נתן',
  description: 'מילון מושגים פיננסיים מקיף להבנת עולם ההשקעות והכלכלה. הסברים ברורים למושגים מורכבים שיעזרו לכם להתמצא בעולם הפיננסי.',
  openGraph: {
    title: 'מילון מושגים פיננסיים | גיא נתן',
    description: 'מילון מושגים פיננסיים מקיף להבנת עולם ההשקעות והכלכלה. הסברים ברורים למושגים מורכבים שיעזרו לכם להתמצא בעולם הפיננסי.',
    url: 'https://guy-natan.vercel.app/glossary',
    siteName: 'גיא נתן',
    locale: 'he_IL',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png',
        width: 800,
        height: 600,
        alt: 'מילון מושגים פיננסיים - גיא נתן',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'מילון מושגים פיננסיים | גיא נתן',
    description: 'מילון מושגים פיננסיים מקיף להבנת עולם ההשקעות והכלכלה.',
    images: ['https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png'],
  },
};

export default metadata; 